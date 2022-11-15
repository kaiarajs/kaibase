import { Hakibase } from "@hakibase/hakibase";
import { DiskStorageDriver } from '@hakibase/disk-storage'
const dbStorage = new DiskStorageDriver();
export const DB = new Hakibase({ storage: dbStorage })