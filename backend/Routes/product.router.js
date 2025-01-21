import express from 'express';
import { addAllCategory, addProductByCategory, getAllCategories, getProductsByCategory } from '../Controller/ProductController.js'; 

const router = express.Router();


// add product by specific category
router.post('/add/:category', addProductByCategory);

// add all categories
router.post('/addallcategories',addAllCategory)

// get all categories 
router.get('/getallcategories',getAllCategories)

// get products by specific category
router.get('/getproducts/:category',getProductsByCategory)



export default router;
