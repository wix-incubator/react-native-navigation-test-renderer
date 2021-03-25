// @ts-ignore
import React from "react";
import { render, wait, fireEvent } from "@testing-library/react-native";
import TestComponent from "../TestComponent";
import "../registerScreens"

describe('modal', () => {
  it('is opened and then dismissed', async () => {
    const { findByText } = render(
      // @ts-ignore
      <TestComponent
        component={{
          name: "EXAMPLES.HOST"
        }}
      />
    );

    expect(await findByText(/I'm the host/i)).toBeTruthy();
    fireEvent.press(await findByText('show modal'));
    expect(await findByText(/I'm the first modal/i)).toBeTruthy();
    fireEvent.press(await findByText('close me'));
    expect(await findByText(/I'm the host/i)).toBeTruthy();

  })

  it('dismisses all modals', async () => {
    const { findByText } = render(
      // @ts-ignore
      <TestComponent
        component={{
          name: "EXAMPLES.HOST"
        }}
      />
    );

    fireEvent.press(await findByText('show modal'));
    fireEvent.press(await findByText('show another'));
    expect(await findByText(/I'm the second modal/i)).toBeTruthy();
    fireEvent.press(await findByText('kill em all'));
    expect(await findByText(/I'm the host/i)).toBeTruthy();

  })
});
