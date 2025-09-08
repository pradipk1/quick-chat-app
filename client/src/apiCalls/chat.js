import axiosInstance from './index';

export const getAllChats = async () => {
    try {
        const response = await axiosInstance.get()
    } catch (error) {
        return error;
    }
}