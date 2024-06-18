import { Request, Response } from "express";
import Stripe from "stripe";
import Product, { ProductType } from "../model/productmodel";
import Order from "../model/ordermodel";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);

const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET=process.env.STRIPE_WEBHOOK_SECRET as string

type CheckoutSessionRequest = {
    cartItem:{
       id:string,
       title:string,
       quantity:string,
       imageUrl:string,
       price:string
    }[];
    deliveryDetails: {
        email: string;
        name: string;
        addressLine1: string;
        city: string
    },
}

const stripeWebhookHandler = async (req:Request,res:Response)=>{
   let event;
   try{
    const sig = req.headers["stripe-signature"];
    event = STRIPE.webhooks.constructEvent(
        req.body,
        sig as string,
        STRIPE_ENDPOINT_SECRET
    );
   }catch(error:any){
      console.log(error)
      return res.status(400).send(`Webhook error: ${error.message}`)
   }
   if(event.type === "checkout.session.completed"){
      const order = await Order.findById(event.data.object.metadata?.orderId);
      if(!order){
        return res.status(404).json({message:"Order not found"})
      }
      order.totalAmount = event.data.object.amount_total;
      order.status = "paid";
      await order.save()
   }
   res.status(200).send()
}

const createCheckOutSession = async (req:Request,res:Response)=>{
    try{
      const checkoutSessionRequest:CheckoutSessionRequest = req.body
      const productIds = checkoutSessionRequest.cartItem.map(item => item.id);
        const products = await Product.find({ _id: { $in: productIds } });

        if (!products) {
            return res.status(404).json({ message: 'Products not found' });
        }
         
        const newOrder = new Order({
            user:req.userId,
            status:"placed",
            deliveryDetails:checkoutSessionRequest.deliveryDetails,
            cartItems:checkoutSessionRequest.cartItem,
            createdAt:new Date(),
        })

        const lineItems = createLineTerm(checkoutSessionRequest,products)
        const session = await createSession(lineItems,newOrder._id.toString(),req.userId)
        if(!session.url){
            return res.status(500).json({message:"Error creating stripe sessiom"})
        }
        await newOrder.save()
        res.json({url:session.url})

    }catch(error){
      console.log(error)
      res.status(500).json({message:error})
    }
}


const createLineTerm = (checkoutSessionRequest: CheckoutSessionRequest,ProductItem:ProductType[])=>{
    const lineTerm = checkoutSessionRequest.cartItem.map((cartItem)=>{
        const productItem = ProductItem.find((item)=> item._id.toString() === cartItem.id.toString())
        if(!productItem){
            throw new Error(`Product item not found: ${cartItem.id}`)
        }
        const line_item:Stripe.Checkout.SessionCreateParams.LineItem = {
            price_data:{
                currency:"gbp",
                unit_amount:Math.round(parseFloat(cartItem.price) * 100),
                product_data:{
                    name:productItem.title,
                    images: [productItem.imageUrl]
                }
            },
            quantity:parseInt(cartItem.quantity)
        };
        return line_item
    })
    return lineTerm
}

const createSession = async(
  lineItem:Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId:string,
  userId:string
)=>{
  const sessionData = await STRIPE.checkout.sessions.create({
     line_items:lineItem,
     mode:"payment",
     metadata:{
        orderId
     },
     success_url: `${FRONTEND_URL}/order-status?success=true`,
     cancel_url: `${FRONTEND_URL}/cart?cancelled=true`
  })
  return sessionData;
}


export default {createCheckOutSession,stripeWebhookHandler}