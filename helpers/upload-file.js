const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( { file }, allowedExtensions = [ 'png', 'jpg', 'jpeg', 'gif' ], folder='' ) => {

    return new Promise((resolve, reject) => {
        const nameCutOff = file.name.split('.');
        const extension = nameCutOff[ nameCutOff.length -1  ]

        //Validate extension
        if( !allowedExtensions.includes( extension ) ) {
            return reject( `${extension} extension is not allowed - ${allowedExtensions}` )
        }
    
        const temporalName = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, temporalName);
    
        file.mv(uploadPath, (err) => {
        if (err) {
            return reject(err)
        }
    
        resolve( temporalName )
        });
    });

}

module.exports = {
    uploadFile
}