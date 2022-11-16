import Kainox, { Parser } from "@kaiarajs/kainox";
import Router from "@kaiarajs/router";
import { DiskStorageDriver } from '@kaiarajs/disk-storage'
export const dbStorage = new DiskStorageDriver();


const app = new Kainox();
const router = new Router();

app.use(Parser.json())

export function main() {
    router.post('/:collection/getItem', async (req, res) => {
        const {collection} = req.params as { collection: string};
        const {key} = req.body
        const insert = await dbStorage.setCollection(collection).getItem(key)
        res.send(insert as any)
    });
    
    router.post('/:collection/setItem', async (req, res) => {
        const {collection} = req.params as { collection: string};
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
    
    router.post('/:collection/iterate', async (req, res) => {
        const {collection} = req.params as { collection: string};
        let callback: any[] = [];
        await dbStorage.setCollection(collection).iterate((k,v) => {
            callback.push({k,v})
        })
        res.send(callback)
    });
    
    
    
    
    app.use(router)
    
    app.start(() => {
        console.log('Kainox ready on port: 3000')
    });
    
}
