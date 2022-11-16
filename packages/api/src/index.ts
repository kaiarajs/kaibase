import Kainox, { Parser } from "@kaiarajs/kainox";
import Router from "@kaiarajs/router";
import { DiskStorageDriver } from '@hakibase/disk-storage'
export const dbStorage = new DiskStorageDriver();


const app = new Kainox();
const router = new Router();

app.use(Parser.json())

router.post('/:collection/getItem', async (req, res) => {
    const {collection} = req.params as { collection: string};
    const body = req.body
    console.log(body)
    const insert = dbStorage.setCollection(collection).getItem(body)
    res.send(insert as any)
});

router.post('/:collection/setItem', async (req, res) => {
    const {collection} = req.params as { collection: string};
    console.log('collection', collection)
    console.log('req.body', req.body)

    const {key,value} = req.body;
    const insert = await dbStorage.setCollection(collection).setItem(key,value)
    res.send(insert)
});

router.post('/:collection/removeItem', async (req, res) => {
    const {collection} = req.params as { collection: string};
    const body = req.body;
    const del = await dbStorage.setCollection(collection).removeItem(body)
    res.send(del)
});



app.use(router)

app.start(() => {
    console.log('Kainox ready on port: 3000')
});

