import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
  const { nombre, email, token } = datos;
    const transport = nodemailer.createTransport({
    host: process.env.mailtest_host,
    port: process.env.mailtest_port,
    auth: {
        user: process.env.mailtest_user,
        pass: process.env.mailtest_pass
    }
  });
    const info = await transport.sendMail({
    from: '"Bienes Raíces" <no-reply@bienesraices.com>',
    to: email,
    subject: "Confirma tu cuenta en Bienes Raíces",
    text: "Confirma tu cuenta en Bienes Raíces",
    html: `<p>Hola ${nombre}, confirma tu cuenta en Bienes Raíces.</p>
           <p>Tu cuenta ya está casi lista, solo debes confirmarla en el siguiente enlace:</p>
           <a href="${process.env.backend_url}:${process.env.port ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a>
           <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p>`
    });
    console.log("Mensaje enviado: %s", info.messageId);
}

export { emailRegistro };