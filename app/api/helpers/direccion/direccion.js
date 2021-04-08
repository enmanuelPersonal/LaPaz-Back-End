const { Direccion } = require('../../../db/models/relaciones');
const { findOrCreateCalle } = require('./findOrCreateCalle');
const { findOrCreateCasa } = require('./findOrCreateCasa');
const { findOrCreateCiudad } = require('./findOrCreateCiudad');
const { findOrCreateMunicipio } = require('./findOrCreateMunicipio');
const { findOrCreatePais } = require('./findOrCreatePais');
const { findOrCreateRegion } = require('./findOrCreateRegion');
const { findOrCreateSector } = require('./findOrCreateSector');
// [{"pais": "Republica Dominicana", "region":"Norte", "ciudad": "Santiago", "municipio":"Punal", "sector": "Laguna Prieta", "calle":"Los estrellas", "casa":"16", "referencia": "frente a la banca"}]
module.exports = {
  async createDireccion({ direcciones }) {
    let notError = true;
    const arrayDireccion = [];

    try {
      await Promise.all(
        await direcciones.map(async (direccion) => {
          const {
            pais,
            region,
            ciudad,
            municipio,
            sector,
            calle,
            casa,
            referencia,
          } = direccion;

          const idPais = await findOrCreatePais({ pais });
          const idRegion = await findOrCreateRegion({ region, idPais });
          const idCiudad = await findOrCreateCiudad({ ciudad, idRegion });
          const idMunicipio = await findOrCreateMunicipio({
            municipio,
            idCiudad,
          });
          const idSector = await findOrCreateSector({ sector, idMunicipio });
          const idCalle = await findOrCreateCalle({ calle, idSector });
          const idCasa = await findOrCreateCasa({ casa, referencia, idCalle });

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
  // [{idDireccion:"asdfwerf4er34r", "pais": "Republica Dominicana", "region":"Norte", "ciudad": "Santiago", "municipio":"Punal", "sector": "Laguna Prieta", "calle":"Los estrellas", "casa":"16", "referencia": "frente a la banca"}]
  async updateDireccion({ direcciones }) {
    let notError = true;
    const arrayDireccion = [];

    try {
      await Promise.all(
        await direcciones.map(async (direccion) => {
          const {
            pais,
            region,
            ciudad,
            municipio,
            sector,
            calle,
            casa,
            referencia,
            idDireccion,
          } = direccion;

          const idPais = await findOrCreatePais({ pais });
          const idRegion = await findOrCreateRegion({ region, idPais });
          const idCiudad = await findOrCreateCiudad({ ciudad, idRegion });
          const idMunicipio = await findOrCreateMunicipio({
            municipio,
            idCiudad,
          });
          const idSector = await findOrCreateSector({ sector, idMunicipio });
          const idCalle = await findOrCreateCalle({ calle, idSector });
          const idCasa = await findOrCreateCasa({ casa, referencia, idCalle });

          const newDireccion = await Direccion.update(
            {
              idPais,
              idRegion,
              idCiudad,
              idMunicipio,
              idSector,
              idCalle,
              idCasa,
            },
            { where: { idDireccion } }
          );

          if (newDireccion) {
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
