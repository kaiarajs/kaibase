import axios, { AxiosInstance } from "axios";
import { Db } from "./db";
import { Storage } from "./storage";
import { HakibaseConfig } from "./types";

export class Hakibase {

    config: HakibaseConfig
    axiosInstance: AxiosInstance;

    constructor(config: HakibaseConfig) {
        this.config = config;
        this.axiosInstance = axios.create({
            baseURL: this.config.serverUrl,
            timeout: 20000,
            headers: {'x-powered': 'hakibase'}
          });
    }

    db() {
        return new Db(this.axiosInstance);
    }

    storage() {
        return new Storage(this.axiosInstance);
    }

}