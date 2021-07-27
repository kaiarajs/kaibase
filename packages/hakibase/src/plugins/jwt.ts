import fp from 'fastify-plugin'
import fastifyJWT, { FastifyJWTOptions } from 'fastify-jwt'
import { FastifyReply, FastifyRequest } from 'fastify'


export default fp<FastifyJWTOptions>(async (fastify, opts) => {
  fastify.register(fastifyJWT, {
    secret: "supersecret"
  })
  fastify.decorate("authenticate", async function(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
})

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any
  }
}