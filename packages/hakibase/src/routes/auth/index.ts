import { FastifyPluginAsync, RouteShorthandOptions } from "fastify"
import bcrypt from "bcrypt";
import { CONFIG } from "../../app";
import axios from 'axios';
import Mail from "nodemailer/lib/mailer";
import { TokenModel } from "../../models/tokens";

interface BodyEmailAndPassword {
  email: string,
  password: string
}

interface MailVerifyUser {
  email: string,
}

const MailVerifyUserOpts: RouteShorthandOptions = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          maxLength: 20,
          minLength: 3
        },
      },
      required: ['email']
    },
  }
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
  },
}

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{ Body: BodyEmailAndPassword }>('/register-with-email-and-password', BodyEmailAndPasswordOpts, async function (request, reply) {
    const body = request.body;
    const salt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, salt);
    const newUser = { ...body, provider: 'EMAIL', roles: ['user'] }
    const createdUser = await fastify.mongo.db(CONFIG.databaseName).collection('users').insertOne(newUser);
    const payload = { email: body.email, id: createdUser.insertedId, roles: ['user'] }
    const token = fastify.jwt.sign({ payload })
    const newToken: TokenModel = {
      token,
      userId: createdUser.insertedId,
      allowedRefresh: true
    }
    fastify.mongo.db(CONFIG.databaseName).collection('tokens').insertOne(newToken);
    return reply.status(201).send({ sucess: true, token })
  })

  fastify.post<{ Body: BodyEmailAndPassword }>('/login-with-email-and-password', BodyEmailAndPasswordOpts, async function (request, reply) {
    const body = request.body;
    const findUser = await fastify.mongo.db(CONFIG.databaseName).collection('users').findOne({ email: body.email });
    if (!findUser) return reply.status(403).send({ sucess: false, error: "user not exist" })
    if (findUser && findUser.provider !== "EMAIL") return reply.status(403).send({ sucess: false, error: `user register with other provider: ${findUser.provider}` })
    if (findUser && !findUser.password) return reply.status(403).send({ sucess: false, error: "user not have password" })
    const payload = { email: findUser.email, id: findUser._id, roles: findUser.roles }
    const token = fastify.jwt.sign({ payload })
    const newToken: TokenModel = {
      token,
      userId: findUser.insertedId,
      allowedRefresh: true
    }
    fastify.mongo.db(CONFIG.databaseName).collection('tokens').insertOne(newToken);
    return reply.status(201).send({ sucess: true, token })
  }),

  fastify.get('/refresh-token',{preValidation:[fastify.authenticate]}, async function (request, reply) {
    console.log('token', request.headers.authorization?.slice(7))
    console.log('user', request.user)
    const findToken = await fastify.mongo.db(CONFIG.databaseName).collection('tokens').findOne({ token: request.headers.authorization?.slice(7) });
    if (!findToken) return reply.status(403).send({ sucess: false, error: "token not exist" })
    if (!findToken.allowedRefresh) return reply.status(401).send({ sucess: false, error: "token cannot refresh" })
    //@ts-ignore
    const findUser = await fastify.mongo.db(CONFIG.databaseName).collection('users').findOne({ email: request.user.payload.email });
    if (!findUser) return reply.status(403).send({ sucess: false, error: "user not exist" })
    const payload = { email: findUser.email, id: findUser._id, roles: findUser.roles }
    const token = fastify.jwt.sign({ payload })
    const newToken: TokenModel = {
      token,
      userId: findUser.insertedId,
      allowedRefresh: true
    }
    await fastify.mongo.db(CONFIG.databaseName).collection('tokens').deleteOne(findToken);
    await fastify.mongo.db(CONFIG.databaseName).collection('tokens').insertOne(newToken);
    return reply.status(201).send({ sucess: true, token })
  })

    fastify.post<{ Body: MailVerifyUser }>('/verify-user-mail', MailVerifyUserOpts, async function (request, reply) {
      const body = request.body;

      const html = await fastify.view('/templates/verify-email.ejs', { user_firstname: 'user', confirm_link: "link" })

      let mailOptions: Mail.Options = {
        from: CONFIG.mail.mailFrom,
        to: body.email,
        subject: 'Verify email',
        html
      };
      return fastify.nodemailer.sendMail(mailOptions);
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
        const newUser = { email: data.email, name: data.email || null, picture: data.picture || null, provider: 'GOOGLE', roles: ['user'] }
        const createuser = await fastify.mongo.db(CONFIG.databaseName).collection('users').insertOne(newUser);
        if (createuser && createuser.insertedId) {
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

export default auth;
