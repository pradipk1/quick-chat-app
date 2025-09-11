import { useSelector } from "react-redux";
import ChatArea from "./components/chat";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import {io} from 'socket.io-client';
import { useEffect } from "react";

function Home() {
    const {selectedChat} = useSelector(state => state.userReducer);

    // making a socket connection with server
    const socket = io('http://localhost:5000');

    useEffect(() => {
        // emiting an event from socket
        socket.emit('send-message-all', {text: 'Hi from John'});

        // listening an event coming from server
        socket.on('send-message-by-server', data => {
            console.log(data);
        })
    }, []);

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