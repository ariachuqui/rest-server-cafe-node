const { response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');


const userGet = async(req, res = response) => {
    const {limit = 5, skip = 0} = req.query;

    const users = await User.find()
        .limit( Number(limit) )
        .skip( Number(skip) );

    res.status(403).json({
        users
    });
}

const userPost = async(req, res = response) => {

    const {name, email, password, role} = req.body;
    const user = new User( {name, email, password, role} );

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    //Guardar en BD
    await user.save();

    res.status(201).json({
        msg: 'post API - controller',
        user
    });
}

const userPut = async(req, res = response) => {

    const id = req.params.id;
    const { password, google, email, ...rest } = req.body;

    //TODO: VALIDAR CONTRA BASE DE DATOS
    if( password ) {
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate( id, rest );

    res.status(500).json({
        msg: 'put API - controller',
        user
    });
}

const userPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controller'
    });
}

const userDelete = async(req, res = response) => {

    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, {state: false})

    const userAuthenticated = req.userAuthenticated;

    res.json({
        user,
        userAuthenticated
    });
}



module.exports = {
    userGet,
    userPost,
    userPatch,
    userPut,
    userDelete
}