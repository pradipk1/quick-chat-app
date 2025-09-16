import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";



function Profile() {
    const {user: currentUser} = useSelector(state => state.userReducer);
    const [image, setImage] = useState('');

    function getInitials() {
        const f = currentUser?.firstname.toUpperCase()[0];
        const l = currentUser?.lastname.toUpperCase()[0];
        return f + l;
    }

    function getFullname() {
        const fname = currentUser?.firstname[0].toUpperCase() + currentUser?.firstname.slice(1).toLowerCase();
        const lname = currentUser?.lastname[0].toUpperCase() + currentUser?.lastname.slice(1).toLowerCase();
        return fname + ' ' + lname;
    }

    const onFileSelect = async (e) => {
        // getting the selected file
        const file = e.target.files[0];

        // reading the file as base 64 using FileReader constructor function
        const reader = new FileReader(file);

        // now reading file as data url
        reader.readAsDataURL(file);

        // listening onloadend event
        reader.onloadend = async () => {
            setImage(reader.result);
        }
    }

    useEffect(() => {
        if(currentUser?.profilePic) {
            setImage(currentUser.profilePic);
        }
    });

    return (
        <div class="profile-page-container">
            <div class="profile-pic-container">
                {
                    image && <img src={image} 
                        alt="Profile Pic" 
                        class="user-profile-pic-upload" 
                    />
                }
                {
                    !image && <div class="user-default-profile-avatar">
                        {getInitials()}
                    </div>
                }
            </div>

            <div class="profile-info-container">
                <div class="user-profile-name">
                    <h1>{getFullname()}</h1>
                </div>
                <div>
                    <b>Email: </b>{currentUser?.email}
                </div>
                <div>
                    <b>Account Created: </b>{moment(currentUser?.createdAt).format('MMM DD YYYY')}
                </div>
                <div class="select-profile-pic-container">
                    <input type="file" onChange={onFileSelect} />
                </div>
            </div>
        </div>
    )
}

export default Profile;