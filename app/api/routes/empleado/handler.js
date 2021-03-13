const { sequelize } = require('../../../db/config/database');
const {
  Empleado,
  Identidad,
  Cargo,
  Persona,
  Entidad,
  Sexo,
} = require('../../../db/models/relaciones');
const { getCargo } = require('../../helpers/cargos');
const { createIdentidad, updateIdentidad } = require('../../helpers/identidad');
const { createPersona, updatePersona } = require('../../helpers/persona');
// {
//   "nombre" : "Jose Enmanuel",
//   "apellido" : "Estrella Estrella",
//   "sexo" : "M",
//   "identidades": {"identidad":"40210806465", "idTipoIdentidad" : "2c3bd59c-c58f-4795-8dd5-bba9034984d4"},
//   "nacimiento" : "12/22/1999",
//  "telefonos" : [{"telefono":"8096125752", "tipo":"casa"}, {"telefono":"8492777475", "tipo":"celular"}],
//  "cargos" : ["chofer"],
//   "correos" : ["e@gmail.com", "a@gmail.com"],
//   "direcciones" : [{"pais": "Republica Dominicana", "region":"Norte", "ciudad": "Santiago", "municipio":"Punal", "sector": "Laguna Prieta", "calle":"Los estrellas", "casa":"16", "referencia": "frente a la banca"}]
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
      const employes = await Empleado.findAll({
        include: [
          {
            model: Identidad,
            as: 'EmpleadoIdentidad',
            attributes: ['serie'],
          },
          {
            model: Cargo,
            as: 'EmpleadoCargo',
          },
          {
            model: Persona,
            as: 'EmpleadoPersona',

            include: [
              {
                model: Entidad,
                as: 'EntidadPersona',
                where: { status: true },
              },
              {
                model: Sexo,
                as: 'SexoPersona',
              },
            ],
          },
        ],
      });

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
          {
            model: Cargo,
            as: 'EmpleadoCargo',
          },
          {
            model: Persona,
            as: 'EmpleadoPersona',

            include: [
              { model: Entidad, as: 'EntidadPersona', where: { status: true } },
              { model: Sexo, as: 'SexoPersona' },
            ],
          },
        ],
      });

      return res.status(200).send({ data: employe });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  //   {
  //     "nombre" : "Enmanuel",
  //     "apellido" : "Estrella",
  //     "sexo" : "M",
  //     "idEntidad": "7621c242-14cc-4a56-af71-5751216e5bee",
  //     "idPersona": "8d32aca6-5184-40bb-b45f-24f2043ab2cf",
  //     "identidades": {"identidad":"40210806461", "idTipoIdentidad" : "c3ab116b-1373-442c-9d28-9b3b15467b6f"},
  //     "idIdentidad": "33cf4d76-da80-44a9-a1a7-3ca70a19f824",
  //     "idEmpleado": "b0bb73ad-38b7-4c42-b128-0f2009b5069b",
  //     "nacimiento" : "12/22/1990",
  //    "telefonos" : [{"idTelefono": "8b1b9487-34aa-4186-b62a-c6478cb63f89","telefono":"8888888888", "tipo":"casa"}, {"idTelefono": "3b3df1f6-1fdc-4849-8ecc-db1e35394cc2","telefono":"8488888888", "tipo":"celular"}],
  //    "cargos" : ["chofer"],
  //     "correos" : [{"idCorreo":"dd648635-256e-44f7-a95f-b380f89badb9","correo":"enmanuel@gmail.com"}, {"idCorreo":"5af0e621-5ca0-4606-8d9a-723fa16f2706","correo":"alay@gmail.com"}],
  //     "direcciones" : [{"idDireccion":"4a447012-1f8a-4160-9335-362cc5abb6aa", "pais": "Republica Dominicana", "region":"Norte", "ciudad": "Jarabacoa", "municipio":"Punal", "sector": "Laguna Prieta", "calle":"Los estrellas", "casa":"16", "referencia": "frente a la banca"}]
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

      if (!getEmploye) {
        return res.status(409).send({ message: 'Este Empleado no existe' });
      }

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
