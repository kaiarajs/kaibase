import { AxiosInstance } from "axios";

export class Auth {

    _axios: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this._axios = axiosInstance;
    }

    async loginWithEmailAndPassword(email: string, password: string): Promise<any> {
        const req = await this._axios.post('/auth/login-with-email-and-password', { email, password });
        if(req.status === 200) {
            this._axios.defaults.headers.common['Authorization'] = `Bearer ${req.data.token}`;
            return {
                success: true,
                data: req.data
            }
        } else {
            return {
                success: false,
                data: req.data || null
            }
        }
    }

    async registerWithEmailAndPassword(email: string, password: string): Promise<any> {
        const req = await this._axios.post('/auth/register-with-email-and-password', { email, password });
        if(req.status === 201) {
            this._axios.defaults.headers.common['Authorization'] = `Bearer ${req.data.token}`;
            return {
                success: true,
                data: req.data
            }
        } else {
            return {
                success: false,
                data: req.data || null
            }
        }
    }
}