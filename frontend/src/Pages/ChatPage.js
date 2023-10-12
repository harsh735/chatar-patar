import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChatState } from '../context/ChatProvider';
import { Box, useToast } from '@chakra-ui/react';
import SideDrawer from '../components/Authentication/miscellaneous/SideDrawer';
import MyChats from '../components/Authentication/MyChats';
import ChatBox from '../components/Authentication/ChatBox';

const ChatPage = () => {
    
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false); 
    return (
        <div style={{ width: "100%", color: "white" }}>
            {user && <SideDrawer />}
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {user && 
                      <MyChats 
                        fetchAgain={fetchAgain}
                      />}
                {user && 
                      <ChatBox 
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}    
                      />}
            </Box>

        </div>
    );

}

export default ChatPage