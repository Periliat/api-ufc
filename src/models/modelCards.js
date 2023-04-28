import { Schema, model } from "mongoose";

const DBC_Schema = new Schema ({
    residencia:String,
    objects:[
        {
            uid:String,
            name:String
        }
    ]
});

const DBCM = model('numeralcards', DBC_Schema);
export default DBCM;