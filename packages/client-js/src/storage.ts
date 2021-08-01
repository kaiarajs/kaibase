import { AxiosInstance } from "axios";

export class Storage {

    _axios: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this._axios = axiosInstance;
    }

    async put(path: string, object: string | Blob): Promise<any> {
        const formData = new FormData();
        formData.append("file", object);
        const req = await this._axios.post('/storage', formData,{ headers: { 'Content-Type': 'multipart/form-data', 'location': path }});
        if(req.status === 200) {
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

    async get(path: string): Promise<any> {
        const req = await this._axios.get('/storage',{ headers: { 'location': path  }});
        if(req.status === 200) {
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

    async getSignedUrl(path: string): Promise<any> {
        const req = await this._axios.get('/storage/getSignedUrl',{ headers: { 'location': path  }});
        if(req.status === 200) {
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

    async delete(path: string): Promise<any> {
        const req = await this._axios.delete('/',{ headers: { 'location': path  }});
        if(req.status === 200) {
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