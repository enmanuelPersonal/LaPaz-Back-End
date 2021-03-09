const { Op } = require('sequelize');
const { sequelize } = require('../../../db/config/database');
const { Empleado } = require('../../../db/models/relaciones');
const { getCargo } = require('../../helpers/cargos');
const { createIdentidad } = require('../../helpers/identidad');
const { createPersona } = require('../../helpers/persona');
// {
//     "nombre" : "Enmanuel",
//     "apellido" : "Estrella",
//     "sexo" : "M",
//     "identidades": {identidad:"40210806465", "idTipoIdentidad" : "217851e6-abba-4356-8861-e534eca6de5d"},
//     "nacimiento" : "12/22/1999",
//    "telefonos" : [{"telefono":"8096125752", "tipo":"casga"}, {"telefono":"8492777475", "tipo":"celular"}],
//    "cargos" : ["chofer"],
//     "correos" : ["e@gmail.com", "a@gmail.com"],
//     "direcciones" : [{"pais": "Republica Dominicana", "region":"Norte", "ciudad": "Santiago", "municipio":"Punal", "sector": "Laguna Prieta", "calle":"Los estrellas", "casa":"16", "referencia": "frente a la banca"}]
// }
module.exports = {
  async addEmploye(req, res) {
    const {
      apellido = '',
      sexo = '',
      cargos = [],
      identidades = {},
      idPersona: idPersonaCreate = '',
      nombre = '',
      nacimiento = '',
      telefonos = [],
      correos = [],
      direcciones = [],
    } = req.body;
    let data = {};

    try {
      await sequelize.transaction(async (transaction) => {
        const {
          status: statusE,
          idIdentidad,
          message: messageE,
        } = await createIdentidad({
          identidades,
        });

        if (!statusE) {
          return res.status(409).send(messageE);
        }

        const idCargos = await getCargo({
          cargos,
        });

        if (idPersonaCreate) {
          data = await Empleado.create({
            idPersona: idPersonaCreate,
            idIdentidad,
          });
        } else {
          const { status, idPersona, message } = await createPersona({
            nombre,
            nacimiento,
            telefonos,
            correos,
            direcciones,
            apellido,
            sexo,
            transaction,
          });
          if (!status) {
            return res.status(409).send(message);
          }

          const EmployeExist = await Empleado.findOne({
            where: { idPersona },
          });

          if (EmployeExist) {
            return res.status(409).send({
              data: userExist,
              message: 'Este Empleado ya esta registrado.',
            });
          }

          data = await Empleado.create({
            idPersona,
            idIdentidad,
          });
        }

        await data.setEmpleadoCargo(idCargos);

        return res.status(201).send({ data });
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
