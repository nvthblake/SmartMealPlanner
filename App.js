import React from "react";
import { createStore } from 'redux';
import ProfileTab from "./app/tabs/ProfileTab";

// Redux Territory
import reducers from './reducers';

const store = createStore(reducers);

// export default function App() {
//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <AppNavigator />
//       </NavigationContainer>
//     </Provider>
//   );
// }
export default function App() {
  return ( <ProfileTab/> 
  );
}