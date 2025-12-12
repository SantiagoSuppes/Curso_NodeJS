import { check, validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';
import { generateToken } from '../helpers/tokens.js';
import { emailRegistro } from '../helpers/emails.js';

const formularioLogin = (req, res) => {
  res.render('auth/login', {
    pag: 'Iniciar Sesión'
  });
}

const formularioRegistro = (req, res) => {
  res.render('auth/registro', {
    pag: 'Crear Cuenta',
    csrfToken: req.csrfToken()
  });
}

const registrarUsuario = async (req, res) => {
  await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
  await check('email').isEmail().withMessage('El email no es válido').run(req);
  await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req);
  await check('repetir_password').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);

  let errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.render('auth/registro', {
      pag: 'Crear Cuenta',
      errores: errores.array(),
      csrfToken: req.csrfToken(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    });
  }

  const existeUsuario = await Usuario.findOne({ where: { email: req.body.email } });
  if (existeUsuario) {
    return res.render('auth/registro', {
      pag: 'Crear Cuenta',
      errores: [{ msg: 'El usuario ya está registrado' }],
      csrfToken: req.csrfToken(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    });
  }

  const usuario = await Usuario.create({
    nombre: req.body.nombre,
    email: req.body.email,
    password: req.body.password,
    token: generateToken()
  });

  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token
  });

  res.render('templates/mensaje', {
    pag: 'Cuenta creada correctamente',
    mensaje: 'Hemos enviado un correo de confirmación, presiona el enlace para activar tu cuenta.'
  });
}

const confirmarCuenta = async (req, res) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render('auth/confirmar-cuenta', {
      pag: 'Error al confirmar cuenta',
      mensaje: 'Token no válido',
      error: true
    });
  }

  usuario.confirmado = true;
  usuario.token = null;
  await usuario.save();

  res.render('auth/confirmar-cuenta', {
    pag: 'Cuenta confirmada',
    mensaje: 'La cuenta se confirmó correctamente',
    error: false
  });
}

const formularioOlvidePassword = (req, res) => {
  res.render('auth/olvide-password', {
    pag: 'Recuperar acceso a Bienes Raíces'
  });
}

export { 
  formularioLogin, 
  formularioRegistro,
  registrarUsuario,
  formularioOlvidePassword,
  confirmarCuenta
};