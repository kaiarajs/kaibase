import Fastify from 'fastify';
const pkg = require('../package.json');
import closeWithGrace from 'close-with-grace';
import { program } from 'commander';

const app = Fastify({
    logger: true
})

// Register your application as a normal plugin.
const appService = require('./app.js')
app.register(appService)
// delay is the number of milliseconds for the graceful close to finish
//@ts-ignore
const closeListeners = closeWithGrace({ delay: 500 }, async function ({ signal, err, manual }) {
    if (err) {
        app.log.error(err)
    }
    await app.close()
})

app.addHook('onClose', async (instance, done) => {
    closeListeners.uninstall()
    done()
})


function start() {
    app.listen(process.env.PORT || 3000, (err) => {
        if (err) {
            app.log.error(err)
            process.exit(1)
        }
    })
}

program
    .version(pkg.version, '-v, --version')
    .description("Hakibase CLI")
    .command('start')
    .description('start server')
    .action(() => {
        console.log('start');
        start();
    })
    .command('stop')
    .description('stop server')
    .action(() => {
        console.log('start');
        closeListeners
    })
try {
    program.parse(process.argv);
} catch (err) {
    if (err.code === 'commander.unknownOption') {
        console.log();
        program.outputHelp();
    }
}
