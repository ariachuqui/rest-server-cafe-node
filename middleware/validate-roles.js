const { response } = require("express");

const isAdminRole = ( req, res = response, next ) => {
    
    if(!req.userAuthenticated)  {
        return res.status(500).json({
            msg: 'valid token first'
        });
    }

    const { role, name } = req.userAuthenticated;

    if( role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: 'Only admin are authorized'
        })
    }

    next();
}

const haveRole = ( ...roles ) => {
    return ( req, res = response, next ) => {
        
        if(!req.userAuthenticated)  {
            return res.status(500).json({
                msg: 'valid token first'
            });
        }

        if( !roles.includes(req.userAuthenticated.role) ) {
            return res.status(401).json({
                msg: `Only roles: ${ roles } are authorized`
            })
        }
        next();
    }
}

module.exports = {
    isAdminRole,
    haveRole
}