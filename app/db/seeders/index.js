const { paises } = require('../../api/utils/paises');
const {
  Pais,
  TipoTelefono,
  Permisos,
  TipoIdentidad,
  Cargo,
  Itebis,
  Marca,
  Modelo,
  TipoPago,
  TipoPlan,
  UnidadMedida,
  Sexo
} = require('../models/relaciones');

(async function () {
  try {
    Promise.all(
      await Pais.bulkCreate(paises, {
        validate: true,
      }),
      console.log('Seed Pais'),
      await TipoTelefono.bulkCreate([{ tipo: 'casa' }, { tipo: 'celular' }], {
        validate: true,
      }),
      console.log('Seed TipoTelefono'),
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
      ),
      console.log('Seed Permisos'),
      await TipoIdentidad.bulkCreate(
        [{ tipo: 'cedula' }, { tipo: 'pasaporte' }],
        {
          validate: true,
        }
      ),
      console.log('Seed TipoIdentidad'),
      await Cargo.bulkCreate(
        [
          { cargo: 'cajero', salario: 15000.0 },
          { cargo: 'limpiador', salario: 12000.0 },
          { cargo: 'chofer', salario: 15000.0 },
          { cargo: 'pintor', salario: 17000.0 },
        ],
        {
          validate: true,
        }
      ),
      console.log('Seed Cargo'),
      await Itebis.bulkCreate(
        [{ porcentaje: 0.18 }, { porcentaje: 0.12 }, { porcentaje: 0.2 }],
        {
          validate: true,
        }
      ),
      console.log('Seed Itebis'),
      await Marca.bulkCreate(
        [{ marca: 'Honda' }, { marca: 'Mercedes' }, { marca: 'Jeep' }],
        {
          validate: true,
        }
      ),
      console.log('Seed Marca'),
      await Modelo.bulkCreate(
        [{ modelo: 'CRV' }, { modelo: 'Clasico' }, { modelo: 'Cheroqui' }],
        {
          validate: true,
        }
      ),
      console.log('Seed Modelo'),
      await TipoPago.bulkCreate(
        [{ tipo: 'Efectivo' }, { tipo: 'Cheque' }, { tipo: 'Tarjeta' }],
        {
          validate: true,
        }
      ),
      console.log('Seed TipoPago'),
      await TipoPlan.bulkCreate(
        [
          { tipo: 'Basico', monto: 100.0 },
          { tipo: 'Medio', monto: 500.0 },
          { tipo: 'Premiun', monto: 1000.0 },
        ],
        {
          validate: true,
        }
      ),
      console.log('Seed TipoPlan'),
      await UnidadMedida.bulkCreate(
        [
          { descripcion: 'Unidad' },
          { descripcion: 'Libra' },
          { descripcion: 'Gramo' },
        ],
        {
          validate: true,
        }
      ),
      console.log('Seed UnidadMedida'),
      await Sexo.bulkCreate(
        [
          { sexo: 'M' },
          { sexo: 'F' },
          { sexo: 'Otro' },
        ],
        {
          validate: true,
        }
      ),
      console.log('Seed Sexo')
    );
  } catch (error) {
    console.error('No es posible crear los Seeders', error);
  }
})();
