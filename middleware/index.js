const validateField = require('./validate-fields');
const validateJWT  = require('../middleware/validate-jwt');
const validateRoles = require('../middleware/validate-roles');

module.exports = {
    ...validateField,
    ...validateJWT,
    ...validateRoles
}