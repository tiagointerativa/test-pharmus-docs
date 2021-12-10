import { environment } from '../../environments/environment';

export class Api {
    urlApi: string;
    version: any;

    constructor() {
        this.urlApi = environment.url_api;
        this.version = environment.versao;
    }

    getUrlApi() {
        return this.urlApi;
    }

    getVersion() {
        return this.version;
    }
}