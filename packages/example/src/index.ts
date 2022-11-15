import { Hakibase } from "@hakibase/hakibase";
import { DiskStorageDriver } from '@hakibase/disk-storage'
const UserStorage = new DiskStorageDriver();
const Users = new Hakibase({ storage: UserStorage })

async function main() {
    await Users.collection('pepe').insert({ name: "xyz", age: 30 })
    await Users.collection('papa').insert({ name: "xyz", age: 30 })
}



main()