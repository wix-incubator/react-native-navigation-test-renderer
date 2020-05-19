import React from "react";
import { LayoutComponent } from "react-native-navigation";

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

export interface NavigationProps {
  component: LayoutComponent;
}

export function withNativeNavigation<T extends NavigationProps>() {
  return function(WrappedComponent: any) {
    return class NativeNavigationMockProvider extends React.PureComponent<T> {
      state = {
        component: null
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
          component: e.component
        });
      };

      render() {
        const component = this.state.component || this.props.component;
        const Screen = nativeNavigationMock.getRegistedScreen(component.name ?? "not_found")?.componentProvider()
        //@ts-ignore
        return <WrappedComponent {...this.props} screen={() => <Screen {...component.passProps}/>} />;
      }
    };
  };
}

export default nativeNavigationMock;
