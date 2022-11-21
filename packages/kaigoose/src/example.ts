import { Schema } from "@kaiarajs/schema";
import { Kaigoose } from "./kaigoose";
import { Model } from "./model";
import { DiskStorageDriver } from '@kaiarajs/disk-storage'



async function main() {
    const storage = new DiskStorageDriver();

    Kaigoose.connect(storage, 'db')

    const schema = {
        age: Schema.number(),
        user: Schema.id().ref("User")
    }

    console.log('sceham', schema)

    const UserModel = new Model('User', schema);

/*
    const create = await UserModel.create({
        age: 80
    })
   
    console.log('create', create) */
}


main()