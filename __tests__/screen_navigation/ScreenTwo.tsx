import React, { Component } from "react";
import { View, Text } from "react-native";

interface ScreenTwoProps {
  componentId: string;
  businessId: string;
  text: string;
}

class ScreenTwo extends Component<ScreenTwoProps> {
  constructor(props: ScreenTwoProps) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>Im screen two</Text>
        <Text>{this.props.text}</Text>
      </View>
    );
  }
}

export default ScreenTwo;
