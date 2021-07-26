import fp from 'fastify-plugin'
import fastifyJWT, { FastifyJWTOptions } from 'fastify-jwt'


export default fp<FastifyJWTOptions>(async (fastify, opts) => {
  fastify.register(fastifyJWT, {
    secret: "supersecret"
  })
})
