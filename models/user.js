const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name :{
        type: String,
        require: [true, 'name is require']
    },
    email :{
        type: String,
        require: [true, 'email is require'],
    },
    password: {
        type: String,
        require: [true, 'password is require']
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        require: [true, 'role is required'],
    },
    state: {
        type: Boolean,
        require: [true, 'state is required'],
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}


module.exports = model('User', UserSchema)
