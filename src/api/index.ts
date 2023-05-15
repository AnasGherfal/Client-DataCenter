import axios, { type CreateAxiosDefaults } from "axios";

const config : CreateAxiosDefaults = {
    baseURL: 'https://localhost:7003/api/'
}

const httpClient = axios.create(config);

export default httpClient;