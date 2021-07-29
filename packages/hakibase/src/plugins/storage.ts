import { StorageManagerConfig } from '@slynova/flydrive'
import fp from 'fastify-plugin'
import { StorageManager } from '@slynova/flydrive';
import { AmazonWebServicesS3Storage } from '@slynova/flydrive-s3';
import { CONFIG } from '../app';

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<StorageManagerConfig>(async (fastify, opts) => {
  if (CONFIG.storage.driver === 's3') {
    const storage = new StorageManager(CONFIG.storage);
    storage.registerDriver('s3', AmazonWebServicesS3Storage);
    fastify.decorate('storage', storage);
  } else {
    const storage = new StorageManager({
      default: 'local', disks: {
        local: {
          driver: 'local',
          config: {
            root: process.cwd(),
          },
        }
      }
    });
    fastify.decorate('storage', storage);
  }
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    storage: StorageManager;
  }
}
