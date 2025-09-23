import {axiosInstance, rootUrl} from './index';

export const createNewMessage = async (message) => {
    try {
        const response = await axiosInstance.post(rootUrl + '/api/message/new-message', message);
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getAllMessages = async (chatId) => {
    try {
        const response = await axiosInstance.get(rootUrl + `/api/message/get-all-messages/${chatId}`);
        return response.data;
    } catch (error) {
        return error;
    }
}
