const { sequelize } = require('../../../db/config/database');
const {
  Identidad,
  Pariente,
  Cliente,
  Persona,
  Difunto,
} = require('../../../db/models/relaciones');
const {
  personDeceasedParams,
  clientDeceasedParams,
} = require('../../utils/constant');

// {
//   "idCliente": "79a5dacf-d567-4f68-ae12-384277b189b8",
//   "idPersona": "79a5dacf-d567-4f68-ae12-384277b189b8",
//   "urlActa": "/img/acta1",
// }

module.exports = {
  async addDeceased(req, res) {
    const { idCliente = '', idPersona = '', urlActa = '' } = req.body;
    let data = {};

    try {
      await sequelize.transaction(async (transaction) => {
        const clientExit = await Cliente.findOne({
          where: { idCliente },
        });

        if (!clientExit) {
          return res.status(409).send({ message: 'Este Cliente no existe' });
        }

        const personExit = await Persona.findOne({
          where: { idPersona },
        });

        if (!personExit) {
          return res.status(409).send({ message: 'Este Persona no existe' });
        }

        data = await Difunto.create({
          idPersona,
          idCliente,
          actaDef: urlActa,
        });

        await Persona.update(
          {
            status: false,
          },
          { where: { idPersona } }
        );

        return res.status(201).send({ data });
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getDeceased(req, res) {
    try {
      const deceased = await Difunto.findAll({
        include: [personDeceasedParams, clientDeceasedParams],
      });

      return res.status(200).send({ data: deceased });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getDeceasedByIdentidad(req, res) {
    const { serie } = req.params;
    let getPerson;

    try {
      const { idPersona } = await Pariente.findOne({
        include: [
          {
            model: Identidad,
            as: 'ParienteIdentidad',
            where: {
              serie,
            },
          },
        ],
      });

      getPerson = idPersona;
      if (!getPerson) {
        const { idPersona } = await Cliente.findOne({
          include: [
            {
              model: Identidad,
              as: 'ClienteIdentidad',
              where: {
                serie,
              },
            },
          ],
        });
        getPerson = idPersona;
      }

      if (!getPerson) {
        return res.status(409).send({ message: 'Este Difunto no existe' });
      }

      const deceased = await Difunto.findAll({
        include: [personDeceasedParams, clientDeceasedParams],
        where: {
          idPersona: getPerson,
        },
      });

      return res.status(200).send({ data: deceased });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getDeceasedByClient(req, res) {
    const { idCliente } = req.params;

    try {
      const deceased = await Difunto.findAll({
        include: [personDeceasedParams, clientDeceasedParams],
        where: {
          idCliente,
        },
      });

      return res.status(200).send({ data: deceased });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  // {
  //   "idCliente": "79a5dacf-d567-4f68-ae12-384277b189b8",
  //   "idDifunto": "79a5dacf-d567-4f68-ae12-384277b189b8",
  //   "idPersona": "79a5dacf-d567-4f68-ae12-384277b189b8",
  //   "urlActa": "/img/acta1",
  //   "status": "true",
  // }
  async updateDeceased(req, res) {
    const {
      idDifunto = '',
      idCliente = '',
      idPersona = '',
      urlActa = '',
      status = false,
    } = req.body;
    let data = {};

    try {
      const getDeceased = await Difunto.findOne({
        where: { idDifunto },
      });

      if (!getDeceased) {
        return res.status(409).send({ message: 'Este Difunto no existe' });
      }

      data = await Difunto.update(
        {
          idPersona,
          idCliente,
          actaDef: urlActa,
        },
        { where: { idDifunto } }
      );

      await Persona.update(
        {
          status,
        },
        { where: { idPersona } }
      );

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
