import categorias from "./categorias.js";
import db from "../config/db.js";
import precios from "./precios.js";
import { Categoria, Precio } from "../models/index.js";

const importarDatos = async () => {
    try {
        await db.authenticate();
        await db.sync();
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios)
        ]);
        console.log('Datos importados correctamente');
        process.exit();

    } catch (error) {
        console.log('No se pudo conectar a la base de datos');
        console.log(error);
        process.exit(1);
    }
}

const eliminarDatos = async () => {
    try {
        await db.sync({ force: true });
        console.log('Datos eliminados correctamente');
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

if (process.argv[2] === '-i') {
    importarDatos();
}

if (process.argv[2] === '-d') {
    eliminarDatos();
}