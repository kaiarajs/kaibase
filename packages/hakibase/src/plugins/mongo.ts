import fp from 'fastify-plugin'
import { MongoClient } from "mongodb";
import { CONFIG } from '../app';

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp(async (fastify, opts) => {
  try {
    if(fastify.hasDecorator('mongo')) return;
    const uri = CONFIG.dbUrl;
    const client = new MongoClient(uri);
    await client.connect();
    client.db(CONFIG.databaseName).collection('users').createIndex({ email: 1 }, { unique: true });
    fastify.decorate('mongo', client);
    fastify.addHook('onClose', () => client.close());
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}, {name: "mongo"})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    mongo: MongoClient;
  }
}
