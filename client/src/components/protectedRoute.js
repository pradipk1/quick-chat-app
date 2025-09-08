import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { getLoggedUser, getAllUsers } from "../apiCalls/users";
import {showLoader, hideLoader} from './../redux/loaderSlice';
import {setUser, setAllUsers, setAllchats} from './../redux/usersSlice';
import toast from "react-hot-toast";
import { getAllChats } from "../apiCalls/chat";


function ProtectedRoute({children}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getLoggedInUser = async () => {
        let response;
        try {
            dispatch(showLoader());
            response = await getLoggedUser();
            dispatch(hideLoader());

            if(response.success) {
                dispatch(setUser(response.data));
            } else {
                toast.error(response.message);
                navigate('/login');
            }
        } catch (error) {
            dispatch(hideLoader());
            toast.error(response.message);
            navigate('/login');
        }
    }

    const getAllUsersFromDb = async () => {
        let response;
        try {
            dispatch(showLoader());
            response = await getAllUsers();
            dispatch(hideLoader());

            if(response.success) {
                dispatch(setAllUsers(response.data));
            } else {
                toast.error(response.message);
                navigate('/login');
            }
        } catch (error) {
            dispatch(hideLoader());
            toast.error(response.message);
            navigate('/login');
        }
    }

    const getCurrentUserChats = async () => {
        let response;
        try {
            response = await getAllChats();
            
            if(response) {
                dispatch(setAllchats(response.data));
            } else {
                navigate('/login');
            }
        } catch (error) {
            navigate('/login');
        }
    }

    useEffect(() => {
        if(localStorage.getItem('token')) {
            getLoggedInUser();
            getAllUsersFromDb();
            getCurrentUserChats();
        } else {
            navigate('/login');
        }
    }, []);

    return (
        <div>
            {children}
        </div>
    );
}

export default ProtectedRoute;
