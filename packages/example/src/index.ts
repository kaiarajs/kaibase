import { Kaibase } from "@kaiarajs/kaibase";
import { DiskStorageDriver } from '@kaiarajs/disk-storage'
import { ApiStorageDriver } from '@kaiarajs/api-storage'

async function main() {
    try {

        const dbStorage = new DiskStorageDriver();
        const db = new Kaibase({ storage: dbStorage })
        // await Users.collection('pepe').insert({ name: "xyz", age: 30 })
        // await Users.collection('papa').insert({ name: "xyz", age: 30 })



        await db.collection('pepe').ensureIndex({ fieldName: "age", unique: true });
        await db.collection('pepe').find().exec()

        const indices = await db.collection('pepe').getIndices();

        console.log('indices', indices)


        for (let index = 1; index < 10; index++) {
            await db.collection('pepe').insert({ name: "xyz", age: String(index) })
            console.log(index);
        }
        //        await db.collection('pepe').insert({ name: "xyz", age: String(1) })

        console.log('--------index')
        await db.collection('pepe').saveIndex("age");

        console.time();
        const find = await db.collection('pepe').find({ age: "6000" }).exec()
        console.log(find);
        console.timeEnd();
    } catch (error) {
        console.log(error)
    }

}


async function mainApi() {
    // const dbStorage = new ApiStorageDriver({apiUrl: "http://localhost:3000?api-key=lol"});
    const dbStorage = new DiskStorageDriver();
    const db = new Kaibase({ storage: dbStorage })
    const insert = await db.db("tesdb").collection('pepe').insert({ name: "xyz", arr: [] })
    console.log('insert', insert)
    const update = await db.db("tesdb").collection('pepe').update({ name: "xyz" }, {
        "$push": {
            "arr": "ASAS"
        }
    }, { returnUpdatedDocs: true })
    const update2 = await db.db("tesdb").collection('pepe').update({ name: "xyz" }, {
        "$push": {
            "arr": "AaaaaSAS"
        }
    }, { returnUpdatedDocs: true })
    console.log('update2', update2)
    await db.db("tesdb").collection('pepe').remove({ name: "xyz" })
    // const pepe = await db.collection('pepe').find({ name: "xyz"}).exec()
    //const pepe = await db.dump();
    // console.log('pepe',pepe)
}


mainApi()