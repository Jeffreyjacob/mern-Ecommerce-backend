import express, { Request, Response } from 'express';
import "dotenv/config"
import cors from 'cors';
import userRouter from './routes/userRoute';
import ConnectDB from './db/connect';
import notFound from './middleware/notfound';
import MyUserRouter from './routes/myUserRoute';
import AdminProductRouter from './routes/adminProductRoute';
import { v2 as cloudinary } from 'cloudinary';
import productRouter from './routes/productRoute';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express();
app.use(cors())
app.use(express.json())
app.get("/health",async(req:Request,res:Response)=>{
  res.send({message:"health OK!"})
});
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("working url..")
})
app.use("/api/user", userRouter)
app.use("/api/my/user", MyUserRouter)
app.use("/api/admin/product", AdminProductRouter)
app.use("/api/product",productRouter)
app.use(notFound)

const port = 7000

app.listen(port, async () => {
  await ConnectDB(process.env.MONG0DB_URI!)
  console.log("server is listening on port 5000..")
})