import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  total: number;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        imageUrl: String,
      },
    ],
    total: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IOrder>("Order", OrderSchema);
