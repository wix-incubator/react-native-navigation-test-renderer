import React, { Component } from "react";
import {View, Text, Button} from "react-native";
import {Navigation} from "react-native-navigation";

interface ModalTwoProps {
  componentId: string;
}

class ModalTwo extends Component<ModalTwoProps> {
  constructor(props: ModalTwoProps) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>I'm the second modal</Text>
        <Button
          title="kill em all"
          onPress={() => Navigation.dismissAllModals()}
        />
      </View>
    );
  }
}

export default ModalTwo;
