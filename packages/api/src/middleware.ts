import {HTTP} from '@kaiarajs/kainox';
import {NextT, HandlerT} from '@kaiarajs/router';
import Http from '@kaiarajs/http';
import createError from 'http-errors';

const createMiddleware =
    (apiKeys: string[]): HandlerT =>
    (req: Http.Request, res: Http.Response, next: NextT): void => {
        const apiKey = req.get('x-api-key');
        return next(
            apiKey && apiKeys.includes(apiKey as string) ? undefined : createError(HTTP.UNAUTHORIZED)
        );
    };

export function apiKeyAuth(apiKeys: string[]): HandlerT;

export function apiKeyAuth(regExp: RegExp): HandlerT;

export function apiKeyAuth(apiKeysOrRegexp: string[] | RegExp): HandlerT {
    return createMiddleware(
        Array.isArray(apiKeysOrRegexp)
            ? apiKeysOrRegexp
            : loadApiKeys(apiKeysOrRegexp)
    );
}

const loadApiKeys = (regExp: RegExp): string[] =>
    Object.keys(process.env)
        .filter((key) => regExp.test(key))
        .map((key) => process.env[key] as string);