import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
  const { nombre, email, token } = datos;
    const transport = nodemailer.createTransport({
    host: process.env.MAILTEST_HOST,
    port: process.env.MAILTEST_PORT,
    auth: {
        user: process.env.MAILTEST_USER,
        pass: process.env.MAILTEST_PASS
    }
  });
    const info = await transport.sendMail({
    from: '"Bienes Raíces" <no-reply@bienesraices.com>',
    to: email,
    subject: "Confirma tu cuenta en Bienes Raíces",
    text: "Confirma tu cuenta en Bienes Raíces",
    html: `<p>Hola ${nombre}, confirma tu cuenta en Bienes Raíces.</p>
           <p>Tu cuenta ya está casi lista, solo debes confirmarla en el siguiente enlace:</p>
           <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a>
           <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>`
    });
    console.log("Mensaje enviado: %s", info.messageId);
}

const emailOlvidePassword = async (datos) => {
  const { nombre, email, token } = datos;
    const transport = nodemailer.createTransport({
    host: process.env.MAILTEST_HOST,
    port: process.env.MAILTEST_PORT,
    auth: {
        user: process.env.MAILTEST_USER,
        pass: process.env.MAILTEST_PASS
    }
  });
    const info = await transport.sendMail({
    from: '"Bienes Raíces" <no-reply@bienesraices.com>',
    to: email,
    subject: "Recupera tu acceso a Bienes Raíces",
    text: "Recupera tu acceso a Bienes Raíces",
    html: `<p>Hola ${nombre}, has solicitado recuperar tu acceso a Bienes Raíces.</p>
           <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
           <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Restablecer Contraseña</a>
           <p>Si tú no solicitaste este cambio, puedes ignorar este mensaje.</p>`
    });
}


export { emailRegistro, emailOlvidePassword };