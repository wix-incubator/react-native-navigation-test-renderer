import React from "react";
import { Text } from 'react-native';
import { LayoutComponent } from "react-native-navigation";
import { Subtract } from 'utility-types';


enum Event {
  NEW_SCREEN = "newscreen"
}

type Callback = (data: EventData) => void;
export interface EventData {
  component: LayoutComponent;
}

class NativeNavigationMock {
  private screenStack: LayoutComponent[];
  private registedScreens: Map<
    string | number,
    {
      componentProvider: () => React.ElementType
      // componentDidAppear?: () => void;
      // componentDidDisappear?: () => void;
      // isMounted: () => void;
    }
  >;
  private subscribers: {
    [index in Event]: Callback[];
  };

  constructor() {
    this.screenStack = [];
    this.registedScreens = new Map<string | number, any>();
    this.subscribers = {
      [Event.NEW_SCREEN]: []
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

  push(currentScreen: string, { component }: { component: LayoutComponent }) {
    // call the current screen disappear event
    this.callComponentDidDisappear(currentScreen ?? "");

    // push the new screen
    this.screenStack.push(component);

    // call the new screen appear event
    this.callComponentDidAppear(component.name);

    this.dispatchEvent(Event.NEW_SCREEN, { component });
  }

  pop() {
    // pop the current screen
    const currentScreen = this.screenStack.pop();

    // call the current screen disappear event
    this.callComponentDidDisappear(currentScreen?.name ?? "");

    const newScreen = this.currentScreen;

    // call the new screen appear event
    this.callComponentDidAppear(newScreen.name);

    this.dispatchEvent(Event.NEW_SCREEN, {
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
        nativeNavigationMock.push("__START_COMPONENT__", { component: props.component });
      }

      state = {
        currentComponent: undefined
      };

      UNSAFE_componentWillMount() {
        nativeNavigationMock.addEventListener(
          Event.NEW_SCREEN,
          this.handleNewScreenEvent
        );
      }
      componentWillUnmount() {
        nativeNavigationMock.removeEventListener(
          Event.NEW_SCREEN,
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
          return <WrappedComponent {...props as unknown as T} Screen={() => <Screen {...component.passProps}/>} />;
        }
        throw new Error(`No screnn named ${component.name} registered`)

      }
    };
  };


export default nativeNavigationMock;
