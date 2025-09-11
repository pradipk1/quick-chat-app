import { useSelector } from "react-redux";
import ChatArea from "./components/chat";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import {io} from 'socket.io-client';
import { useEffect } from "react";

function Home() {
    const {selectedChat, user: currentUser} = useSelector(state => state.userReducer);

    // making a socket connection with server
    const socket = io('http://localhost:5000');

    useEffect(() => {
        if(currentUser) {
            // emiting join-room event from client
            socket.emit('join-room', currentUser._id);

            // emiting send-message event from client
            socket.emit('send-message', {text: 'Hi Merry!', recipient: '68ab484c9eb1e25134f6d280'});

            // listening receive-message event coming from server
            socket.on('receive-message', (data) => {
                console.log(data);
            });
        }
    }, [currentUser]);

    return (
        <div className="home-page">
            <Header />
            <div className="main-content">
                <Sidebar />
                {selectedChat && <ChatArea />}
            </div>
        </div>
    );
}

export default Home;