import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {createNewMessage, getAllMessages} from './../../../apiCalls/message';
import {toast} from 'react-hot-toast';
import {showLoader, hideLoader} from './../../../redux/loaderSlice';
import moment from 'moment';
import { clearUnreadMessageCount } from '../../../apiCalls/chat';
import store from './../../../redux/store';
import { setAllchats } from '../../../redux/usersSlice';

function ChatArea({socket}) {
    const dispatch = useDispatch();
    const { selectedChat, user: currentUser, allChats } = useSelector(state => state.userReducer);
    const selectedUser = selectedChat.members.find(member => member._id !== currentUser._id);
    const [message, setMessage] = useState('');
    const [allMessages, setAllMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    const sendMesage = async () => {
        let response;
        try {
            const newMessage = {
                chatId: selectedChat._id,
                sender: currentUser._id,
                text: message
            }

            socket.emit('send-message', {
                ...newMessage,
                members: selectedChat.members.map(m => m._id),
                read: false,
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
            });

            response = await createNewMessage(newMessage);

            if(response.success) {
                setMessage('');
            }
        } catch (error) {
            toast.error(response.message);
        }
    }

    const getMessages = async () => {
        try {
            dispatch(showLoader());
            const response = await getAllMessages(selectedChat._id);
            dispatch(hideLoader());

            if(response.success) {
                setAllMessages(response.data);
            }
        } catch (error) {
            dispatch(hideLoader());
            toast.error(error.message);
        }
    }

    const clearUnreadMessages = async () => {
        try {
            socket.emit('clear-unread-messages', {
                chatId: selectedChat._id,
                members: selectedChat.members.map(m => m._id)
            });

            const response = await clearUnreadMessageCount(selectedChat._id);

            if(response.success) {
                allChats.map(chat => {
                    if(chat._id === selectedChat._id) {
                        return response.data;
                    }
                    return chat;
                });
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const formatTime = (timestamp) => {
        const now = moment();
        const diff = now.diff(moment(timestamp), 'days');

        if(diff < 1) {
            return `Today ${moment(timestamp).format('hh:mm A')}`;
        } else if(diff === 1) {
            return `Yesterday ${moment(timestamp).format('hh:mm A')}`;
        } else {
            return moment(timestamp).format('MMM D, hh:mm A');
        }
    }

    const formatName = (user) => {
        const fname = user.firstname[0].toUpperCase() + user.firstname.slice(1).toLowerCase();
        const lname = user.lastname[0].toUpperCase() + user.lastname.slice(1).toLowerCase();
        return fname + ' ' + lname;
    }

    useEffect(() => {
        getMessages();
        if(selectedChat?.lastMessage?.sender !== currentUser._id) {
            clearUnreadMessages();
        }

        socket.on('receive-message', message => {
            const selectedChat = store.getState().userReducer.selectedChat;

            if(selectedChat._id === message.chatId) {
                setAllMessages(prevmsg => [...prevmsg, message]);
            }

            if(selectedChat._id === message.chatId && message.sender !== currentUser._id) {
                clearUnreadMessages();
            }
        });

        socket.on('unread-message-count-cleared', data => {
            const {selectedChat, allChats} = store.getState().userReducer;

            if(selectedChat._id === data.chatId) {
                // clearing unread message count in chat object
                const updatedAllChats = allChats.map(chat => {
                    if(chat._id === data.chatId) {
                        return {...chat, unreadMessageCount: 0}
                    }
                    return chat;
                });
                dispatch(setAllchats(updatedAllChats));

                // updating read property to true in message object
                setAllMessages(prevMsgs => {
                    return prevMsgs.map(msg => {
                        return {...msg, read: true}
                    });
                });
            }
        });

        socket.on('started-typing', data => {
            if(selectedChat._id === data.chatId && data.sender !== currentUser._id) {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 2000);
            }
        })
    }, [selectedChat]);

    useEffect(() => {
        const msgContainer = document.getElementById('main-chat-area');
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }, [allMessages, isTyping]);

    return (
        <div className="app-chat-area">
            <div className="app-chat-area-header">
                {formatName(selectedUser)}
            </div>
            <div className='main-chat-area' id='main-chat-area'>
                {
                    allMessages.map(msg => {
                        const isCurrentUserSender = msg.sender === currentUser._id;
                        return <div className="message-container" 
                                style={isCurrentUserSender ? {justifyContent: 'end'} : {justifyContent: 'start'}}
                            >
                            <div>
                                <div className={isCurrentUserSender ? "send-message" : "received-message"}>
                                    {msg.text}
                                </div>
                                <div className='message-timestamp'
                                    style={isCurrentUserSender ? {float: 'right'} : {float: 'left'}}
                                >
                                    {formatTime(msg.createdAt)} {isCurrentUserSender && msg.read && 
                                        <i className='fa fa-check-circle' aria-hidden='true' style={{color: '#e74c3c'}}></i>}
                                </div>
                            </div>
                        </div>
                    })
                }
                <div className='typing-indicator'>{isTyping && <i>typing...</i>}</div>
            </div>
            <div className="send-message-div">
                <input type="text" 
                    className="send-message-input" 
                    placeholder="Type a message" 
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value)
                        socket.emit('user-typing', {
                            chatId: selectedChat._id,
                            members: selectedChat.members.map(m => m._id),
                            sender: currentUser._id
                        });
                    }}
                />
                <button className="fa fa-paper-plane send-message-btn" 
                    aria-hidden="true"
                    onClick={() => {sendMesage()}}
                ></button>
            </div>
        </div>
    );
}

export default ChatArea;
