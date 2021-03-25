import React, {Component} from "react";
import {View, Text, Button} from "react-native";
import {Navigation} from "react-native-navigation";

interface HostProps {
  componentId: string;
}

class Host extends Component<HostProps> {
  constructor(props: HostProps) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>I'm the host</Text>
        <Button
          title="show modal"
          onPress={() => {
            Navigation.showModal({
              stack: {
                children: [{
                  component: {
                    name: "EXAMPLES.MODAL_ONE",
                    passProps: {
                      buttonTitle: 'close me'
                    },
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

export default Host;
