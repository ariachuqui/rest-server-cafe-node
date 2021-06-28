const { Category, Product } = require('../models');
const Role = require('../models/role');
const User = require('../models/user')

const isRoleValid = async(role = '') => {
    const roleExist = await Role.findOne({role});
    if(!roleExist){
        throw new Error(`the role ${ role } is not registered in the database`);
    }
}

const emailExist = async( email = '' ) => {
    const isRepeted = await User.findOne({ email });
     if ( isRepeted ) {
        throw new Error('this email already exists');
    }

}

const existUserId = async( id ) => {
    const userExist = await User.findById( id );
     if ( !userExist ) {
        throw new Error('this id does not exists');
    }
}

const existCategoryId = async( id = '' ) => {
    const existCategory = await Category.findById( id );
    if ( !existCategory ) {
        throw new Error('this id does not exists');
    }
}

const existProductId = async( id = '' ) => {
    const existProduct = await Product.findById( id );
    if ( !existProduct ) {
        throw new Error('this id does not exists');
    }
}

const collectionsAllowed = ( collection = '', collections = [] ) => {
    
    const include = collections.includes( collection );
    if( !include ) {
        throw new Error(`The collection ${collection} is not allowed - ${collections}`)
    }

    return true
}

module.exports = {
    isRoleValid,
    emailExist,
    existUserId,
    existCategoryId,
    existProductId,
    collectionsAllowed
}