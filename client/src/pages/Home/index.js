import { useSelector } from "react-redux";
import ChatArea from "./components/chat";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import {io} from 'socket.io-client';

function Home() {
    const {selectedChat} = useSelector(state => state.userReducer);

    // making a socket connection with server
    const socket = io('http://localhost:5000');

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