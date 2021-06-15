const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignin = async(req, res=response) => {

    const {id_token} = req.body;

    try {

        const { email, name, img } = await googleVerify( id_token  );
        
        //Verificamos si el email del usuario ya está registrado
        let user = await User.findOne( {email} );

        //Puede pasar que el usuario existe, como que no existe y es la primera vez que se registra
        
        //Si no existe, tengo que crearlo
        if( !user ) {
            const data = {
                name,
                email,
                password: '',
                img,
                google: true
            }

            user = new User( data );
            await user.save();
        }

        //Si el usuario  en DB tiene state en false
        if( !user.state ) {
            return res.status(401).json({
                msg: "talk to the administrator, user blocked"
            })
        }

        //Generar JWT
        const token = await generateJWT(user.id);

        res.json({
            msg: 'Google sing in - ok',
            user,
            token
        })
    
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Google token is not valid',
            id_token
        })

    }
}

module.exports = {
    login,
    googleSignin
}