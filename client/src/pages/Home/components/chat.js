import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {createNewMessage, getAllMessages} from './../../../apiCalls/message';
import {toast} from 'react-hot-toast';
import {showLoader, hideLoader} from './../../../redux/loaderSlice';

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

    useEffect(() => {
        getMessages();
    }, [selectedChat]);

    return (
        <div className="app-chat-area">
            <div className="app-chat-area-header">
                {selectedUser.firstname + ' ' + selectedUser.lastname}
            </div>
            <div className='main-chat-area'>
                {
                    allMessages.map(msg => {
                        const isCurrentUserSender = msg.sender === currentUser._id;
                        return <div className="message-container" 
                                style={isCurrentUserSender ? {justifyContent: 'end'} : {justifyContent: 'start'}}
                            >
                            <div className={isCurrentUserSender ? "send-message" : "received-message"}>
                                {msg.text}
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
