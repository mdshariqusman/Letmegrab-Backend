const db = require("../db");

// get the products
const getAllProducts = async (req, res) => {
    try {
        // {
        //     product_id: 1,
        //     product_name: 'Shariq',
        //     price: 900,
        //     url: 'https://example.com/image.jpg',
        //     category_id: '1'
        // }
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
// Sameple request body
// { 
//     "sku" :"dfdmksjfms4353f",
//     "product_name" :"Shariq's Api", 
//       "price": 800,
//       "material":"cotton",
//       "category_name":"Testing",
//       "url":"test.png"
//       }
const addProducts = async (req, res) => {
    try {
        const { sku, product_name, price, material, category_name, url } = req.body;
        if (!sku || !product_name || !material || !category_name || !price || !url) {
            return res.status(500).send({
                success: false,
                message: "Please provide all the data required",
            })
        }
        //Checking if SKU is already present
        const [productSku] = await db.query(`SELECT SKU FROM new_table WHERE SKU = ?`, [sku]);
        if (productSku.length > 0)  {
            return res.status(500).send({
                success: false,
                message: "SKU is already registered",
            })
        }
        //Material Table
        const [materialRow] = await db.query(`SELECT material_id FROM material WHERE material_name = ?`, [material]);
        let materialId;
        if (materialRow.length > 0) {
            materialId = materialRow[0].material_id;
        } else {
            const [materialResult] = await db.query(
                `INSERT INTO material (material_name) VALUES (?)`,
                [material]
            );
            materialId = materialResult.insertId;
        }
        // Category Table
        const [categoryRow] = await db.query(`SELECT category_id FROM category WHERE category_name = ?`, [category_name]);
        let categoryId;
        if (categoryRow.length > 0) {
            categoryId = categoryRow[0].category_id;
        } else {
            const [categoryResult] = await db.query(
                `INSERT INTO category (category_name) VALUES (?)`,
                [category_name]
            );
            categoryId = categoryResult.insertId;
        }
        //Product Table
        const [productResult] = await db.query("INSERT INTO new_table (SKU,product_name,category_id,material_ids,price) VALUES (?,?,?,?,?)",
            [sku, product_name, categoryId, materialId, price])
        const product_id = productResult.insertId;

        //Media Table
        const [mediaRow] = await db.query(`SELECT media_id FROM product_media WHERE url = ?`, [url]);
        let mediaId;
        if (mediaRow.length > 0) {
            mediaId = mediaRow[0].media_id;
        } else {
            const [mediaResult] = await db.query(
                `INSERT INTO product_media (product_id,url) VALUES (?,?)`,
                [product_id, url]
            );
            mediaId = mediaResult.insertId;
        }
        if (!mediaId) {
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
        const [productRows] = await db.query(`SELECT product_id FROM new_table WHERE product_id = ?`, [producId]);
        if (productRows.length == 0)  {
            return res.status(500).send({
                success: false,
                message: "Invalid Product ID",
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
        const { sku, product_name, price, material, category_name, url } = req.body;
        if (!sku || !product_name || !material || !category_name || !price || !url) {
            return res.status(500).send({
                success: false,
                message: "Please provide all the data required",
            })
        }
        //Update Category Table
        const [categoryRow] = await db.query(`SELECT category_id FROM category WHERE category_name = ?`, [category_name]);
        let categoryId;
        if (categoryRow.length > 0) {
            categoryId = categoryRow[0].category_id;
            await db.query("UPDATE category SET category_name = ? WHERE category_id = ?",
                [category_name, categoryId])
        } else {
            const [categoryResult] = await db.query(
                `INSERT INTO category (category_name) VALUES (?)`,
                [category_name]
            );
            categoryId = categoryResult.insertId;
        }
        //Update Material Table
        const [materialRow] = await db.query(`SELECT material_id FROM material WHERE material_name = ?`, [material]);
        let materialId;
        if (materialRow.length > 0) {
            materialId = materialRow[0].material_id;
            await db.query("UPDATE material SET material_name = ? WHERE material_id = ?",
                [material, materialId])
        } else {
            const [materialResult] = await db.query(
                `INSERT INTO material (material_name) VALUES (?)`,
                [material]
            );
            materialId = materialResult.insertId;
        }
        //Update Media Table
        const [mediaRow] = await db.query(`SELECT media_id FROM product_media WHERE url = ?`, [url]);
        let mediaId;
        if (mediaRow.length > 0) {
            mediaId = mediaRow[0].media_id;
            await db.query("UPDATE product_media SET url = ? WHERE product_id = ?",
                [url, producId])
        } else {
            const [mediaResult] = await db.query(
                `INSERT INTO product_media (product_id,url) VALUES (?,?)`,
                [producId, url]
            );
            mediaId = mediaResult.insertId;
        }

        //Update Product Table
        const data = await db.query("UPDATE new_table SET product_name = ? , category_id = ? , material_ids = ? , price = ? , sku = ? WHERE product_id = ?",
            [product_name, categoryId, materialId, price, sku, producId])
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