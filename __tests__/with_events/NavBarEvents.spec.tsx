import {fireEvent, render} from "@testing-library/react-native";
import TestComponent from "../TestComponent";
import NavigationMock from "../../src/NavigationMock";
import React from "react";
import "../registerScreens"

describe('NavBar Events', () => {
  it('should call navigation button pressed', () => {
    const TEST_ID = 'top-bar.button';
    const BUTTON_ID = 'button';
    const callbackMock = jest.fn();
    const driver = render(
      <TestComponent
        component={{
          name: "EXAMPLES.NAV_BAR_PRESS_LISTENER",
          passProps: {
            callback: callbackMock
          },
          options: {
            topBar: {
              leftButtons: [{
                text: 'some',
                id: BUTTON_ID,
                testID: TEST_ID
              }]
            }
          }
        }}
      />
    );

    fireEvent.press(driver.getByTestId(TEST_ID));

    expect(callbackMock).toBeCalledWith({
      componentId: NavigationMock.componenetId,
      buttonId: BUTTON_ID
    })
  });
})
