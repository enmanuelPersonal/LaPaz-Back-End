const {
  Pais,
  Region,
  Ciudad,
  Municipio,
  Sector,
  Calle,
  Casa,
} = require('../../db/models/relaciones');

module.exports = {
  async getNameDireccion({
    idPais,
    idRegion,
    idCiudad,
    idMunicipio,
    idSector,
    idCalle,
    idCasa,
  }) {
    try {
      const { descripcion: paisName } = await Pais.findOne({
        where: {
          idPais,
        },
      });
      const { descripcion: regionName } = await Region.findOne({
        where: {
          idRegion,
        },
      });
      const { descripcion: ciudadName } = await Ciudad.findOne({
        where: {
          idCiudad,
        },
      });
      const { descripcion: municipioName } = await Municipio.findOne({
        where: {
          idMunicipio,
        },
      });
      const { descripcion: sectorName } = await Sector.findOne({
        where: {
          idSector,
        },
      });
      const { descripcion: calleName } = await Calle.findOne({
        where: {
          idCalle,
        },
      });
      const { numero, referencia } = await Casa.findOne({
        where: {
          idCasa,
        },
      });

      return {
        paisName,
        regionName,
        ciudadName,
        municipioName,
        sectorName,
        calleName,
        casa: { numero, referencia },
      };
    } catch (error) {
      return false;
    }
  },
};
