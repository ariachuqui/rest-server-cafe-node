const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const { uploadFile } = require("../helpers/upload-file");

const {User, Product} = require("../models")

const uploadFiles = async(req, res=response) => {

    try {
        const name = await uploadFile( req.files );
    
        res.status(500).json({
            name
        })
    } catch (err) {
        res.status(400).json({
            msg: err
        })
    }
  
}

const updateImg = async(req, res = response) => {

    const {collection, id} = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id)
            if(!model) {
                return res.status(400).json({msg: 'the id is not valid'})
            }
            break;

        case 'products':
            model = await Product.findById(id)
            if(!model) {
                return res.status(400).json({msg: 'the id is not valid'})
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'not validated' })
    }

    //Clean previous images
    if(model.img) {
        const nameArr = model.img.split('/');
        const name = nameArr[nameArr.length - 1];
        const [ public_id ] = name.split('.');

        await cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } = req.files.file;

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    model.img = secure_url;
    await model.save();

    res.status(500).json({
        msg: 'image updated',
        model
    });
}

const getImage = async(req, res = response) => {

    const {collection, id} = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id)
            if(!model) {
                return res.status(400).json({msg: 'the id is not valid'})
            }
            break;

        case 'products':
            model = await Product.findById(id)
            if(!model) {
                return res.status(400).json({msg: 'the id is not valid'})
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'not validated' })
    }

    //Clean previous images
    if(model.img) {
        const pathImage = path.join( __dirname, '../uploads', collection, model.img );
        if( fs.existsSync(pathImage) ) {
           return res.sendFile( pathImage )
        }
    }

    res.sendFile( path.join( __dirname, '../assets/no-image.jpg' ) )
}

module.exports = {
    uploadFiles,
    updateImg,
    getImage
}