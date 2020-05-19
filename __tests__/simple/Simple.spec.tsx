import React from "react";
import { render, wait } from "@testing-library/react-native";
import TestComponent from "../TestComponent";
import "../registerScreens"


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
