const { Op } = require('sequelize');
const { sequelize } = require('../../../db/config/database');
const { Empleado, Identidad } = require('../../../db/models/relaciones');
const { getCargo } = require('../../helpers/cargos');
const { createIdentidad, updateIdentidad } = require('../../helpers/identidad');
const { createPersona, updatePersona } = require('../../helpers/persona');
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
  async getEmployes(req, res) {
    try {
      const employes = await Empleado.findAll();

      return res.status(200).send({ data: employes });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getEmployeByIdentidad(req, res) {
    const { serie } = req.params;

    try {
      const employe = await Empleado.findOne({
        include: [
          {
            model: Identidad,
            as: 'EmpleadoIdentidad',
            attributes: ['serie'],
            where: {
              serie,
            },
          },
        ],
      });

      return res.status(200).send({ data: employe });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  // {
  //     "nombre" : "Enmanuel",
  //     "apellido" : "Estrella",
  //     "sexo" : "M",
  //     "idEntidad": "werfgqwerfwe",
  //     "idPersona": "werfgqwerfwe",
  //     "identidades": {identidad:"40210806465", "idTipoIdentidad" : "217851e6-abba-4356-8861-e534eca6de5d"},
  //     "idIdentidad": "1234rtgertg",
  //     "IdEmpleado": "qwerdfwedf",
  //     "nacimiento" : "12/22/1999",
  //    "telefonos" : [{"telefono":"8096125752", "tipo":"casga"}, {"telefono":"8492777475", "tipo":"celular"}],
  //    "cargos" : ["chofer"],
  //     "correos" : ["e@gmail.com", "a@gmail.com"],
  //     "direcciones" : [{"pais": "Republica Dominicana", "region":"Norte", "ciudad": "Santiago", "municipio":"Punal", "sector": "Laguna Prieta", "calle":"Los estrellas", "casa":"16", "referencia": "frente a la banca"}]
  // }
  async updateEmploye(req, res) {
    const {
      apellido = '',
      sexo = '',
      idEmpleado = '',
      cargos = [],
      identidades = {},
      idIdentidad,
      idEntidad = '',
      idPersona = '',
      nombre = '',
      nacimiento = '',
      telefonos = [],
      correos = [],
      direcciones = [],
    } = req.body;
    let data = {};

    try {
      const getEmploye = await Empleado.findOne({
        where: { idEmpleado },
      });

      const { status: statusE, message: messageE } = await updateIdentidad({
        identidades,
        idIdentidad,
      });

      if (!statusE) {
        return res.status(409).send(messageE);
      }

      const idCargos = await getCargo({
        cargos,
      });

      const { status, message } = await updatePersona({
        nombre,
        nacimiento,
        telefonos,
        correos,
        direcciones,
        apellido,
        sexo,
        idEntidad,
        idPersona,
      });
      if (!status) {
        return res.status(409).send(message);
      }

      data = await Empleado.update(
        {
          idPersona,
          idIdentidad,
        },
        { where: { idEmpleado } }
      );

      await getEmploye.setEmpleadoCargo(idCargos);

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
