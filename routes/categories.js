const { Router } = require('express');
const { check } = require('express-validator');

const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');
const { existCategoryId } = require('../helpers/db-validators');

const { validateField, validateJWT, isAdminRole } = require('../middleware');


const router = Router();

//Obtener todas las categorias - public
router.get('/', getCategories);

//Obtener una categoria - publico
router.get('/:id', [
    check( 'id', 'the id is not valid' ).isMongoId(),
    check('id').custom( existCategoryId ),
    validateField
],getCategory);

//Crear categoria - privado - con cualquier persona con token valido
router.post('/',[
    validateJWT,
    check('name', 'the name is required').not().isEmpty(),
    validateField
] , createCategory);

//Actualizar registo por id - privado - cualquier rol
router.put('/:id', [
    validateJWT,
    check( 'id', 'the id is not valid' ).isMongoId(),
    check('id').custom( existCategoryId ),
    validateField
], updateCategory);

//Borrar cateogira - privado - ADMIN 
router.delete('/:id',[
    validateJWT,
    isAdminRole,
    check('id', 'This id is not valid').isMongoId(),
    check('id').custom( existCategoryId ),
    validateField
] ,deleteCategory);

module.exports = router;
