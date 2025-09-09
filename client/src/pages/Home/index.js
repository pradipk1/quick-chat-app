import { useSelector } from "react-redux";
import ChatArea from "./components/chat";
import Header from "./components/header";
import Sidebar from "./components/sidebar";

function Home() {
    const {selectedChat} = useSelector(state => state.userReducer);

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