import { useSelector } from "react-redux";

function UsersList({searchKey}) {
    const {allUsers, allChats} = useSelector((state) => state.userReducer);

    return (
        allUsers.filter(user => (
            ((user.firstname.toLowerCase().includes(searchKey) || 
            user.lastname.toLowerCase().includes(searchKey)) && searchKey) || 
            allChats.some(chat => chat.members.includes(user._id))
        )).map((user) => {
            return (
                <div className="user-search-filter">
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
                                    <button className="user-start-chat-btn">Start Chat</button>
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
