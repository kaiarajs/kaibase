import { Hakibase } from "@hakibase/hakibase";
import { DiskStorageDriver } from '@hakibase/disk-storage'
const dbStorage = new DiskStorageDriver();
const db = new Hakibase({ storage: dbStorage })

async function main() {
    try {
        // await Users.collection('pepe').insert({ name: "xyz", age: 30 })
        // await Users.collection('papa').insert({ name: "xyz", age: 30 })

   

         await db.collection('pepe').ensureIndex({ fieldName: "age", unique: true });
          await db.collection('pepe').find().exec()

          const indices = await db.collection('pepe').getIndices();

          console.log('indices',indices)
    

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



main()