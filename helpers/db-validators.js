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

module.exports = {
    isRoleValid,
    emailExist,
    existUserId
}