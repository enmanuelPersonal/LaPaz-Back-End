const { Usuario, Entidad } = require("../../../db/models/relaciones");

module.exports = {
  async addUser(req, res) {
    const {
      name,
      lastName,
      idNumber,
      phone,
      password,
      role = ["developer"],
    } = req.body;
    let person;

    try {
      const userExist = await Usuario.findOne({
        where: { user: idNumber },
      });

      person = await Entidad.findOne({
        where: { idNumber },
      });
    
      return res.status(201).send({ person });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
