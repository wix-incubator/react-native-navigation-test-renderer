import React from "react";
import mockNavigation, {
  withNativeNavigation,
  NavigationProps
} from ".";

jest.doMock("react-native-navigation", () => ({
  Navigation: mockNavigation
}));

interface PropTypes extends NavigationProps {
  locale?: string;
  screen?: any //TODO: type for react component coming from the HOC?
}

class TestComponent extends React.Component<PropTypes, {}> {
  static defaultProps = {
    locale: "en_US"
  };

  constructor(props: PropTypes, context: any) {
    super(props, context);

    mockNavigation.push("__START_COMPONENT__", { component: props.component });
  }

  render() {
    const { screen: Screen } = this.props;
    return <Screen />;
  }
}

export default withNativeNavigation<PropTypes>()(TestComponent);
