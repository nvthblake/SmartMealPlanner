import React from "react";
import { createStore } from 'redux';
import ShoppingTab from "./app/tabs/ShoppingTab";

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
  return ( <ShoppingTab/> 
  );
}