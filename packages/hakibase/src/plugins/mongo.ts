import fp from 'fastify-plugin'
import { MongoClient } from "mongodb";

export interface SupportPluginOptions {
  // Specify Support plugin options here
}



// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  try {
    const uri = "mongodb://localhost:27017/hakibase";
    const client = new MongoClient(uri);
    await client.connect();
    fastify.decorate('mongo', client);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    mongo: MongoClient;
  }
}
