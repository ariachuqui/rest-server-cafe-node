const { Router } = require('express');
const { check } = require('express-validator');

const { uploadFiles, updateImg, getImage } = require('../controllers/uploads');
const { collectionsAllowed } = require('../helpers/db-validators');

const { validateFile, validateField } = require('../middleware');

const router = Router();

router.post('/',validateFile , uploadFiles);

router.put('/:collection/:id',[
    validateFile,
    check('id', 'id is not valid').isMongoId(),
    check('collection').custom( c => collectionsAllowed( c, ['users', 'products'] ) ),
    validateField
], updateImg);

router.get('/:collection/:id',[
    check('id', 'id is not valid').isMongoId(),
    check('collection').custom( c => collectionsAllowed( c, ['users', 'products'] ) ),
    validateField
], getImage);




module.exports = router;
