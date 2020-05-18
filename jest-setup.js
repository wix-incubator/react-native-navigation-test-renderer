
/**
 * Mocks for working with uilib
 *
import { NativeModules, AccessibilityInfo } from "react-native";

jest.mock("react-native-device-info", () => ({
  getDeviceLocale: () => "en",
  getVersion: () => "123.123.123",
  getDeviceId: () => "DEVICE_ID",
  isTablet: () => false
}));

jest.mock("@react-native-community/netinfo", () => ({
  getCurrentState: jest.fn(),
  addEventListener: jest.fn()
}));
jest.mock("react-native-reanimated/src/ReanimatedEventEmitter");
jest.mock("react-native-reanimated/src/ReanimatedModule", () => ({
  configureNativeProps: jest.fn(),
  connectNodes: jest.fn(),
  disconnectNodes: jest.fn(),
  createNode: jest.fn(),
  configureProps: jest.fn(),
  getValue: jest.fn(),
  dropNode: jest.fn(),
  attachEvent: jest.fn(),
  detachEvent: jest.fn()
}));


NativeModules.StatusBarManager.getHeight = jest.fn();
NativeModules.RNGestureHandlerModule = {
  createGestureHandler: jest.fn(),
  attachGestureHandler: jest.fn(),
  dropGestureHandler: jest.fn()
};
jest.mock("react-native/Libraries/LayoutAnimation/LayoutAnimation", () => ({
  ...require.requireActual(
    "react-native/Libraries/LayoutAnimation/LayoutAnimation"
  ),
  configureNext: jest.fn()
}));

global.fetch = jest.fn();
global.window = {};


jest.mock("react-native-navigation", () => ({
  Navigation: {
    push: jest.fn(),
    showModal: jest.fn(),
    mergeOptions: jest.fn(),
    setRoot: jest.fn(),
    registerComponent: jest.fn(),
    events: () => ({
      registerCommandListener: jest.fn(),
      registerModalDismissedListener: jest.fn(),
      bindComponent: jest.fn()
    }),
    setStackRoot: jest.fn()
  }
}));


jest
  .spyOn(AccessibilityInfo, "fetch")
  .mockImplementation(() => new Promise.resolve(false));

jest
  .spyOn(AccessibilityInfo, "isScreenReaderEnabled")
  .mockImplementation(() => new Promise.resolve(false));
*/
