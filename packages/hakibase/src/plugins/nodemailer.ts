import fp from 'fastify-plugin'
import nodemailer, { Transporter } from 'nodemailer';
import { CONFIG } from '../app';

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp(async (fastify, opts) => {
  try {
    const transporter = nodemailer.createTransport({
      host: CONFIG.mail.host,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
          user: CONFIG.mail.auth.user,
          pass: CONFIG.mail.auth.pass
      }
    });
    transporter.verify(function(error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our mail messages");
      }
    });
    fastify.decorate('nodemailer', transporter);
    fastify.addHook('onClose', () => transporter.close());
  } catch (error) {
    console.log(error);
  }
})

declare module 'fastify' {
  export interface FastifyInstance {
    nodemailer: Transporter;
  }
}
