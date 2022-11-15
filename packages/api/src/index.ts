import Kainox, { Parser } from "@kaiarajs/kainox";
import Router from "@kaiarajs/router";
import { DB } from "./db";


const app = new Kainox();
const router = new Router();

app.use(Parser.json())

router.post('/:collection/find', async (req, res) => {
    const {collection} = req.params as { collection: string};
    const body = req.body
    const insert = await DB.collection(collection).find(body).exec()
    res.send(insert as any)
});

router.post('/:collection/insert', async (req, res) => {
    const {collection} = req.params as { collection: string};
    const body = req.body;
    const insert = await DB.collection(collection).insert(body)
    res.send(insert)
});

router.post('/:collection/delete', async (req, res) => {
    const {collection} = req.params as { collection: string};
    const body = req.body;
    const del = await DB.collection(collection).remove(body)
    res.send(del)
});



app.use(router)

app.start(() => {
    console.log('Kainox ready on port: 3000')
});

