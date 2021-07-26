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
    const db = await fastify.mongo.db(CONFIG.databaseName).collection(collection).find(filter || {}).toArray();
    return reply.status(200).send(db)
  }),
  fastify.post<{Headers: Headers}>('/', async function (request, reply) {
    const body = request.body as Document
    const collection = request.headers['collection']
    if(!body) return reply.status(403).send({ status: 403, msg: "body is empty!"})
    const db = await fastify.mongo.db(CONFIG.databaseName).collection(collection).insertOne(body)
    return reply.status(201).send(db)
  }),
  fastify.delete<{Headers: Headers, Querystring: Querystring}>('/', async function (request, reply) {
    const { filter } = request.query
    const collection = request.headers['collection']
    const db = await fastify.mongo.db(CONFIG.databaseName).collection(collection).deleteOne(filter || {});
    return reply.status(201).send(db)
  })
}

export default hakibase;
