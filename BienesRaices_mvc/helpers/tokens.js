import jwt from 'jsonwebtoken';

const generateToken = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

const generateJWT = datos => jwt.sign({ id: datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, { expiresIn: '1d' });

export { generateToken, generateJWT };