const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const { generateJWT } = require('../helpers/generate-jwt');

const login = async( req, res = response ) => {

    const {email, password} = req.body;

    try {

        const user = await User.findOne({ email });

        // Verificar si el email existe
        if( !user ) {
            return res.status(400).json({
                msg: 'User / password are not correct'
            })
        }

        //User está activos
        if( !user.state ) {
            return res.status(400).json({
                msg: 'User / password are not correct'
            })
        }

        //Validar contraseña
        const validPassword = bcryptjs.compareSync(password, user.password)
        if(!validPassword) {
            return res.status(400).json({
                msg:'User / password are not correct'
            })
        }

        //Generar JWT
        const token = await generateJWT(user.id);


        res.json({
            user,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            msg: 'talk to the administrator'
        })
    }

}

module.exports = {
    login
}