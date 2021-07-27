import fp from 'fastify-plugin'
import fastifyRateLimit, { FastifyRateLimitOptions } from 'fastify-rate-limit'


export default fp<FastifyRateLimitOptions>(async (fastify, opts) => {
  fastify.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute'
  })
  fastify.setNotFoundHandler({
    preHandler: fastify.rateLimit()
  }, function (request, reply) {
    reply.code(404).send({ success: false, error: "not found" })
  })
})
