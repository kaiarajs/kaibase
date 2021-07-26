import fp from 'fastify-plugin';
import cookie from 'fastify-cookie';
import session from 'fastify-session';
import grant from 'grant';
import { CONFIG } from '../app';

export default fp(async (fastify) => {
    return fastify
        .register(cookie)
        .register(session, {
            secret: new Array(32).fill('a').join(''),
            cookie: { secure: false },
        })
        .register(
            grant.fastify()({
                defaults: {
                    transport: 'session',
                    origin: "https://24b37afd5121.ngrok.io",
                },
                google: {
                    key: CONFIG.google.client.id,
                    secret: CONFIG.google.client.secret,
                    callback: '/users/google/callback',
                    scope: CONFIG.google.scope,
                },
            }),
        );
});