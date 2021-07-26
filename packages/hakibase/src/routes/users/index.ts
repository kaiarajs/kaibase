import { FastifyPluginAsync, RouteShorthandOptions } from "fastify"
import bcrypt from "bcrypt";
import { CONFIG } from "../../app";
import { Document, Filter } from "mongodb";
import axios from 'axios';

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
      const newUser = { ...body, provider: 'EMAIL' }
      return fastify.mongo.db(CONFIG.databaseName).collection('users').insertOne(newUser);
    })

  fastify.get('/google/callback', async function (request, reply) {
    console.log(request.session.grant.response);
    if (!request.session.grant?.response?.access_token) {
      return { success: false, error: "cannot get access_token" }
    }

    const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', { headers: { Authorization: 'Bearer ' + request.session.grant.response.access_token } });
    const data = await response.data;

    console.log(data);
    if (data && data.email) {
      const findUser = await fastify.mongo.db(CONFIG.databaseName).collection('users').findOne({ email: data.email });
      console.log(findUser);
      if (findUser) {
        const payload = { email: findUser.email, id: findUser._id }
        const token = fastify.jwt.sign({ payload })
        reply.send({ success: true, token })
      } else {
        const newUser = { email: data.email, name: data.email || null, picture: data.picture || null, provider: 'GOOGLE' }
        const createuser = await fastify.mongo.db(CONFIG.databaseName).collection('users').insertOne(newUser);
        if(createuser && createuser.insertedId) {
          const payload = { email: newUser.email, id: createuser.insertedId }
          const token = fastify.jwt.sign({ payload })
          reply.send({ success: true, token })
        }
      }
    } else {
      return { success: false, error: "cannot get user data" }
    }

  })
}

export default example;
