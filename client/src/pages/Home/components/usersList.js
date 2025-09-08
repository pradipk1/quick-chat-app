import { useDispatch, useSelector } from "react-redux";
import {toast} from 'react-hot-toast'
import {createNewChat} from './../../../apiCalls/chat';
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllchats, setSelectedChat } from "../../../redux/usersSlice";

function UsersList({searchKey}) {
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
            chat.members.includes(currentUser._id) && 
            chat.members.includes(selectedUserId)
        ));

        if(chat) {
            dispatch(setSelectedChat(chat));
        }
    }

    return (
        allUsers.filter(user => (
            ((user.firstname.toLowerCase().includes(searchKey) || 
            user.lastname.toLowerCase().includes(searchKey)) && searchKey) || 
            allChats.some(chat => chat.members.includes(user._id))
        )).map((user) => {
            return (
                <div className="user-search-filter" onClick={() => {openChat(user._id)}} key={user._id}>
                    <div className="filtered-user">
                        <div className="filter-user-display">
                            {user.profilePic && <img src={user.profilePic} alt="Profile Pic" className="user-profile-image" />}
                            {!user.profilePic && <div className="user-default-profile-pic">
                                {
                                    user.firstname[0].toUpperCase() + user.lastname[0].toUpperCase()
                                }
                            </div>}
                            <div className="filter-user-details">
                                <div className="user-display-name">
                                    {user.firstname + ' ' + user.lastname}
                                </div>
                                <div className="user-display-email">{user.email}</div>
                            </div>
                            {
                                !allChats.find(chat => chat.members.includes(user._id)) &&
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
