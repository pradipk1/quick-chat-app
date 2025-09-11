import { useSelector } from "react-redux";
import ChatArea from "./components/chat";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import {io} from 'socket.io-client';
import { useEffect } from "react";

// making a socket connection with server
const socket = io('http://localhost:5000');

function Home() {
    const {selectedChat, user: currentUser} = useSelector(state => state.userReducer);

    useEffect(() => {
        if(currentUser) {
            // emiting join-room event from client
            socket.emit('join-room', currentUser._id);
        }
    }, [currentUser]);

    return (
        <div className="home-page">
            <Header />
            <div className="main-content">
                <Sidebar />
                {selectedChat && <ChatArea socket={socket} />}
            </div>
        </div>
    );
}

export default Home;