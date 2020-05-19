import React from "react";
//@ts-ignore
import { render, wait, fireEvent } from "@testing-library/react-native";
import TestComponent from "../TestComponent";
import NavigationMock from "../../src/NavigationMock";

xdescribe("Events Screens", () => {
  let isDidAppearCalled: jest.Mock;
  let isDidDisappearCalled: jest.Mock;

  beforeEach(() => {
    isDidAppearCalled = jest.fn();
    isDidDisappearCalled = jest.fn();
  });
  it("should call componentDidAppear", async () => {
    //@ts-ignore
    const { getByText } = render(
      <TestComponent
        component={{
          name: "EXAMPLES.EVENTS_SCREEN",
          passProps: {
            isDidAppearCalled,
            isDidDisappearCalled
          }
        }}
      />
    );

    const button = getByText("next");
    fireEvent.press(button);
    NavigationMock.pop();
    expect(isDidAppearCalled).toBeCalled();
    expect(isDidDisappearCalled).toBeCalled();
  });
});
