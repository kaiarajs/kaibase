import { expect } from 'chai';
import { DiskStorageDriver } from '@hakibase/disk-storage';
import { Hakibase } from '@hakibase/hakibase';
import fs from 'fs';
import path from 'path';


describe('Options tests', () => {
    const DbStorage = new DiskStorageDriver({});
    const Db = new Hakibase({ storage: DbStorage });
    Db.collection('user');

    before('setupApplication', async () => {
        const pathi = path.join(__dirname + '/../../db/test');
        console.log(pathi);
        fs.readdir(pathi, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                console.log(file);
                fs.unlink(path.join(pathi, file), err => {
                    if (err) throw err;
                });
            }
        });

    });

    it('Insert element', async () => { // the single test
        const l = await Db.insert({
            name: 'xyz',
            age: 30,
            _id: 'N3V6YlRIb0JBQUE9azduVGJMV0VHdVk9dHYyS3JzU0JSSE09SEl6YkdwclBuQkk9'
        });
        console.log(l);
        expect(l).to.contains({
            name: 'xyz',
            age: 30,
            _id: 'N3V6YlRIb0JBQUE9azduVGJMV0VHdVk9dHYyS3JzU0JSSE09SEl6YkdwclBuQkk9'
        });

    });

    it('Get document', async () => { // the single test
        const l = await Db.find({
            name: 'xyz',
            age: 30
        }).exec();
        console.log('on')
        console.log(l);
        expect(l).to.deep.equal([
            {
                name: 'xyz',
                age: 30,
                _id: 'N3V6YlRIb0JBQUE9azduVGJMV0VHdVk9dHYyS3JzU0JSSE09SEl6YkdwclBuQkk9'
            }
        ]);

    });

});