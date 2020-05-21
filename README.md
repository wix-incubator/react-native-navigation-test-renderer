### React Native Navigation Test Renderer
Allows developers to render RNN screens without depending on the native hierarchy maintained by RNN.

## Installation

- `npm install react-native-navigation-test-renderer --save`, or
- `yarn add react-native-navigation-test-renderer`


## The problem
You want to write tests for your RNN application, right now you have two main options e2e tests using Detox. 
Detox is great but the feedback loop is very slow. After all e2e tests are not suited for TDD. 
The second option is a component test, but those aren't testing much as you can't move between screens

## The solution
`react-native-navigation-test-renderer` provides you with the ability to move between screens, and to test complete flows with a fast feedback loop.

## Usage
Create a `TestComponent` and wrap it with `withNativeNavigation` HOC
```js
import React from "react";
import mockNavigation, {
  withNativeNavigation
} from "react-native-navigation-test-renderer";

// mock react-native-navigation imports with mockNavigation
jest.doMock("react-native-navigation", () => ({
  Navigation: mockNavigation
}));

 class TestComponent extends React.Component {
  render() {
    // withNativeNavigation injects the Screen to be rendered
    const { Screen } = this.props;
    return <Screen />;
  }
}


export default withNativeNavigation(TestComponent)
```

Now in your tests
```js
import React from "react";
import { render, wait } from "@testing-library/react-native";
import mockNavigation from "react-native-navigation-test-renderer";
import TestComponent from "../TestComponent";

class SimpleScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>Hello World</Text>
      </View>
    );
  }
}

mockNavigation.registerComponent("EXAMPLES.SIMPLE_SCEEN", () => SimpleScreen)

describe("Simple Screen Tests", () => {
  it("should render the screen", async () => {
    const { getByText } = render(
      <TestComponent
        component={{
          name: "EXAMPLES.SIMPLE_SCEEN"
        }}
      />
    );
    await wait();
    expect(getByText(/hello world/i)).toBeTruthy();
  });
});

```

See \__test__ directory for more examples
