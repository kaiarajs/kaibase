import { kairajs } from "@kairajs/kairajs";
import { DiskStorageDriver } from '@kairajs/disk-storage'
import { ApiStorageDriver } from '@kairajs/api-storage'

async function main() {
    try {

        const dbStorage = new DiskStorageDriver();
        const db = new kairajs({ storage: dbStorage })
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
    const dbStorage = new ApiStorageDriver();
    const db = new kairajs({ storage: dbStorage })
    const insert = await db.collection('pepe').insert({ name: "xyz"})
    console.log('insert', insert)
    const pepe = await db.collection('pepe').find({ name: "xyz"}).exec()
    console.log('pepe',pepe)
}


mainApi()