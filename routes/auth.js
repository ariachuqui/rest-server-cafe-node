const { Router } = require('express');
const { check } = require('express-validator');

const { validateField } = require('../middleware/validate-fields');

const { login, googleSingin } = require('../controllers/auth');

const router = Router();

router.post('/login',[
    check('email', 'this email is required').isEmail(),
    check('password', 'this password is required').not().isEmpty(),
    validateField
] ,login);

router.post('/google',[
    check('id_token', 'id token is required').not().isEmpty(),
    validateField
] ,googleSingin);


module.exports = router;