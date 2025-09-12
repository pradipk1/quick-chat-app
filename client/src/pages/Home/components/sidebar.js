import { useState } from "react";
import Search from "./search";
import UsersList from "./usersList";

function Sidebar({socket}) {
    const [searchKey, setSearchKey] = useState('');

    return (
        <div className="app-sidebar">
            <Search searchKey={searchKey} setSearchKey={setSearchKey} />
            <UsersList searchKey={searchKey} socket={socket} />
        </div>
    );
}

export default Sidebar;
