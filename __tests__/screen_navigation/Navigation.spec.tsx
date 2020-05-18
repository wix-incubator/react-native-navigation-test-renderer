import React from "react";
import { render, wait, fireEvent } from "@testing-library/react-native";
import { TestComponent } from "../../src";
import "../register_screens"

describe("Navigation between screens", () => {
  it("should move between screens", async () => {
    const { getByText } = render(
      <TestComponent
        component={{
          name: "EXAMPLES.SCREEN_ONE"
        }}
      />
    );


    expect(getByText(/screen one/i)).toBeTruthy();
    const button = getByText("next");
    fireEvent.press(button);
    await wait(() => expect(getByText(/screen two/i)).toBeTruthy());
  });
});
