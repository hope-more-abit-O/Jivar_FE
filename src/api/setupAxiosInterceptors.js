import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const setupAxiosInterceptors = (showNotification) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        Cookies.remove("accessToken");
        showNotification("Session expired. Please log in again."); 
        const navigate = useNavigate();
        navigate("/authentication/sign-in");
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
