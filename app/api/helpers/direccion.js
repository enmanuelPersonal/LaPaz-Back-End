const { Direccion } = require('../../db/models/relaciones');
// [{"idPais": "12wdfe", "idRegion":"121qwqwqw121", "idCiudad": "12wdfe", "idMunicipio":"121qwqwqw121", "idSector": "12wdfe", "idCalle":"121qwqwqw121", "idCasa":"121qwqwqw121"}]
module.exports = {
  async createDireccion(direcciones) {
    let notError = true;
    const arrayDireccion = [];

    try {
      await Promise.all(
        await direcciones.map(async (direccion) => {
          const {
            idPais,
            idRegion,
            idCiudad,
            idMunicipio,
            idSector,
            idCalle,
            idCasa,
          } = direccion;

          const newDireccion = await Direccion.create({
            idPais,
            idRegion,
            idCiudad,
            idMunicipio,
            idSector,
            idCalle,
            idCasa,
          });

          if (newDireccion) {
            const { idDireccion } = newDireccion;
            arrayDireccion.push(idDireccion);
          } else {
            notError = false;
          }
        })
      );

      return notError && arrayDireccion;
    } catch (error) {
      return false;
    }
  },
};
