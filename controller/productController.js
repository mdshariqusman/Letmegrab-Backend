const db = require("../db");

// get the products
const getAllProducts = async (req, res) => {
    try {
        // const {category_id, materials_id, product_name, price } = req.query;
        const { page } = req.query;
        const offset = ((page || 1) - 1) * 10;
        const data = await db.query("SELECT * FROM new_table limit ? offset ?", [10, offset])
        const [totalPageData] = await db.query("select count(*) as count from new_table")
        const totalPages = Math.ceil(totalPageData[0]?.count / 10);
        if (!data) {
            res.status(404).send({
                success: false,
                message: "Data not found",
                data: [],
            })
        }
        else {
            res.status(200).send({
                success: true,
                message: "Product Records",
                total_products: data[0]?.length,
                data: data[0],
                page: {
                    current_page: page || '1',
                    totalPages: totalPages,
                    page_size: 10,
                }
            })
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in all products api",
            error: error,
        })
        console.log(error);
    }
};

// add product
const addProducts = async (req, res) => {
    try {
        const { sku, product_name, category_id, materials_ids, price } = req.body;
        if (!sku || !product_name || !category_id || !materials_ids || !price) {
            return res.status(500).send({
                success: false,
                message: "Please provide all the data required",
            })
        }
        const data = await db.query("INSERT INTO new_table (SKU,product_name,category_id,material_ids,price) VALUES (?,?,?,?,?)",
            [sku, product_name, category_id, materials_ids, price])
        if (!data) {
            res.status(404).send({
                success: false,
                message: "Error in insert query",
            })
        }
        else {
            res.status(200).send({
                success: true,
                message: "Product added successfully",
            })
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in add products api",
            error: error,
        })
        console.log(error);
    }
};
//delete product
const deleteProduct = async (req, res) => {
    try {
        const producId = req.params.id;
        if (!producId) {
            return res.status(404).send({
                success: false,
                message: "Please provide valid product id",
            })
        }
        const data = await db.query("DELETE FROM new_table WHERE product_id = ?", [producId])
        if (!data) {
            res.status(404).send({
                success: false,
                message: "Invalid product Id",
            })
        }
        else {
            res.status(200).send({
                success: true,
                message: "Product deleted successfully",
            })
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in delete products api",
            error: error,
        })
        console.log(error);
    }
};
//update product
const updateProduct = async (req, res) => {
    try {
        const producId = req.params.id;
        if (!producId) {
            return res.status(404).send({
                success: false,
                message: "Please provide valid product id",
            })
        }
        const { sku, product_name, category_id, materials_ids, price } = req.body;
        if (!sku || !product_name || !category_id || !materials_ids || !price) {
            return res.status(500).send({
                success: false,
                message: "Please provide all the data required",
            })
        }
        const data = await db.query("UPDATE new_table SET product_name = ? , category_id = ? , material_ids = ? , price = ? , sku = ? WHERE product_id = ?",
            [product_name, category_id, materials_ids, price, sku, producId])
        if (!data) {
            res.status(404).send({
                success: false,
                message: "Error in update query",
            })
        }
        else {
            res.status(200).send({
                success: true,
                message: "Product updated successfully",
            })
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in update product api",
            error: error,
        })
        console.log(error);
    }
};

module.exports = { getAllProducts, addProducts, deleteProduct, updateProduct }