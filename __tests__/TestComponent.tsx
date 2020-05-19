import React from "react";
import mockNavigation, { withNativeNavigation, InjectedNavigationProps } from '../src/NavigationMock';

jest.doMock("react-native-navigation", () => ({
  Navigation: mockNavigation
}));

interface Props extends InjectedNavigationProps {
  test?: string
}

 class TestComponent extends React.Component<Props> {
  render() {
    const { Screen } = this.props;
    return <Screen />;
  }
}


export default withNativeNavigation(TestComponent)
