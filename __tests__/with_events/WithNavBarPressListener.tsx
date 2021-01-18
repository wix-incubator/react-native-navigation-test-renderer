import React, {useLayoutEffect} from "react";
import {Navigation} from "react-native-navigation";
import {NavigationButtonPressedEvent} from "react-native-navigation/lib/src/interfaces/ComponentEvents";

export const WithNavBarPressListener = ({callback}: { callback: (event: NavigationButtonPressedEvent) => void }) => {
  useLayoutEffect(() => {
    const subscription = Navigation.events().registerNavigationButtonPressedListener(
      callback);
    return () => subscription.remove();
  }, [callback])
  return <></>
}
