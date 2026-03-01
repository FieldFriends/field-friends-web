import { HttpMethods } from '#shared/constants';

export interface IApiRequest {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    requireAuth?: boolean;
}

export class ApiRequest implements IApiRequest {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    requireAuth?: boolean;

    constructor(init?: IApiRequest) {
        this.method = init?.method || HttpMethods.Get;
        this.body = init?.body;
        this.headers = init?.headers;
        this.requireAuth = init?.requireAuth;
    }
}