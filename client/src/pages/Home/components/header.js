import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header() {
    const {user} = useSelector((state) => state.userReducer);
    const navigate = useNavigate();
    
    function getFullname() {
        const fname = user?.firstname[0].toUpperCase() + user?.firstname.slice(1).toLowerCase();
        const lname = user?.lastname[0].toUpperCase() + user?.lastname.slice(1).toLowerCase();
        return fname + ' ' + lname;
    }

    function getInitials() {
        const f = user?.firstname.toUpperCase()[0];
        const l = user?.lastname.toUpperCase()[0];
        return f + l;
    }

    return (
        <div className="app-header">
            <div className="app-logo">
                <i className="fa fa-comments" aria-hidden="true"></i>
                Quick Chat
            </div>
            <div className="app-user-profile">
                <div className="logged-user-name">{getFullname()}</div>
                {
                    user?.profilePic && <img src={user.profilePic} alt="profile-pic" 
                        className="logged-user-profile-pic" 
                        onClick={() => navigate('/profile')}
                    />
                }
                {!user?.profilePic && <div className="logged-user-profile-pic" onClick={() => navigate('/profile')}>
                    {getInitials()}
                </div>}
            </div>
        </div>
    );
}

export default Header;
