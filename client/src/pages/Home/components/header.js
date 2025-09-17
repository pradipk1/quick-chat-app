import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header({socket}) {
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

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');

        socket.emit('user-logout', user._id);
    }

    return (
        <div className="app-header">
            <div className="app-logo">
                <i className="fa fa-comments" aria-hidden="true"></i>
                Quick Chat
            </div>
            <div className="app-user-profile">
                {
                    user?.profilePic && <img src={user.profilePic} alt="profile-pic" 
                        className="logged-user-profile-pic" 
                        onClick={() => navigate('/profile')}
                    />
                }
                {
                    !user?.profilePic && <div className="logged-user-profile-pic" onClick={() => navigate('/profile')}>
                        {getInitials()}
                    </div>
                }
                <div className="logged-user-name">{getFullname()}</div>
                <button className="logout-btn" onClick={logout}>
                    <i className="fa fa-power-off"></i>
                </button>
            </div>
        </div>
    );
}

export default Header;
