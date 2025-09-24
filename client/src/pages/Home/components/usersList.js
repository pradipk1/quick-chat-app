import { useDispatch, useSelector } from "react-redux";
import {toast} from 'react-hot-toast'
import {createNewChat} from './../../../apiCalls/chat';
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllchats, setSelectedChat } from "../../../redux/usersSlice";
import moment from "moment";
import store from './../../../redux/store';
import { useEffect } from "react";

function UsersList({searchKey, socket, onlineUsers}) {
    const dispatch = useDispatch();
    const {allUsers, allChats, user: currentUser, selectedChat} = useSelector((state) => state.userReducer);

    const startNewChat = async (searchedUserId) => {
        let response;
        try {
            dispatch(showLoader());
            response = await createNewChat([currentUser._id, searchedUserId]);
            dispatch(hideLoader());

            if(response.success) {
                toast.success(response.message);
                const newChat = response.data;
                const updatedChat = [...allChats, newChat];
                dispatch(setAllchats(updatedChat));
                dispatch(setSelectedChat(newChat));
            }
        } catch (error) {
            dispatch(hideLoader());
            toast.error(response.message);
        }
    }

    const openChat = (selectedUserId) => {
        const chat = allChats.find(chat => (
            chat.members.map(member => member._id).includes(currentUser._id) && 
            chat.members.map(member => member._id).includes(selectedUserId)
        ));

        if(chat) {
            dispatch(setSelectedChat(chat));
        }
    }

    const isSelectedChat = (user) => {
        if(selectedChat) {
            return selectedChat.members.map(m => m._id).includes(user._id);
        }
        return false;
    }

    const getLastMessage = (userId) => {
        const chat = allChats.find(chat => chat.members.map(m => m._id).includes(userId));

        if(!chat || !chat.lastMessage) {
            return '';
        } else {
            const msgPref = chat.lastMessage?.sender === currentUser._id ? 'You: ' : '';
            return msgPref + chat.lastMessage?.text.substring(0, 25);
        }
    }

    const getLastMessageTimestamp = (userId) => {
        const chat = allChats.find(chat => chat.members.map(m => m._id).includes(userId));

        if(!chat || !chat.lastMessage) {
            return '';
        } else {
            return moment(chat.lastMessage.createdAt).format('hh:mm A');
        }
    }

    const getUnreadMessageCount = (userId) => {
        const chat = allChats.find(chat => 
            chat.members.map(m => m._id).includes(userId)
        );

        if(chat && chat?.unreadMessageCount && chat.lastMessage?.sender !== currentUser._id) {
            return <div className="unread-message-counter">{chat.unreadMessageCount}</div>;
        } else {
            return "";
        }
    }

    const formatName = (user) => {
        const fname = user.firstname[0].toUpperCase() + user.firstname.slice(1).toLowerCase();
        const lname = user.lastname[0].toUpperCase() + user.lastname.slice(1).toLowerCase();
        return fname + ' ' + lname;
    }

    const getData = () => {
        if(searchKey === '') {
            return allChats;
        } else {
            return allUsers.filter(user => (
                user.firstname.toLowerCase().includes(searchKey) || 
                user.lastname.toLowerCase().includes(searchKey)
            ));
        }
    }

    useEffect(() => {
        socket.off('set-message-count').on('set-message-count', (message) => {
            let {selectedChat, allChats} = store.getState().userReducer;

            if(selectedChat?._id !== message.chatId) {
                const updatedAllChats = allChats.map(chat => {
                    if(chat._id === message.chatId) {
                        return {
                            ...chat,
                            unreadMessageCount: (chat?.unreadMessageCount || 0) + 1,
                            lastMessage: message
                        }
                    }
                    return chat;
                });
                allChats = updatedAllChats;
            }

            // sorting user list in real time
            // 1. find latest chat
            const latestChat = allChats.find(chat => chat._id === message.chatId);

            // 2. find all other chats
            const otherChats = allChats.filter(chat => chat._id !== message.chatId);

            // create a new array having the latest chat on top
            allChats = [latestChat, ...otherChats];

            dispatch(setAllchats(allChats));
        });
    }, []);

    return (
        getData()
        .map((obj) => {
            let user = obj;
            if(obj.members) {
                user = obj.members.find(m => m._id !== currentUser?._id);
            }
            return (
                <div className="user-search-filter" onClick={() => {openChat(user._id)}} key={user._id}>
                    <div className={isSelectedChat(user) ? "selected-user" : "filtered-user"}>
                        <div className="filter-user-display">
                            {user.profilePic && <img src={user.profilePic} 
                                                    alt="Profile Pic" 
                                                    className="user-profile-image" 
                                                    style={onlineUsers.includes(user._id) ? {border: '3px solid green'} : {}}
                                                />}
                            {!user.profilePic && <div 
                                                    className={isSelectedChat(user) ? "user-selected-avatar" : "user-default-avatar"}
                                                    style={onlineUsers.includes(user._id) ? {border: '3px solid green'} : {}}
                                                >
                                {
                                    user.firstname[0].toUpperCase() + user.lastname[0].toUpperCase()
                                }
                            </div>}
                            <div className="filter-user-details">
                                <div className="user-display-name">{formatName(user)}</div>
                                <div className="user-display-email">
                                    {getLastMessage(user._id) || user.email}
                                </div>
                            </div>
                            <div>
                                {getUnreadMessageCount(user._id)}
                                <div className="last-message-timestamp">{getLastMessageTimestamp(user._id)}</div>
                            </div>
                            {
                                !allChats.find(chat => chat.members.map(member => member._id).includes(user._id)) &&
                                <div className="user-start-chat">
                                    <button className="user-start-chat-btn" 
                                        onClick={() => {startNewChat(user._id)}}>
                                        Start Chat
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            )
        })
    );
}

export default UsersList;
