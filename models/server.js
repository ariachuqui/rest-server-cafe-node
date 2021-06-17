const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            users: '/api/users',
            categories: '/api/categories',
            auth: '/api/auth',
            products: '/api/products',
        };

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicación
        this.routes()
    };

    async conectarDB() {
        await dbConnection();
    };

    middlewares() {

        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio Público
        this.app.use( express.static('public') )

    }

    routes() {

        this.app.use( this.paths.users, require('../routes/user'));
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.categories, require('../routes/categories'));
        this.app.use( this.paths.products, require('../routes/products'));
    };

    listen() {
        this.app.listen(this.port, ()=> {
            console.log('Servidor corriendo en puerto', this.port);
        })
    };

}

module.exports = Server