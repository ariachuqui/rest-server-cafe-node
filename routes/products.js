const { Router } = require('express');
const { check } = require('express-validator');

const { 
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct } = require('../controllers/products');

    const { validateField, validateJWT, isAdminRole } = require('../middleware');
    
    const { existCategoryId, existProductId } = require('../helpers/db-validators');

const router = Router();

//get all products - public
router.get('/', getProducts);

//get one product- public
router.get('/:id', [
    check('id', 'the id is not valid').isMongoId(),
    check('id').custom(existProductId),
    validateField
], getProduct);

//post products - private - everyone with valid token
router.post('/',[
    validateJWT,
    check('name', 'the name is required').not().isEmpty(),
    check('name', 'the name has to be a string').isString(),
    check('category', "the id is not valid").isMongoId(),
    check('category').custom(existCategoryId),
    validateField
], createProduct);


//put products - private - everyone with valid token
router.put('/:id',[
    validateJWT,
    check( 'id', 'the id is not valid' ).isMongoId(),
    check('id').custom( existProductId ),
    check('category', "the id is not valid").isMongoId(),
    check('category').custom(existCategoryId),
    validateField
], updateProduct);


//delete products - private - only admin are authorized
router.delete('/:id',[
    validateJWT,
    isAdminRole,
    check('id', 'This id is not valid').isMongoId(),
    check('id').custom( existProductId ),
    validateField
], deleteProduct);

module.exports = router;

