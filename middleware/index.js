const validateField = require('./validate-fields');
const validateJWT  = require('../middleware/validate-jwt');
const validateRoles = require('../middleware/validate-roles');
const validateFile = require('../middleware/validate-file');

module.exports = {
    ...validateField,
    ...validateJWT,
    ...validateRoles,
    ...validateFile
}