import {fireEvent, render} from "@testing-library/react-native";
import TestComponent from "../TestComponent";
import React from "react";
import "../registerScreens"

describe('Function Component', () => {
  it('should click on a navigation button of a functional component', () => {
    const TEST_ID = 'topbar.test.id';
    const renderResult = render(
      <TestComponent
        component={{
          name: "EXAMPLES.FUNCTIONAL",
          options: {
            topBar: {
              leftButtons: [
                {
                  text: 'test',
                  testID: TEST_ID,
                  id: 'topbar.id'
                }
              ]
            }
          }
        }}
      />
    );
    fireEvent.press(renderResult.getByTestId(TEST_ID))
  });
});
