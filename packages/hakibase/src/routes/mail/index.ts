import { FastifyPluginAsync, RouteShorthandOptions } from "fastify"
import Mail from "nodemailer/lib/mailer";
import { CONFIG } from "../../app";


interface MailVerifyUser {
  email: string,
}

const MailVerifyUserOpts: RouteShorthandOptions = {
  schema: {
    body: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          maxLength: 20,
          minLength: 3
        },
      },
      required: ['email']
    },
  }
}

const mail: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{ Body: MailVerifyUser }>('/verify-user-mail', MailVerifyUserOpts, async function (request, reply) {
    const body = request.body;

    let mailOptions: Mail.Options = {
      from: CONFIG.email.auth.user,
      to: body.email,
      subject: 'Check Mail',
      text: 'Its working node mailer'
    };
    return fastify.nodemailer.sendMail(mailOptions);
  })
}

export default mail;
