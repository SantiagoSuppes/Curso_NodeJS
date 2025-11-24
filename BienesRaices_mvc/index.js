import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Carpeta pública
app.use(express.static('public'));

// Usar las rutas definidas en usuarioRoutes.js
app.use('/auth', usuarioRoutes);