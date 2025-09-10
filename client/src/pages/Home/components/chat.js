import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {createNewMessage, getAllMessages} from './../../../apiCalls/message';
import {toast} from 'react-hot-toast';
import {showLoader, hideLoader} from './../../../redux/loaderSlice';
import moment from 'moment';

function ChatArea() {
    const dispatch = useDispatch();
    const { selectedChat, user: currentUser } = useSelector(state => state.userReducer);
    const selectedUser = selectedChat.members.find(member => member._id !== currentUser._id);
    const [message, setMessage] = useState('');
    const [allMessages, setAllMessages] = useState([]);

    const sendMesage = async () => {
        let response;
        try {
            const newMessage = {
                chatId: selectedChat._id,
                sender: currentUser._id,
                text: message
            }

            dispatch(showLoader());
            response = await createNewMessage(newMessage);
            dispatch(hideLoader());

            if(response.success) {
                setMessage('');
            }
        } catch (error) {
            dispatch(hideLoader());
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
    }, [selectedChat]);

    return (
        <div className="app-chat-area">
            <div className="app-chat-area-header">
                {formatName(selectedUser)}
            </div>
            <div className='main-chat-area'>
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
                                    {formatTime(msg.createdAt)}
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>
            <div className="send-message-div">
                <input type="text" 
                    className="send-message-input" 
                    placeholder="Type a message" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
