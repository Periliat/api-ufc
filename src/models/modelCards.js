import { Schema, model } from "mongoose";

const DBC_Schema = new Schema ({
    residencia:String,
    objects:[{
        uid:String,
        nome:String
    }]
 });

const DBCM = model('cartoes', DBC_Schema);
export default DBCM;
