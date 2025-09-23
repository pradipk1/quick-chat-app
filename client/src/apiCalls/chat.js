import {axiosInstance, rootUrl} from './index';

export const getAllChats = async () => {
    try {
        const response = await axiosInstance.get(rootUrl + '/api/chat/get-all-chats');
        return response.data;
    } catch (error) {
        return error;
    }
}

export const createNewChat = async (members) => {
    try {
        const response = await axiosInstance.post(rootUrl + '/api/chat/create-new-chat', {members});
        return response.data;
    } catch (error) {
        return error;
    }
}

export const clearUnreadMessageCount = async (chatId) => {
    try {
        const response = await axiosInstance.post(rootUrl + '/api/chat/clear-unread-message', {chatId});
        return response.data;
    } catch (error) {
        return error;
    }
}
