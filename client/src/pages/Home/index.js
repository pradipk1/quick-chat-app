import { useSelector } from "react-redux";
import ChatArea from "./components/chat";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import {io} from 'socket.io-client';
import { useEffect, useState } from "react";

// making a socket connection with server
const socket = io('http://localhost:5000');

function Home() {
    const {selectedChat, user: currentUser} = useSelector(state => state.userReducer);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if(currentUser) {
            // emiting join-room event from client
            socket.emit('join-room', currentUser._id);

            socket.emit('user-login', currentUser._id);
            socket.on('online-users', onlineUsers => {
                setOnlineUsers(onlineUsers);
            });

            socket.on('updated-online-users', onlineUsers => {
                setOnlineUsers(onlineUsers);
            });
        }
    }, [currentUser]);

    return (
        <div className="home-page">
            <Header socket={socket} />
            <div className="main-content">
                <Sidebar socket={socket} onlineUsers={onlineUsers} />
                {selectedChat && <ChatArea socket={socket} />}
            </div>
        </div>
    );
}

export default Home;