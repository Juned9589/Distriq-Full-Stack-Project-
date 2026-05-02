import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({

    couponCode: {
        type: String,
        required: true
    },

    couponDiscount: {
        type: Number,
        required: true
    },

    isActive: {
        type: Boolean,
        required: true,
        default: true
    }


}, {
    timestamps: true
})

const Coupon = mongoose.model("coupon", couponSchema)

export default Coupon