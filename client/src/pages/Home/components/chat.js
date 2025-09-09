import { useSelector } from 'react-redux';

function ChatArea() {
    const { selectedChat, user: currentUser } = useSelector(state => state.userReducer);
    const selectedUser = selectedChat.members.find(member => member._id !== currentUser._id);

    return (
        <div className="app-chat-area">
            <div className="app-chat-area-header">
                {selectedUser.firstname + ' ' + selectedUser.lastname}
            </div>
            <div>
                CHAT AREA
            </div>
            <div>
                SEND MESSAGE
            </div>
        </div>
    );
}

export default ChatArea;
