import axios from "axios";
import {API_BASE_URL} from "@/src/constants";
import { setupInterceptors } from "./authInterceptor";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000
})

setupInterceptors(api);

export default api;

