import { Navigation } from "react-native-navigation";
import SimpleScreen from "./simple/SimpleScreen"
import ScreenOne from "./screen_navigation/ScreenOne"
import ScreenTwo from "./screen_navigation/ScreenTwo"
import {FunctionComponent} from "./functional/FunctionComponent";
import {WithNavBarPressListener} from "./with_events/WithNavBarPressListener";
import Host from "./modals/Host";
import ModalOne from "./modals/ModalOne";
import ModalTwo from "./modals/ModalTwo";

Navigation.registerComponent('EXAMPLES.SIMPLE_SCEEN', () => SimpleScreen);
Navigation.registerComponent('EXAMPLES.SCREEN_ONE', () => ScreenOne);
Navigation.registerComponent('EXAMPLES.SCREEN_TWO', () => ScreenTwo);
Navigation.registerComponent('EXAMPLES.FUNCTIONAL', () => FunctionComponent);
Navigation.registerComponent('EXAMPLES.NAV_BAR_PRESS_LISTENER', () => WithNavBarPressListener);
Navigation.registerComponent('EXAMPLES.HOST', () => Host);
Navigation.registerComponent('EXAMPLES.MODAL_ONE', () => ModalOne);
Navigation.registerComponent('EXAMPLES.MODAL_TWO', () => ModalTwo);
// Navigation.events().registerAppLaunchedListener(async () => {
//   console.log("OWOWOOWOWOWOOWOWOWOW")
//   Navigation.setRoot({
//     root: {
//       stack: {
//         children: [
//           {
//             component: {
//               name: 'Home'
//             }
//           }
//         ]
//       }
//     }
//   });
// });
