const { Router } = require('express');
const { check } = require('express-validator');

const { emailExist } = require('../helpers/db-validators');
const { validateField } = require('../middleware/validate-fields');

const { login } = require('../controllers/auth');

const router = Router();

router.post('/login',[
    check('email', 'this email is required').isEmail(),
    check('password', 'this password is required').not().isEmpty(),
    validateField
] ,login);


module.exports = router;