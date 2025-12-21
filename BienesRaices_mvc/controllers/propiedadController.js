import { validationResult } from "express-validator"; 
import { Precio, Categoria, Propiedad } from "../models/index.js";

const admin = (req, res) => {
    res.render('propiedades/admin', {
        pag: 'Mis Propiedades',
        navbar: true
    });
}

const crear = async (req, res) => {
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);

    res.render('propiedades/crear', {
        pag: 'Crear Propiedad',
        navbar: true,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    });
}

const guardar = async (req, res) => {
    let errores = validationResult(req);

    if(!errores.isEmpty()) {
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ]);

        return res.render('propiedades/crear', {
            pag: 'Crear Propiedad',
            navbar: true,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: errores.array(),
            datos: req.body
        });
    }

    // Crear un registro en la base de datos
    const { titulo, descripcion, categoria, precio, habitaciones, estacionamiento, baños, latitud, longitud, direccion } = req.body;

    try {
        const propiedadGuardada = await Propiedad.create({
            titulo: titulo,
            descripcion: descripcion,
            categoriaId: categoria,
            precioId: precio,
            habitaciones: habitaciones,
            estacionamiento: estacionamiento,
            baños: baños,
            lat: latitud,
            lng: longitud,
            direccion: direccion,
            publicado: true,
            usuarioId: req.usuario.id
        });

    } catch (error) {
        console.log(error);
    }
}

export { 
    admin,
    crear,
    guardar
};