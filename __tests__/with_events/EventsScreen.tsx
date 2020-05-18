import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import { Navigation } from "react-native-navigation";

interface EventsScreenProps {
  componentId: string;
  businessId: string;
  isDidAppearCalled: () => void;
  isDidDisappearCalled: () => void;
}

class EventsScreen extends Component<EventsScreenProps> {
  constructor(props: EventsScreenProps) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  componentDidAppear() {
    this.props.isDidAppearCalled();
  }

  componentDidDisappear() {
    this.props.isDidDisappearCalled();
  }

  render() {
    return (
      <View>
        <Text>Hello World</Text>
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

export default EventsScreen;
