import { FastifyPluginAsync } from "fastify"
import { Document, Filter } from "mongodb";
import { CONFIG } from "../../app";

interface Headers {
  'collection': string;
}

interface Querystring {
  filter?: Filter<Document>
}

const hakibase: FastifyPluginAsync =async (fastify, opts): Promise<void> => {
  fastify.get<{Headers: Headers, Querystring: Querystring}>('/', async function (request, reply) {
    const { filter } = request.query
    const collection = request.headers['collection']
    return fastify.mongo.db(CONFIG.databaseName).collection(collection).find(filter || {}).toArray();
  }),
  fastify.post<{Headers: Headers}>('/', async function (request, reply) {
    const body = request.body as Document
    const collection = request.headers['collection']
    if(!body) return reply.status(403).send({ status: 403, msg: "body is empty!"})
    return fastify.mongo.db(CONFIG.databaseName).collection(collection).insertOne(body)
  }),
  fastify.delete<{Headers: Headers, Querystring: Querystring}>('/', async function (request, reply) {
    const { filter } = request.query
    const collection = request.headers['collection']
    return fastify.mongo.db(CONFIG.databaseName).collection(collection).deleteOne(filter || {});
  })
}

export default hakibase;
