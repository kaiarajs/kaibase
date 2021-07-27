import fp from 'fastify-plugin'
import fastifyCors, { FastifyCorsOptions } from 'fastify-cors'
import { CONFIG } from '../app'

export default fp<FastifyCorsOptions>(async (fastify, opts) => {
  fastify.register(fastifyCors, {
    origin: CONFIG.cors.origin,
    methods: CONFIG.cors.methods
  })
})
