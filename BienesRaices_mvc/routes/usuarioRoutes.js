import express from 'express';
import { formularioLogin, formularioRegistro, registrarUsuario, formularioOlvidePassword, confirmarCuenta, resetPassword, comprobarToken, nuevoPassword, autenticarUsuario } from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/login', formularioLogin);
router.post('/login', autenticarUsuario);

router.get('/registro', formularioRegistro);
router.post('/registro', registrarUsuario);

router.get('/confirmar/:token', confirmarCuenta);

router.get('/olvide-password', formularioOlvidePassword);
router.post('/olvide-password', resetPassword);

router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);


export default router; 