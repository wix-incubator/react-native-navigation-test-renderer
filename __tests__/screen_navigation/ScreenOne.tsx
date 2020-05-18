import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import { Navigation } from "react-native-navigation";

interface ScreenOneProps {
  componentId: string;
  businessId: string;
}

class ScreenOne extends Component<ScreenOneProps> {
  constructor(props: ScreenOneProps) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>Im screen one</Text>
        <Button
          title="next"
          onPress={() => {
            Navigation.push(this.props.componentId, {
              component: {
                name: "EXAMPLES.SCREEN_TWO",
                passProps: {
                  text: "Pushed props"
                },
                options: {
                  topBar: {
                    title: {
                      text: "Pushed screen title"
                    }
                  }
                }
              }
            });
          }}
        />
      </View>
    );
  }
}

export default ScreenOne;
