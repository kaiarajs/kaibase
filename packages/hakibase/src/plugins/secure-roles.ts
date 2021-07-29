import { FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { CONFIG } from '../app';


export default fp(async (fastify, opts) => {
  fastify.decorate("secureRoles", async function(request: FastifyRequest, reply: FastifyReply) {
    try {
      let findConfig: any;
      let secureReq: string | null = null;
      let allowed = false;
      //@ts-ignore
      const userRole = request.user.payload?.roles || null;
      const url = request.url.split('/')[1];
      const db = await fastify.mongo.db(CONFIG.databaseName).collection("_config").findOne({ name: "security-roles" });
      if (!db) allowed = true;
      else {
        console.log('url', url)
        if (db && db.collections && url === 'db') {
          secureReq = request.headers['collection'] as string || null;
          findConfig = db.collections.find((o: any) => o.name === secureReq);
                 
        } else if(db && db.collections && url === 'storage') {
          secureReq = request.headers['location'] as string  || null;
          if(secureReq) {
            secureReq = secureReq.split('/')[0]
            findConfig = db.buckets.find((o: any) => o.name === secureReq);
          }
        }

        console.log(secureReq);
        if(!secureReq) reply.status(403).send({success: false, error: "cannot get the resource on the headers request"})

        console.log(userRole);
        if (findConfig && findConfig.secure === false) return allowed = true;   
        if(!userRole) reply.status(401).send({success: false, error: "cannot get the role of the user"})
        if (!findConfig) return reply.status(403).send({success: false, error: "cannot get the resource permissions"})

        const evenHaveRole = (element: any) => element.includes(userRole);

        switch (request.raw.method) {
          case "GET":
            allowed = findConfig.allowRead.some(evenHaveRole)
            break;
          case "POST":
            allowed = findConfig.allowWrite.some(evenHaveRole)
            break;
            case "PATCH":
              allowed = findConfig.allowUpdate.some(evenHaveRole)
              break;
          case "GET":
            allowed = findConfig.allowDelete.some(evenHaveRole)
            break;
          default:
            allowed = false;
            break;
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