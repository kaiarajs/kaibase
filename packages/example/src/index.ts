import { Hakibase } from "@hakibase/hakibase";
import { DiskStorageDriver } from '@hakibase/disk-storage'
const UserStorage = new DiskStorageDriver();
const Users = new Hakibase({ storage: UserStorage })

async function main() {
    try {
        // await Users.collection('pepe').insert({ name: "xyz", age: 30 })
        // await Users.collection('papa').insert({ name: "xyz", age: 30 })

         await Users.collection('pepe').ensureIndex({ fieldName: "age", unique: true });

        for (let index = 1; index < 10; index++) {
            await Users.collection('pepe').insert({ name: "xyz", age: String(index) })
            console.log(index);
        }
        
        console.log('--------index')
        await Users.collection('pepe').saveIndex("age");
 
        console.time();
        const find = await Users.collection('pepe').find({ age: "6000" }).exec()
        console.log(find);
        console.timeEnd();
    } catch (error) {
        console.log(error)
    }

}



main()