import Propiedad from './Propiedad.js';
import Usuario from './Usuario.js';
import Categoria from './Categoria.js';
import Precio from './Precio.js';

// Relaciones
Propiedad.belongsTo(Precio, { foreignKey: 'precioId' });
Propiedad.belongsTo(Categoria, { foreignKey: 'categoriaId' });
Propiedad.belongsTo(Usuario, { foreignKey: 'usuarioId' });


export {
    Propiedad,
    Usuario,
    Categoria,
    Precio
};