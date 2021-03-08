import React from "react";
import {Button, Text} from 'react-native';
import {Layout, LayoutComponent, NavigationButtonPressedEvent, Options} from "react-native-navigation";
import { Subtract } from 'utility-types';

enum Event {
  PUSH_SCREEN = "push_screen",
  POP_SCREEN = "pop_screen"
}

type Callback = (data: EventData) => void;
export interface EventData {
  component: LayoutComponent<any>;
}

interface ScreenInStack {
  componentId : string,
  component : LayoutComponent<any>
}

type LayoutProcessorCallback = (layout: Layout, commandName: string) => Layout

class NativeNavigationMock {
  private screenStack: ScreenInStack[];
  private registedScreens: Map<string | number,{ componentProvider: () => React.ElementType}>;
  private callbacksByComponentId: Map<string | number,any>;
  private subscribers: { [index in Event]: Callback[] };
  private componentIdCounter = 0;
  private navigationButtonPressListeners = new Set<(event: NavigationButtonPressedEvent) => void>();
  private layoutProcessorCallbacks : LayoutProcessorCallback[]


  constructor() {
    this.screenStack = [];
    this.registedScreens = new Map<string | number, any>();
    this.callbacksByComponentId = new Map<string | number, any>();
    this.layoutProcessorCallbacks = []
    this.subscribers = {
      [Event.PUSH_SCREEN]: [],
      [Event.POP_SCREEN]: []
    };
  }

  addEventListener(event: Event, callback: Callback) {
    this.subscribers[event].push(callback);
  }

  removeEventListener(event: Event, callback: Callback) {
    this.subscribers[event] = this.subscribers[event].filter(
      cb => cb !== callback
    );
  }

  dispatchEvent(event: Event, data: EventData) {
    this.subscribers[event].forEach(callback => {
      callback(data);
    });
  }

  push(componentId: string, { component }: { component: LayoutComponent<any> }) {
    this.componentIdCounter += 1;

    const currentScreenComponentId = this.currentScreen?.componentId;
    if (currentScreenComponentId) {
      this.callComponentDidDisappear(currentScreenComponentId);
    }

    this.screenStack.push({ componentId : this.componenetId, component });

    this.dispatchEvent(Event.PUSH_SCREEN, { component });
  }

  // https://wix.github.io/react-native-navigation/docs/stack/#interact-with-the-stack-by-componentid
  pop(componentId?: string, mergeOptions?: Options) {
    this.componentIdCounter -= 1;
    // pop the current screen
    const currentComponentId = this.screenStack.pop()?.componentId;

    if (currentComponentId){
      this.callComponentDidDisappear(currentComponentId);
      this.callbacksByComponentId.delete(currentComponentId)
    }

    const newScreen = this.currentScreen;
    if (newScreen){
      this.dispatchEvent(Event.POP_SCREEN, {
        component: newScreen.component
      });
    }
    return newScreen;
  }

  registerComponent(componentName: string, componentProvider: () => React.ElementType) {
    this.registedScreens.set(componentName, {
      componentProvider
    });
  }

  showModal(params) {
    const currentScreen = this.currentScreen
    if (currentScreen){
      Object.assign(params.stack.children[0].component?.passProps, {command: "showModal"});
      this.push(currentScreen.componentId, {component : params.stack.children[0].component})
    }
  }

  dismissModal(){
    this.pop();
  }

  setStackRoot() {}
  addLayoutProcessor(callback : LayoutProcessorCallback) {
    this.layoutProcessorCallbacks.push(callback)
  }
  addOptionProcessor () {}
  setRoot() {}
  mergeOptions() {}
  bindComponent = (component) => {
    var arr = this.callbacksByComponentId.get(component.props.componentId)
    if (!arr) arr = []
    const didAppearCallback = component.componentDidAppear?.bind(component)
    arr.push({
      componentDidAppear: didAppearCallback,
      componentDidDisappear: component.componentDidDisappear?.bind(
        component
      ),
      isMounted: component.updater.isMounted,
      navigationButtonPressed : component.navigationButtonPressed?.bind(component),
    })
    this.callbacksByComponentId.set(component.props.componentId, arr)
    didAppearCallback?.()

  }
  events = () => {
    return {
      registerCommandListener: () => {
      },
      registerComponentListener: () => {
      },
      registerModalDismissedListener: () => {
      },
      registerNavigationButtonPressedListener: (callback: (event: NavigationButtonPressedEvent) => void) => {
        this.navigationButtonPressListeners.add(callback);
        return {
          remove: () => {
            this.navigationButtonPressListeners.delete(callback);
          }
        }
      },
      bindComponent: this.bindComponent
    }
  }

  getCurrentComponent(screens: any[], component: LayoutComponent<any>) {
    const screen = screens.find(item => item.id === component.name);
    if (screen) {
      const Component = screen.generator();
      return (
        <Component componentId={component.name} {...component.passProps} />
      );
    } else {
      return undefined;
    }
  }

  get currentScreen() : ScreenInStack | undefined{
    if (this.screenStack.length > 0){
      return this.screenStack[this.screenStack.length - 1];
    } else{
      return undefined;
    }

  }

  getRegistedScreen(name: string | number) {
    return this.registedScreens.get(name)
  }

  private callComponentDidAppear(componentId: string | number) {
    // call the current screen disappear event
    const componentArr = this.callbacksByComponentId.get(componentId);
    componentArr?.forEach((component) => {
      component?.componentDidAppear?.();
    })
  }

  private callComponentDidDisappear(componentId: string | number) {
    const componentArr = this.callbacksByComponentId.get(componentId);
    componentArr?.forEach((component) => {
      component?.componentDidDisappear?.();
    })
  }

  public get componenetId() {
    const id = `component-${this.componentIdCounter}`;
    return id;
  }
  public addToStack(componentId, { component }) {
    this.screenStack.push({componentId, component});
  }

  onNavBarPressed(componentId, buttonId){
    const componentArr = this.callbacksByComponentId.get(componentId);
    componentArr?.forEach((component) => {
      component?.navigationButtonPressed?.({buttonId});
    });
    this.navigationButtonPressListeners.forEach(listener => listener({componentId, buttonId}));
  }

  processLayout(component,command){
    this.layoutProcessorCallbacks.forEach(callback => {
      // we need to do this since ui-lib checks specifically for stack.children[0] so passing
      // component is not enough
      const params = {
        stack : {
          children : [{ component }]
        }
      }
      callback(params, command);
    })
  }
}

const nativeNavigationMock = new NativeNavigationMock();



export interface InjectedNavigationProps {
  Screen: React.ComponentType
}
export interface NavigationProps {
  component: LayoutComponent<any>;
}

export interface NavigationState {
  currentComponent?: LayoutComponent<any>;
}

export function withNativeNavigation<T extends InjectedNavigationProps>(
  WrappedComponent: React.ComponentType<T>
) {
    return class NativeNavigationMockProvider extends React.Component<
      Subtract<T, InjectedNavigationProps> & NavigationProps,
      NavigationState
    > {

      constructor(props: any, context: any) {
        super(props, context);
        nativeNavigationMock.addToStack(nativeNavigationMock.componenetId, { component: props.component })
      }

      state = {
        currentComponent: undefined
      };

      UNSAFE_componentWillMount() {
        nativeNavigationMock.addEventListener(
          Event.PUSH_SCREEN,
          this.handleNewScreenEvent
        );
        nativeNavigationMock.addEventListener(
          Event.POP_SCREEN,
          this.handleNewScreenEvent
        );
      }
      componentWillUnmount() {
        nativeNavigationMock.removeEventListener(
          Event.PUSH_SCREEN,
          this.handleNewScreenEvent
        );
        nativeNavigationMock.removeEventListener(
          Event.POP_SCREEN,
          this.handleNewScreenEvent
        );
      }

      handleNewScreenEvent = (e: EventData) => {
        this.setState({
          currentComponent: e.component
        });
      };

      parseOptions= (options : Options, componentId) => {
        var btnsAndTitleArray : JSX.Element[] = []
        options?.topBar?.rightButtons?.forEach((button) => {
          const btn = this.parseButton(button, componentId)
          if (btn) btnsAndTitleArray.push(btn)
        })
        options?.topBar?.leftButtons?.forEach((button) => {
          const btn = this.parseButton(button, componentId)
          if (btn) btnsAndTitleArray.push(btn)
        })
        const  title = options?.topBar?.title?.text;
        if (title) btnsAndTitleArray.push(<Text key={title}>{title}</Text>);
        return btnsAndTitleArray
      }

      parseButton = (button, componentId) => {
        if (button.id && button.testID) {
          if (button.text || button.icon) {
            return <Button testID={button.testID} key={button.id} title={button.text || button.icon.toString()} onPress={() => nativeNavigationMock.onNavBarPressed(componentId, button.id)}/>
          } else {
            console.warn(`ParseOptions: TopBarButton ${button.id} must have "icon" or "text" props`)
            return undefined;
          }
        } else {
          console.warn(`ParseOptions: TopBarButton ${button.id} must have "id" and "testID" props`)
          return undefined;
        }
      }

      render() {
        const component = this.state.currentComponent || this.props.component;
        // @ts-ignore
        const asModal = component.passProps?.isModal;
        const Screen = nativeNavigationMock.getRegistedScreen(component.name ?? "not_found")?.componentProvider()
        const { component: comp, ...props } = this.props
        if (Screen !== undefined) {
          asModal ? Object.assign(component.passProps, {command: "showModal"}): null;

          // @ts-ignore
          const screenOptions = Screen.options?.(component.passProps)
          if (screenOptions){
            component.options = screenOptions
          }
          nativeNavigationMock.processLayout(component, component?.passProps?.command);
          const navBarComponent = component.options ? this.parseOptions(component.options, nativeNavigationMock.componenetId) : undefined;
          return (<>
              {navBarComponent}
              <WrappedComponent {...props as unknown as T} Screen={() => <Screen {...component.passProps} componentId={nativeNavigationMock.componenetId}/>} />;
              </>)
        }
        throw new Error(`No screnn named ${component.name} registered`)

      }
    };
  };


export default nativeNavigationMock;
