import axios from "axios";
import qs from "qs";

const authService = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_AUTH_SERVICE_BASE_URL}/api/v1`,
    withCredentials: true,
    paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
    }
});

export default authService;
