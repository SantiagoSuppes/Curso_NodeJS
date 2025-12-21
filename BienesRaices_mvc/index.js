import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadRoutes from './routes/propiedadRoutes.js';
import db from './config/db.js';

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//Conectar la base de datos
try {
  await db.authenticate();
  db.sync();
  console.log('DB connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Carpeta pública
app.use(express.static('public'));

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Habilitar Cookie Parser
app.use(cookieParser());

// Habilitar CSRF
app.use(csrf({ cookie: true }));

// Routing
app.use('/auth', usuarioRoutes);
app.use('/', propiedadRoutes);