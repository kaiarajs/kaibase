import { FastifyPluginAsync } from "fastify"
import { CONFIG } from "../../app";
import { Document, Filter } from "mongodb";


interface Querystring {
  filter?: Filter<Document>
}

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{ Querystring: Querystring }>('/', async function (request, reply) {
    const { filter } = request.query;
    return fastify.mongo.db(CONFIG.databaseName).collection('users').find(filter || {}).toArray();
  })
}

export default users;
