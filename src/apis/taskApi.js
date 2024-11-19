import axiosClient from "./axiosClient";

const taskAPI = {
    getByTasKIdAndProjectId: ({taskId}, {projectId}) => {
        return axiosClient.get('/task/' + taskId + '/project/' + projectId);
    }
}

export default taskAPI;