import React from 'react'
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { ChatState } from '../context/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';

const ScrollableChat = ({ messages }) => {

    const { user } = ChatState();

    return (
        <ScrollableFeed>
            {messages && messages.map((m, idx) => (
                <div style={{ display: "flex" }} key={m._id}>
                    {(isSameSender(messages, m, idx, user._id)
                        || isLastMessage(messages, idx, user._id)) 
                        &&  <Tooltip 
                                label={m.sender.name} 
                                placeContent="bottom-start" 
                                hasArrow
                            >
                                <Avatar 
                                    mt="7px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.pic}
                                />
                            </Tooltip>
                    }
                    <span style={{backgroundColor: 
                                `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                                borderRadius: "20px",
                                padding:"5px 12px",
                                maxWidth: "75%",
                                marginLeft: isSameSenderMargin(messages,m,idx,user._id),
                                marginTop: isSameUser(messages,m,idx,user._id) ? 3 : 10,
                           }}
                    >
                        {m.content}
                    </span>
                </div>
            ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat