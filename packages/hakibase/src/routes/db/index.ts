import { FastifyInstance, FastifyPluginAsync } from "fastify"
import { Document } from "mongodb";
import { CONFIG } from "../../app";
import { HeadersDb, QuerystringDb, QuerystringDbGet } from "../../types";

const DbOpts = (fastify: FastifyInstance) => {
   return {
    schema: {
      headers: {
        properties: {
          collection: {
            type: 'string',
            maxLength: 20,
            minLength: 3
          },
        },
        required: ['collection']
      },
    },
    preValidation: [fastify.authenticate, fastify.secureRoles]
  }
}


const hakibase: FastifyPluginAsync =async (fastify, opts): Promise<void> => {
  fastify.get<{Headers: HeadersDb}>('/all-collections', DbOpts(fastify), async function (request, reply) {
    const db = await fastify.mongo.db(CONFIG.databaseName).collections();
    return reply.status(200).send(db)
  }),
  fastify.get<{Headers: HeadersDb, Querystring: QuerystringDbGet}>('/', DbOpts(fastify), async function (request, reply) {
    const { filter, sort, limit } = request.query
    const collection = request.headers['collection']
    const db = await fastify.mongo.db(CONFIG.databaseName).collection(collection).find(filter || {}).sort(sort || {}).limit(limit || 1000).toArray();
    return reply.status(200).send(db)
  }),
  fastify.post<{Headers: HeadersDb}>('/', DbOpts(fastify),  async function (request, reply) {
    const body = request.body as Document
    const collection = request.headers['collection']
    if(!body) return reply.status(403).send({ status: 403, msg: "body is empty!"})
    const db = await fastify.mongo.db(CONFIG.databaseName).collection(collection).insertOne(body)
    return reply.status(201).send(db)
  }),
  fastify.patch<{Headers: HeadersDb, Querystring: QuerystringDb}>('/', DbOpts(fastify), async function (request, reply) {
    const body = request.body as Document
    const { filter } = request.query
    const collection = request.headers['collection']
    if(!body) return reply.status(403).send({ status: 403, msg: "body is empty!"})
    const db = await fastify.mongo.db(CONFIG.databaseName).collection(collection).findOneAndUpdate(filter || {},body)
    return reply.status(201).send(db)
  }),
  fastify.delete<{Headers: HeadersDb, Querystring: QuerystringDb}>('/', DbOpts(fastify), async function (request, reply) {
    const { filter } = request.query
    const collection = request.headers['collection']
    const db = await fastify.mongo.db(CONFIG.databaseName).collection(collection).deleteOne(filter || {});
    return reply.status(201).send(db)
  })
}

export default hakibase;
