import { FastifyPluginAsync } from "fastify"

interface keyable {
    [key: string]: any  
}

const custom: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/*', async function (request, reply) {
    const params: keyable = request.params as keyable
    switch (params['*']) {
      case 'lol':
        return 'lol'
      case 'lol/ASA/ASAS':
        return 'lol/ASA/ASAS'
      default:
        return 'this is an example' + JSON.stringify(request.params)
    }
  })
}

export default custom;
