import Kainox, { Parser } from "@kaiarajs/kainox";
import Router from "@kaiarajs/router";
import { DiskStorageDriver } from '@kaiarajs/disk-storage'
import { apiKeyAuth } from "./middleware";
export const dbStorage = new DiskStorageDriver();


const app = new Kainox();
const router = new Router();

app.use(Parser.json())
app.use(apiKeyAuth(/^API_KEY_/))

export function main() {
    router.post('/:database/:collection/getItem', async (req, res) => {
        const {database,collection} = req.params as { database: string ,collection: string};
        const {key} = req.body
        const insert = await dbStorage.setDatabase(database).setCollection(collection).getItem(key)
        res.send(insert)
    });
    
    router.post('/:database/:collection/setItem', async (req, res) => {
        const {database,collection} = req.params as { database: string ,collection: string};
        const {key,value} = req.body;
        const insert = await dbStorage.setDatabase(database).setCollection(collection).setItem(key,value)
        res.send(insert)
    });
    
    router.post('/:database/:collection/removeItem', async (req, res) => {
        const {database,collection} = req.params as { database: string ,collection: string};
        const body = req.body;
        const del = await dbStorage.setDatabase(database).setCollection(collection).removeItem(body)
        res.send(del)
    });
    
    router.post('/:database/:collection/iterate', async (req, res) => {
        const {database,collection} = req.params as { database: string ,collection: string};
        let callback: any[] = [];
        await dbStorage.setDatabase(database).setCollection(collection).iterate((k,v) => {
            callback.push({k,v})
        })
        res.send(callback)
    });
    
    
    
    
    app.use(router)
    
    app.start(() => {
        console.log('Kainox ready on port: 3000')
    });
    
}
