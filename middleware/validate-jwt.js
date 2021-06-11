const { response } = require('express');
const jwt = require("jsonwebtoken");

const User = require('../models/user');

const validateJWT = async( req, res = response, next ) => {
    
    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            msg: 'There is no token in the request'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //Leer el usuario que corresponde al uid
         const userAuthenticated = await User.findById( uid );

         if( !userAuthenticated ) {
            return res.status(401).json({
                msg: 'token not valid'
            })
        }

        //Validar que el usuario Autenticado no ha sido borrado

        if( !userAuthenticated.state ) {
            return res.status(401).json({
                msg: 'token not valid'
            })
        }


        req.userAuthenticated = userAuthenticated;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'token not valid'
        })
    }

}

module.exports = {
    validateJWT
}