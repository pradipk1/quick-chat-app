import ChatArea from "./components/chat";
import Header from "./components/header";
import Sidebar from "./components/sidebar";

function Home() {
    return (
        <div className="home-page">
            <Header />
            <div className="main-content">
                <Sidebar />
                <ChatArea />
            </div>
        </div>
    );
}

export default Home;