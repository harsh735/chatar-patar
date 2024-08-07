import React, { useState } from 'react'
import { Box, Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useToast } from "@chakra-ui/react";
import { BellIcon , ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from '@chakra-ui/react'
import { ChatState } from '../../../context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks';
import axios from 'axios';
import ChatLoading from '../../ChatLoading';
import UserListItem from '../../UserAvatar/UserListItem';
import { Spinner } from '@chakra-ui/spinner';
import '../../../App.css';
import { getSender } from '../../../config/ChatLogics';
// import { Effect } from 'react-notification-badge'
// import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';



const SideDrawer = () => {

  const [search,setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading,setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user, setUser, setSelectedChat, chats, setChats, notification,setNotification } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure()

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setChats([]);
    setUser(null);
    history.push("/");
  };

  const toast = useToast();

  const handleSearch = async() => {
    if(!search){
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true)

      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
      };

      const {data} = await axios.get(`/api/user?search=${search}`,config);
      setLoading(false);
      setSearchResult(data);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }

  };


  const accessChat = async(userId) => {
    try {
      setLoadingChat(true);
      
      const config = {
        headers:{
          "Content-type": "application/json",
          Authorization:`Bearer ${user.token}`,
        },
      };

      const {data} = await axios.post('/api/chat',{userId},config);
      if(!chats.find((c) => c._id === data._id)){
        setChats([data,...chats]);
      }

      setSelectedChat(data); 
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


  return (
    <>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="black"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px"
    >
      <Tooltip label="Search Users to Chat" hasArrow placement='bottom-end'>
          <Button id="search-icon" variant="ghost" onClick={onOpen}>
            <i  className="fa-solid fa-magnifying-glass" style={{color:"white"}}></i>
            <Text  d={{base:"none", md:"flex"}} style={{color:"white", }} px="5">
              Search Users
            </Text>
          </Button>
      </Tooltip>
      
      <Text fontSize="2xl" fontFamily="Work sans">
        Chatar-Patar
      </Text>    
      <div >
        <Menu>
          <MenuButton p={1}>
            {/* <NotificationBadge 
              count={notification.length}
              effect={Effect.SCALE}
            /> */}
            <BellIcon m={1} fontSize="2xl"/>
          </MenuButton>
          <MenuList pl={3} color="black">
            {notification.length === 0 && "No new messages"}
            {notification.map(notif => (
              <MenuItem key={notif._id} onClick={() => {
                setSelectedChat(notif.chat);
                setNotification(notification.filter((n) => n !== notif));
              }}>
                {notif.chat.isGroupChat ? `New message in ${notif.chat.chatName}` 
                : `New message from ${getSender(user,notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Menu >
          <MenuButton background="black" as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar 
              size='sm'
              cursor='pointer'
              name={user.name} 
              src={user.pic}/>
          </MenuButton>
          <MenuList color="black">
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider/>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>
   
      <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
      <DrawerOverlay/>
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
          <Box display="flex" pb={2}>
              <Input 
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
          </Box>
          { loading ? <ChatLoading /> : 
             (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )
          }
          {loadingChat && <Spinner ml="auto" display="flex" />}
        </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer;