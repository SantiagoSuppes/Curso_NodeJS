import { check, validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';
import { generateToken } from '../helpers/tokens.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js';
import e from 'express';

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
  await check('email').isEmail().withMessage('Email vacío o no válido').run(req);
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
    pag: 'Recupera tu acceso a Bienes Raíces',
    csrfToken: req.csrfToken()
  });
}

const resetPassword = async (req, res) => {
  await check('email').isEmail().withMessage('Email vacío o no válido').run(req);

  let errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.render('auth/olvide-password', {
      pag: 'Recupera tu acceso a Bienes Raíces',
      errores: errores.array(),
      csrfToken: req.csrfToken(),
      errores: errores.array()
    });
  }

  const { email } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    return res.render('auth/olvide-password', {
      pag: 'Recupera tu acceso a Bienes Raíces',
      errores: [{ msg: 'El email no pertenece a ningún usuario' }],
      csrfToken: req.csrfToken()
    });
  }

  usuario.token = generateToken();
  await usuario.save();

  emailOlvidePassword({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token
  });

  res.render('templates/mensaje', {
    pag: 'Reestablece tu contraseña',
    mensaje: 'Hemos enviado un correo con las instrucciones para reestablecer tu contraseña.'
  });
}

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render('auth/confirmar-cuenta', {
      pag: 'Reestablecer Contraseña',
      mensaje: 'Hubo un error al validar tu información, intenta de nuevo.',
      error: true
    });
  }

  res.render('auth/reset-password', {
    pag: 'Reestablecer Contraseña',
    csrfToken: req.csrfToken()
  });
}

const nuevoPassword = async (req, res) => {
  await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req);

  let errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.render('auth/reset-password', {
      pag: 'Reestablecer Contraseña',
      errores: errores.array(),
      csrfToken: req.csrfToken()
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ where: { token } });
  usuario.password = password;
  usuario.token = null;
  await usuario.save();

  res.render('auth/confirmar-cuenta', {
    pag: 'Contraseña Reestablecida',
    mensaje: 'La contraseña se guardó correctamente'
  })
}

export { 
  formularioLogin, 
  formularioRegistro,
  registrarUsuario,
  formularioOlvidePassword,
  confirmarCuenta,
  resetPassword,
  comprobarToken,
  nuevoPassword
};