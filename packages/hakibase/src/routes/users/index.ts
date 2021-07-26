import { FastifyPluginAsync, RouteShorthandOptions } from "fastify"
import bcrypt from "bcrypt";
import { CONFIG } from "../../app";
import { Document, Filter } from "mongodb";

interface BodyEmailAndPassword {
  email: string,
  password: string
}

interface Querystring {
  filter?: Filter<Document>
}

const BodyEmailAndPasswordOpts: RouteShorthandOptions = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          maxLength: 20,
          minLength: 3
        },
        password: {
          type: 'string',
          maxLength: 30,
          minLength: 5
        },
      },
      required: ['email', 'password']
    },
  }
}

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{ Querystring: Querystring }>('/', async function (request, reply) {
    const { filter } = request.query;
    return fastify.mongo.db(CONFIG.databaseName).collection('users').find(filter || {}).toArray();
  }),
    fastify.post<{ Body: BodyEmailAndPassword }>('/with-email-and-password', BodyEmailAndPasswordOpts, async function (request, reply) {
      const body = request.body;
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
      return fastify.mongo.db(CONFIG.databaseName).collection('users').insertOne(body);
    })
}

export default example;
