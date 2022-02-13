import fastify from "fastify";
import closeWithGrace from 'close-with-grace';
import { app } from './app';

export class Hakibase {

    fastifyApp: any;
    closeListeners: any;

    constructor() {
        this.init()
    }

    init() {
        this.fastifyApp = fastify({
            logger: true
        })

        //@ts-ignore
        this.closeListeners = closeWithGrace({ delay: 500 }, async ({ signal, err, manual }) => {
            if (err) {
                this.fastifyApp.log.error(err)
            }
            await this.fastifyApp.close()
        })
        
        this.fastifyApp.register(app)
        this.fastifyApp.addHook('onClose', async (instance: any, done: any) => {
            this.closeListeners.uninstall()
            done()
        })
        
        // Start listening.
        this.fastifyApp.listen(process.env.PORT || 3000, (err: any) => {
            if (err) {
                this.fastifyApp.log.error(err)
                process.exit(1)
            }
        })
    }
}