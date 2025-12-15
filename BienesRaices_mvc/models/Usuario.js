import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../config/db.js';

const Usuario = db.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    confirmado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'usuarios',
    hooks: {
        beforeCreate: async (usuario) => {
            const salt = bcrypt.genSaltSync();
            usuario.password = bcrypt.hashSync(usuario.password, salt);
        },
        beforeUpdate: async (usuario) => {
            if (usuario.changed('password')) {
                const salt = bcrypt.genSaltSync();
                usuario.password = bcrypt.hashSync(usuario.password, salt);
            }
        }
    }
});

export default Usuario;