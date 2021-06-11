const { Router } = require('express');
const { check } = require('express-validator');

const { 
    validateField,
    validateJWT,
    isAdminRol,
    haveRole } = require('../middleware');

const { isRoleValid, emailExist, existUserId } = require('../helpers/db-validators');

const { userGet, 
        userPatch, 
        userPost, 
        userDelete,
        userPut } = require('../controllers/user');

const router = Router();

router.get('/', userGet);

router.put('/:id',[
    check('id', 'This id is not valid').isMongoId(),
    check('id').custom(existUserId),
    validateField
] ,userPut);

router.post('/', [
    check('name', 'the name is required').not().isEmpty(),
    check('password', 'password is required and must be at least 6 characters long').isLength({min:6}),
    check('email', 'this email is not valid').isEmail().custom( emailExist ),
    check('role').custom( isRoleValid ),
    validateField
], userPost);

router.patch('/', userPatch);

router.delete('/:id', [
    validateJWT,
    // isAdminRole,
    haveRole('ADMIN_ROL', 'VENTAS_ROLE'),
    check('id', 'This id is not valid').isMongoId(),
    check('id').custom(existUserId),
    validateField
] ,userDelete);


module.exports = router;