import fp from 'fastify-plugin'
import * as admin from "firebase-admin";
import { CONFIG } from '../app';


export interface FirebasePluginOptions {
  // Specify Firebase plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<FirebasePluginOptions>(async (fastify, opts) => {
  if(CONFIG.firebase.enabled) {
    admin.initializeApp({
        credential: admin.credential.cert(CONFIG.firebase.configJson),
        databaseURL: CONFIG.firebase.databaseURL
      });
    fastify.decorate('firebase', admin);
  }
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    firebase: typeof admin;
  }
}
