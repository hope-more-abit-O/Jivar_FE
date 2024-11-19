import axiosClient from "./axiosClient";

const accountAPI = {
    update: ({data}) => {
        return axiosClient.put('/account/info', data);
    }
}

export default accountAPI;