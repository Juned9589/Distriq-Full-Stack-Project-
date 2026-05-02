import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'

    },
    balance: {
        type: Number,
        default: 0,
        required: true,

    },
    isActive: {
        type: Boolean,
        required: true,

    },

}, {
    timestamps: true
})

const Wallet = mongoose.model("Wallet", walletSchema)

export default Wallet