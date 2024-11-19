import axiosClient from "./axiosClient";

const accountAPI = {
    update: ({ data }) => {
        return axiosClient.put('/account/info', data);
    },
    getById: ({ id }) => {
        return axiosClient.get(`/account/info/user/${id}`);
    }
}

export default accountAPI;