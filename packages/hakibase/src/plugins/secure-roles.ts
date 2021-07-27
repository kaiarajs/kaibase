import { FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { CONFIG } from '../app';


export default fp(async (fastify, opts) => {
  fastify.decorate("secureRoles", async function(request: FastifyRequest, reply: FastifyReply) {
    try {
      let allowed = false;
      const db = await fastify.mongo.db(CONFIG.databaseName).collection("config").findOne({ name: "security-roles" });
      if (!db) allowed = true;
      else {
        if (db && db.collections) {
          const collectionReq = request.headers['collection'] || null;
          //@ts-ignore
          const userRole = request.user.payload?.roles || null;
          console.log(userRole);
          if(!userRole) reply.status(401).send({success: false, error: "cannot get the role of the user"})
          const findCollectionConfig = db.collections.find((o: any) => o.name === collectionReq);
          if (!findCollectionConfig) return allowed = true;
          if (findCollectionConfig && findCollectionConfig.secure === false) return allowed = true;
          console.log(findCollectionConfig.allowRead);

          const evenHaveRole = (element: any) => element.includes(userRole);
          switch (request.raw.method) {
            case "GET":
              allowed = findCollectionConfig.allowRead.some(evenHaveRole)
              break;
            case "POST":
              allowed = findCollectionConfig.allowWrite.some(evenHaveRole)
              break;
              case "PATCH":
                allowed = findCollectionConfig.allowUpdate.some(evenHaveRole)
                break;
            case "GET":
              allowed = findCollectionConfig.allowDelete.some(evenHaveRole)
              break;
            default:
              allowed = false;
              break;
          }
        }
      }
  
      console.log('allowed', allowed)
      if(!allowed) {
          return reply.status(401).send({success: false, error: "not allowed"})
      }
    } catch (err) {
      console.log(err)
      reply.send(err)
    }
  })
}, {name: "secureRoles", dependencies: ["mongo"]})

declare module 'fastify' {
  export interface FastifyInstance {
    secureRoles: boolean
  }
}