import { Kaibase, StorageDriver } from "@kaiarajs/kaibase";

class SKaigoose {

    public storageDriver;
    public kaibase: Kaibase;

    private static _instance?: SKaigoose;

    private constructor() {
        if (SKaigoose._instance)
            throw new Error("Use Singleton.instance instead of new.");
            SKaigoose._instance = this;
    }

    static get instance() {
        return SKaigoose._instance ?? (SKaigoose._instance = new SKaigoose());
    }

    connect(storage: StorageDriver, db: string){
        this.kaibase = new Kaibase({storage})
        this.kaibase.db(db)
    }
}


export const Kaigoose = SKaigoose.instance;