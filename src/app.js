import express from 'express';

import handlebars from 'express-handlebars';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';

import mongoose from 'mongoose';
import initializePassport from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { __dirname } from './utils.js';
import cartsRoutes from './routes/carts.routes.js';
import productsRoutes from './routes/products.routes.js';
import sessionRoutes from './routes/session.routes.js';
import viewsRouter from './routes/views.routes.js';

const app = express();

mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://joaquincoder:joaquincoder123@cluster1.lygovs4.mongodb.net/?retryWrites=true&w=majority').
    catch(err => console.log('Error al conectar a MongoDB', err));

// handlebars
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set('view engine', 'hbs')
app.set('views', `${__dirname}/views`)

// ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartsRoutes);
app.use('/session', sessionRoutes);
app.use('/', viewsRouter);
app.get('*', (req, res) => { res.status(404).send('404 not found')})


app.listen(3000, () => console.log('Corriendo servidor en el puerto... 3000'))