import React, { Component } from "react";
import {View, Text, Button} from "react-native";
import {Navigation} from "react-native-navigation";

interface ModalOneProps {
  componentId: string;
  buttonTitle: string;
}

class ModalOne extends Component<ModalOneProps> {
  constructor(props: ModalOneProps) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>I'm the first modal</Text>
        <Button
          title={this.props.buttonTitle}
          onPress={() => Navigation.dismissModal(this.props.componentId)}
        />
        <Button
          title="show another"
          onPress={() => {
            Navigation.showModal({
              stack: {
                children: [{
                  component: {
                    name: "EXAMPLES.MODAL_TWO",
                  }
                }]
              }
            });
          }}
        />
      </View>
    );
  }
}

export default ModalOne;
