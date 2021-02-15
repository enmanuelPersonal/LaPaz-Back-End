const { paises } = require('../../api/utils/paises');
const {
  Pais,
  Region,
  Ciudad,
  Municipio,
  Sector,
  Calle,
  Casa,
  TipoTelefono,
  TipoUsuario,
  Permisos,
} = require('../models/relaciones');

(async function () {
  try {
    Promise.all(
      await Pais.bulkCreate(paises, {
        validate: true,
      }),
      await Region.bulkCreate(
        [
          { descripcion: 'Norte' },
          { descripcion: 'Suroeste' },
          { descripcion: 'Sureste' },
        ],
        {
          validate: true,
        }
      ),
      await Ciudad.bulkCreate(
        [
          { descripcion: 'Santiago' },
          { descripcion: 'La Vega' },
          { descripcion: 'Puerto Plata' },
        ],
        {
          validate: true,
        }
      ),
      await Municipio.bulkCreate(
        [
          { descripcion: 'Puñal' },
          { descripcion: 'Moca' },
          { descripcion: 'Sosua' },
        ],
        {
          validate: true,
        }
      ),
      await Sector.bulkCreate(
        [
          { descripcion: 'Laguna Prieta' },
          { descripcion: 'Matanzas' },
          { descripcion: 'Los Mangos' },
        ],
        {
          validate: true,
        }
      ),
      await Calle.bulkCreate(
        [
          { descripcion: 'Los Estrellas' },
          { descripcion: 'Los Vicentes' },
          { descripcion: 'Los Filpos' },
        ],
        {
          validate: true,
        }
      ),
      await Casa.bulkCreate([{ numero: 1 }, { numero: 2 }, { numero: 3 }], {
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
