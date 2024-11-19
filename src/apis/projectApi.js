import axiosClient from "./axiosClient";
import axiosClientV2 from "./axiosClientV2";

const projectAPI = {
    update: ({ data }) => {
        return axiosClient.put('/user', data);
    },
    getByUser: () => {
        return axiosClient.get('/user');
    },
    getAll: (id) => {
        return axiosClientV2.get(`/Project/${id}?includeRole=true&includeSprint=true&includeTask=true`)
    },
    getBacklog: (taskId) => {
        return axiosClientV2.get(`/Backlog/task/${taskId}`);
    },
    createBacklog: (data) => {
        return axiosClientV2.post('/Backlog', data);
    },
}

export default projectAPI;