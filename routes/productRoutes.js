const express = require('express');
const { getAllProducts, addProducts, deleteProduct, updateProduct } = require('../controller/productController');
const router = express.Router();

//route
router.get('/all_products', getAllProducts);
router.post('/add_product', addProducts);
router.delete('/delete/:id', deleteProduct);
router.put('/update/:id', updateProduct);

module.exports = router;