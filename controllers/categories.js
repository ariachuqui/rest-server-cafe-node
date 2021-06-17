const { response } = require("express");

const { Category } = require("../models");


//Obtener Categorias - paginado - total - populate
const getCategories = async(req, res = response) => {
    const {limit = 5, skip = 0} = req.query;
    const query = {state: true};

    const categories = await Promise.all([
        Category.countDocuments( query ),
        Category.find( query )
        .populate('user', 'name')
        .limit( Number(limit) )
        .skip( Number(skip) )
    ]);


    res.status(200).json({
        categories
    });
}

//Obtener Categoria - populate {}
const getCategory = async(req, res = response) => {

    const id = req.params.id;

    const category = await Category.findById( id ).populate('user', 'name');

    res.status(200).json({
        category               
    });
}


const createCategory = async(req, res = response) => {

    const name = req.body.name.toUpperCase();

    const categoryExist = await Category.findOne({ name })

    if ( categoryExist ) {
        return   res.status(400).json({
              msg: `The Category ${categoryExist.name} already exist`
          });
    }

    const data = { 
        name,
        state : true,
        user: req.userAuthenticated._id
    }

    const category = new Category( data );

    //Guardar en db
    await category.save();

    res.status(201).json({
        msg: 'Category Created',
        category
    });
}

//aCTUALIZAR Categoria 
const updateCategory = async(req, res = response) => {

    const id = req.params.id;

    const { state, user, name, ...rest } = req.body;

    if( name ) {
        rest.name = name.toUpperCase();
    }

    rest.user = req.userAuthenticated._id;

    const category = await Category.findByIdAndUpdate( id, rest, {new: true} );

    res.status(200).json({
        msg: 'Category Updated',
        category
    });
}

//Borrar categoria -state:false
const deleteCategory = async(req, res = response) => {

    const { id } = req.params;

    const categoryDeleted = await Category.findByIdAndUpdate(id, {state: false}, {new: true},);

    const userAuthenticated = req.userAuthenticated;

    res.status(200).json({
        msg: 'Category deleted',
        categoryDeleted,
        userAuthenticated
    });
}




module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}