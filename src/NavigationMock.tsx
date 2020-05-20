import React from "react";
import { Text } from 'react-native';
import { LayoutComponent, Options } from "react-native-navigation";
import { Subtract } from 'utility-types';


enum Event {
  PUSH_SCREEN = "push_screen",
  POP_SCREEN = "pop_screen"
}

type Callback = (data: EventData) => void;
export interface EventData {
  component: LayoutComponent;
}

class NativeNavigationMock {
  private screenStack: LayoutComponent[];
  private registedScreens: Map<string | number,{ componentProvider: () => React.ElementType}>;
  private subscribers: { [index in Event]: Callback[] };
  private componentIdCounter = 0;


  constructor() {
    this.screenStack = [];
    this.registedScreens = new Map<string | number, any>();
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

  push(componentId: string, { component }: { component: LayoutComponent }) {
    // call the current screen disappear event
    this.callComponentDidDisappear(componentId);

    // push the new screen
    this.screenStack.push(component);

    // call the new screen appear event
    this.callComponentDidAppear(component.name);

    this.dispatchEvent(Event.PUSH_SCREEN, { component });
  }

  // https://wix.github.io/react-native-navigation/docs/stack/#interact-with-the-stack-by-componentid
  pop(componentId: string, mergeOptions?: Options) {
    // pop the current screen
    const currentScreen = this.screenStack.pop();

    // call the current screen disappear event
    this.callComponentDidDisappear(currentScreen?.name ?? "");

    const newScreen = this.currentScreen;

    // call the new screen appear event
    this.callComponentDidAppear(newScreen.name);

    this.dispatchEvent(Event.POP_SCREEN, {
      component: newScreen
    });
    return this.currentScreen;
  }

  registerComponent(componentName: string, componentProvider: () => React.ElementType) {
    this.registedScreens.set(componentName, {
      componentProvider
    });
  }

  showModal() {}
  setStackRoot() {}
  setRoot() {}
  events() {
    return {
      registerCommandListener: () => {},
      registerModalDismissedListener: () => {},
      bindComponent: (component: any) => {
        // // First time appear
        // component?.componentDidAppear?.();
        // this.registedScreens.set(component.props.componentId, {
        //   componentDidAppear: component.componentDidAppear?.bind(component),
        //   componentDidDisappear: component.componentDidDisappear?.bind(
        //     component
        //   ),
        //   isMounted: component.updater.isMounted
        // });
      }
    };
  }

  getCurrentComponent(screens: any[], component: LayoutComponent) {
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

  get currentScreen() {
    return this.screenStack[this.screenStack.length - 1];
  }

  getRegistedScreen(name: string | number) {
    return this.registedScreens.get(name)
  }

  private callComponentDidAppear(componentId: string | number) {
    // call the current screen disappear event
    const component = this.registedScreens.get(String(componentId));
    // component?.componentDidAppear?.();
  }

  private callComponentDidDisappear(componentId: string | number) {
    // call the current screen disappear event
    const component = this.registedScreens.get(String(componentId));
    // component?.componentDidDisappear?.();
  }

  public get componenetId() {
    const id = `component-${this.componentIdCounter}`
    this.componentIdCounter += 1;
    return id;
  }
}

const nativeNavigationMock = new NativeNavigationMock();



export interface InjectedNavigationProps {
  Screen: React.ComponentType
}
export interface NavigationProps {
  component: LayoutComponent;
}

export interface NavigationState {
  currentComponent?: LayoutComponent ;
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
        nativeNavigationMock.push("__DEFAULT_STACK__", { component: props.component });
      }

      state = {
        currentComponent: undefined
      };

      UNSAFE_componentWillMount() {
        nativeNavigationMock.addEventListener(
          Event.PUSH_SCREEN,
          this.handleNewScreenEvent
        );
      }
      componentWillUnmount() {
        nativeNavigationMock.removeEventListener(
          Event.PUSH_SCREEN,
          this.handleNewScreenEvent
        );
      }

      handleNewScreenEvent = (e: EventData) => {
        this.setState({
          currentComponent: e.component
        });
      };

      render() {
        const component = this.state.currentComponent || this.props.component;
        const Screen = nativeNavigationMock.getRegistedScreen(component.name ?? "not_found")?.componentProvider()
        const { component: comp, ...props } = this.props
        if (Screen) {
          return <WrappedComponent {...props as unknown as T} Screen={() => <Screen {...component.passProps} componentId={nativeNavigationMock.componenetId}/>} />;
        }
        throw new Error(`No screnn named ${component.name} registered`)

      }
    };
  };


export default nativeNavigationMock;
