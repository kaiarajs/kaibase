import fp from 'fastify-plugin'
import pointOfView, { PointOfViewOptions } from 'point-of-view';

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<PointOfViewOptions>(async (fastify, opts) => {
    fastify.register(pointOfView, {
        engine: {
            ejs: require('ejs')
        }
    })
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
    export interface FastifyInstance {
        view(page: string, data?: object): FastifyReply;
      }
}
