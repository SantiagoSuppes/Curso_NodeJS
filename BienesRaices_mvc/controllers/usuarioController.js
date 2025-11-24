const formularioLogin = (req, res) => {
  res.render('auth/login', {
    pag: 'Iniciar Sesión'
  });
}

const formularioRegistro = (req, res) => {
  res.render('auth/registro', {
    pag: 'Crear Cuenta'
  });
}

export { 
  formularioLogin, 
  formularioRegistro 
};