import fp from 'fastify-plugin'
import nodemailer, { Transporter } from 'nodemailer';

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp(async (fastify, opts) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
          user: 'your.gmail.account@gmail.com', // like : abc@gmail.com
          pass: 'your.gmailpassword'           // like : pass@123
      }
    });
    fastify.decorate('nodemailer', transporter);
    fastify.addHook('onClose', () => transporter.close());
  } catch (error) {
    console.log(error);
  }
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    nodemailer: Transporter;
  }
}
