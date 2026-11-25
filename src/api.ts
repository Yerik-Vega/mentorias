import axios from 'axios';
import type {User, LoginResponse} from "./types.ts";

const api = axios.create({ baseURL: "https://mentoriautec-api.aaron-navarro.workers.dev/api"})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Autorization = `Bearer ${token}`
    }
    return config;
})

api.interceptors.response.use(
    (response)=>response,
    (error) => {if(axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
    }
    return Promise.reject(error);
    }
)

export const registerUser = (data:{email: string, name: string, password: string}
) => api.post("/auth/register", data)

export const loginUser = (email:string, password:string
) => api.post<LoginResponse>("/auth/login", {email, password}).then((r)=>r.data)

export const getCurrentUser = () =>
    api.get<User>("/user/current").then((r)=>r.data)


