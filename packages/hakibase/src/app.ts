import { join } from 'path';
import AutoLoad, {AutoloadPluginOptions} from 'fastify-autoload';
import { FastifyPluginAsync } from 'fastify';

const environment = process.env.NODE_ENV || 'local'
require("dotenv-json-complex")({ environment });
console.log(environment);
const envLoad = process.env?.[environment];
export const CONFIG = JSON.parse( envLoad || 'local');

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })

  fastify.addHook('onReady', async function () {
    console.log('initializing.....')
    await fastify.mongo.db(CONFIG.databaseName).collection('users').createIndex({ email: 1 }, { unique: true });
    const existConfigDbRoles = await fastify.mongo.db(CONFIG.databaseName).collection('_config').findOne({name: "security-roles"});
    if(!existConfigDbRoles) {
      await fastify.mongo.db(CONFIG.databaseName).collection('_config').insertOne({
        name: "security-roles",
        buckets: [
          { name: "test-bucket", secure: true, allowRead: ['admin', 'user'],allowWrite: ['admin'],allowUpdate: ['admin', 'user'],allowDelete: ['admin']}
        ],
        collections: [
          { name: "test-roles", secure: true, allowRead: ['admin', 'user'],allowWrite: ['admin'],allowUpdate: ['admin', 'user'],allowDelete: ['admin'] }
        ]
      })
    }
    console.log('Config ready')
  })
};

export default app;
export { app }
