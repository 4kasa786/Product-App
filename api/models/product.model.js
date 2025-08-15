import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [3, 'Product name must be at least 3 characters'],
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },

    category: {
        type: String,
        enum: {
            values: ['Electronics', 'Clothing', 'Food'],
            message: '{VALUE} is not a valid category'
        },
        required: [true, 'Category is required']
    },

    inStock: {
        type: Boolean,
        default: true
    },

    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
        max: [100000, 'Price cannot exceed 100,000']
    },

    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be an integer'
        }
    },

    totalValue: {
        type: Number
    }, // Auto-calculated field

    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Created by user is required']
    }
}, {
    timestamps: true
});

productSchema.pre('save', function (next) {
    this.totalValue = this.price * this.quantity;
    next();
});

// Simple method to update stock
productSchema.methods.updateStock = function (newQuantity) {
    this.quantity = newQuantity;
    this.inStock = newQuantity > 0;
    return this.save();
};

const Product = mongoose.model('Product', productSchema);

export default Product;