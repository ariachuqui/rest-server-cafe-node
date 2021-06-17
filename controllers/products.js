const { response } = require("express");
const { Product } = require("../models");

//getProducts products - paginado - total - populate
const getProducts = async(req, res = response) => {
    const {limit = 5, skip = 0} = req.query;
    const query = {state: true};

    const products = await Promise.all([
        Product.countDocuments( query ),
        Product.find( query )
        .populate('user', 'name')
        .populate('category', 'name')
        .limit( Number(limit) )
        .skip( Number(skip) )
    ]);


    res.status(200).json({
        products
    });
}

//getProduct - populate
const getProduct = async(req, res = response) => {
    const id = req.params.id;

    const product = await Product.findById( id )
        .populate('user', 'name')
        .populate('category', 'name');

    res.status(200).json({
        product               
    });
}

//createProduct 
const createProduct = async(req, res = response) => {

    const [state, user, ...newProduct] = req.body;
    const name = req.body.name.toUpperCase();
    newProduct.name = name;

    //Validate if the product already exists
    const productExist = await Product.findOne({ name })

    if ( productExist ) {
        return   res.status(400).json({
              msg: `The product ${productExist.name} already exist`
          });
    }

    //Create data
    const data = { 
        ...newProduct,
        state: true,
        user : req.userAuthenticated._id,
    }

    //Create products
    const product = new Product( data );

    //Save in db
    await product.save();

    res.status(200).json({
        msg: 'post - product created',
        product
    });
}

//updateProduct 
const updateProduct = async(req, res = response) => {
    const id = req.params.id;

    const { state, user, name, ...rest } = req.body;

    if( name ) {
        rest.name = name.toUpperCase();
    }

    rest.user = req.userAuthenticated._id;

    const product = await Product.findByIdAndUpdate( id, rest, {new: true} );

    res.status(200).json({
        msg: 'Product Updated',
        product
    });
}

//deleteProduct
const deleteProduct = async(req, res = response) => {
    const { id } = req.params;

    const productDeleted = await Product.findByIdAndUpdate(id, {state: false}, {new: true},);

    const userAuthenticated = req.userAuthenticated;

    res.status(200).json({
        msg: 'Product deleted',
        productDeleted,
        userAuthenticated
    });
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}