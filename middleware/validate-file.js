const validateFile = ( req, res = response, next ) => {
    
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            msg: 'there are no files in the request'
        });
        
      }
  
    next();
}

module.exports = {
    validateFile
}