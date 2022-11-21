import { Schema } from "@kaiarajs/schema";
import { Kaigoose } from "../../kaigoose/src/kaigoose";
import { Model } from "../../kaigoose/src/model";
import { DiskStorageDriver } from '@kaiarajs/disk-storage'



async function main() {
    const storage = new DiskStorageDriver();

    Kaigoose.connect(storage, 'db')

    const schema = {
        age: Schema.number(),
        user: Schema.id().ref("User")
    }


    const UserModel = new Model('Papa', schema);

    const find = await UserModel.find({}).populate('user').exec();
    console.log('find', find[0])

/*
    const create = await UserModel.create({
        age: 90
    })
   
    console.log('create', create)
    */
}


main()