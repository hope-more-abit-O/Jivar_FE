import axiosClient from "./axiosClient";

const projectAPI = {
    update: ({data}) => {
        return axiosClient.put('/user', data);
    },
    getByUser: () => {
        return axiosClient.get('/user');
    }
}

export default projectAPI;