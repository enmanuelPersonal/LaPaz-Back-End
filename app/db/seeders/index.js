const { paises } = require('../../api/utils/paises');
const { Pais, TipoTelefono, Permisos } = require('../models/relaciones');

(async function () {
  try {
    Promise.all(
      await Pais.bulkCreate(paises, {
        validate: true,
      }),
      await TipoTelefono.bulkCreate([{ tipo: 'casa' }, { tipo: 'celular' }], {
        validate: true,
      }),
      await Permisos.bulkCreate(
        [
          { permiso: 'venta' },
          { permiso: 'compra' },
          { permiso: 'cliente' },
          { permiso: 'lectura' },
        ],
        {
          validate: true,
        }
      )
    );
  } catch (error) {
    console.error('No es posible crear los Seeders');
  }
})();
