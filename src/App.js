// import logo from './logo.svg';
import './App.css';
// import { WeavyClient, WeavyProvider, Messenger } from '@weavy/uikit-react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import "react-chat-elements/dist/main.css"

import HomeScreen from './Screens/Home/HomeScreen';
import ChatScreen from './Screens/Chat/ChatScreen';


// const weavyClient = new WeavyClient({ 
//   url: "https://chat.weavy.io", 
//   tokenFactory: async () => "wyu_Fy2IHXZgNThnCYmlWyZy4T3zaY2tBo1NPaS8"
// });


function App() {
  return (
    <div className="App">
      {/* <WeavyProvider client={weavyClient}>
        <Messenger />
      </WeavyProvider> */}
  
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen/>}/>
          <Route path="/chat" element={<ChatScreen/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
