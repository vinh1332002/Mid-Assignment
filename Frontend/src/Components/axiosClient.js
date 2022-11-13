import axios from "axios";
const AxiosClient = axios.create({
    baseURL: "https://localhost:7233/api"
  });

  const authRequestInterceptor = (
    config ) => {
    const accessToken = window.localStorage.getItem("access-token");
  
    if (accessToken) {
      if (config.headers) {
        config.headers["Authorization"] = `${accessToken}`;
      }
    }
    return config;
  };
  
  AxiosClient.interceptors.request.use(authRequestInterceptor);
  export default AxiosClient