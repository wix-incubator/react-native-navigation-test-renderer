import React, { Component } from "react";
import { View, Text } from "react-native";

interface SimpleScreenProps {
  componentId: string;
  businessId: string;
}

class SimpleScreen extends Component<SimpleScreenProps> {
  constructor(props: SimpleScreenProps) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>Hello World</Text>
      </View>
    );
  }
}

export default SimpleScreen;
