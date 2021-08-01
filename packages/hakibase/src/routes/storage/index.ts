import { FastifyInstance, FastifyPluginAsync } from "fastify"
import { CONFIG } from "../../app"

interface HeadersStorage {
  location: string;
}


const StorageOpts = (fastify: FastifyInstance) => {
  return {
    schema: {
      consumes: ['multipart/form-data'],
      headers: {
        properties: {
          location: {
            type: 'string',
            maxLength: 80,
            minLength: 3
          },
        },
        required: ['location']
      },
      body: {
        properties: {
          file: { isFileType: true },
        },
        required: ['file']
      }
    },
    preValidation: [fastify.authenticate, fastify.secureRoles]
  }
}

const storage: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{ Headers: HeadersStorage }>('/', StorageOpts(fastify), async function (request, reply) {
    const location = request.headers['location'];
    const data = await request.file();
    const buffer = await data.toBuffer();
    const upload = await fastify.storage.disk(CONFIG.storage.driver).put(location, buffer);
    reply.send(upload);
  }),
  fastify.get<{ Headers: HeadersStorage }>('/', StorageOpts(fastify), async function (request, reply) {
    const location = request.headers['location'];
    const upload = await fastify.storage.disk(CONFIG.storage.driver).get(location);
    reply.send(upload);
  }),
  fastify.get<{ Headers: HeadersStorage }>('/signedUrl', StorageOpts(fastify), async function (request, reply) {
    const location = request.headers['location'];
    const upload = await fastify.storage.disk(CONFIG.storage.driver).getSignedUrl(location);
    reply.send(upload);
  }),
  fastify.get<{ Headers: HeadersStorage }>('/exists', StorageOpts(fastify), async function (request, reply) {
    const location = request.headers['location'];
    const upload = await fastify.storage.disk(CONFIG.storage.driver).exists(location);
    reply.send(upload);
  }),
  fastify.get<{ Headers: HeadersStorage }>('/getBuffer', StorageOpts(fastify), async function (request, reply) {
    const location = request.headers['location'];
    const upload = await fastify.storage.disk(CONFIG.storage.driver).getBuffer(location);
    reply.send(upload);
  }),
  fastify.get<{ Headers: HeadersStorage }>('/getStat', StorageOpts(fastify), async function (request, reply) {
    const location = request.headers['location'];
    const upload = await fastify.storage.disk(CONFIG.storage.driver).getStat(location);
    reply.send(upload);
  }),
  fastify.delete<{ Headers: HeadersStorage }>('/', StorageOpts(fastify), async function (request, reply) {
    const location = request.headers['location'];
    const upload = await fastify.storage.disk(CONFIG.storage.driver).delete(location);
    reply.status(201).send(upload);
  })
}

export default storage;
