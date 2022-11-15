import { Hakibase } from "@hakibase/hakibase";
import { DiskStorageDriver } from '@hakibase/disk-storage'
const UserStorage = new DiskStorageDriver({});
const Users = new Hakibase({ storage: UserStorage })

Users.insert({ name: "xyz", age: 30 })
    .then((doc) => {
        console.log(doc) // {_id: "...", name: "xyz", age: 30} 
    })
    .catch();