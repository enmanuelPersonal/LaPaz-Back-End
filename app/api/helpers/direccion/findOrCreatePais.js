const { Pais } = require('../../../db/models/relaciones');
// Republica Dominicana
module.exports = {
  async findOrCreatePais({ pais: descripcion }) {
    try {
      const [pais] = await Pais.findOrCreate({
        where: { descripcion },
      });

      return pais.idPais;
    } catch (error) {
      console.log("Error: ", error);
      return false;
    }
  },
};
