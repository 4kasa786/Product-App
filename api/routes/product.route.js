import express from 'express';
import { validate } from '../utils/validate.js';
import { productSchema } from '../validators/product.validator.js';
import { createProduct, deleteProduct, generateProduct, getProducts, getSingleProduct, updateProduct } from '../controllers/product.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();



router.post('/', verifyToken, validate(productSchema), createProduct);
router.get('/', getProducts);
router.post('/generate', verifyToken, generateProduct);

router.delete('/:id', verifyToken, deleteProduct);
router.put('/:id', verifyToken, updateProduct);
router.get('/:id', getSingleProduct);


export default router;