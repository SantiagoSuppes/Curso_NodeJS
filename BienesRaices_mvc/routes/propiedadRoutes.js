import express from 'express';
import { body } from 'express-validator';
import { admin, crear, guardar } from '../controllers/propiedadController.js';

const router = express.Router();

router.get('/mis-propiedades', admin);
router.get('/propiedades/crear', crear);
router.post('/propiedades/crear', 
    body('titulo').notEmpty().withMessage('El título del anuncio es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripción es obligatoria').isLength({ max: 200 }).withMessage('La descripción no puede superar los 200 caracteres'),
    body('categoria').isNumeric().withMessage('Selecciona una categoría válida'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios válido'),
    body('habitaciones').isNumeric().withMessage('Selecciona un número de habitaciones válido'),
    body('estacionamiento').isNumeric().withMessage('Selecciona un número de estacionamientos válido'),
    body('baños').isNumeric().withMessage('Selecciona un número de baños válido'),
    body('latitud').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardar
);

export default router;