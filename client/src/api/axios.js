import axios from "axios";
import { refresh } from "../state/auth-state/authSlice";


const API_URL = import.meta.env.VITE_API_URL;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const axiosRequest = axios.create({
  baseURL: API_URL,
  headers,
});

export const axiosPrivate = axios.create({
  baseURL: API_URL,
  headers,
  withCredentials: true,
});

export const setupAxiosPrivate = (getAuthState, dispatch) => {
  axiosPrivate.interceptors.request.use(
    (config) => {
      const { token } = getAuthState();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  axiosPrivate.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const prevRequest = error?.config;
      console.log("Before Refresh");
      if (error?.response?.status === 401 && !prevRequest?.sent) {
        console.log("Refresh");
        prevRequest.sent = true;
        try {
          await dispatch(refresh()).unwrap();
          return axiosPrivate(prevRequest);
        } catch (error) {
          console.log(error);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosRequest;
