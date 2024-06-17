import mongoose from "mongoose"


const ConnectDB = (url:string)=>{
    mongoose.connect(url)
}

export default ConnectDB;