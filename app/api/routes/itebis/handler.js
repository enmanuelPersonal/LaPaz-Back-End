const { Itebis } = require('../../../db/models/relaciones');

module.exports = {
  async getAllItebis(req, res) {
    try {
      const data = await Itebis.findAll();

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
