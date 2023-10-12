import './App.css';
import {Route} from "react-router-dom";
import Homepage from "./Pages/Homepage";
import ChatPage from "./Pages/ChatPage";
import { Button, ButtonGroup, omitThemingProps } from '@chakra-ui/react';


function App() {
  return (
    <div className="App">
      <Route path='/'  component={Homepage} exact/>
      <Route path='/chats' component={ChatPage}/>
    </div>
  );
}

export default App;
