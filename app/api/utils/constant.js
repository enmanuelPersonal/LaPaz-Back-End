const {
  Entidad,
  Persona,
  Correo,
  Telefono,
  Direccion,
  Sexo,
  Cliente,
} = require('../../db/models/relaciones');

const personEmployeParams = {
  model: Persona,
  as: 'EmpleadoPersona',

  include: [
    {
      model: Entidad,
      as: 'EntidadPersona',
      where: { status: true },
      include: [
        {
          model: Correo,
          as: 'EntidadCorreo',
          attributes: ['idCorreo', 'correo'],
        },
        {
          model: Telefono,
          as: 'EntidadTelefono',
          attributes: ['idTelefono', 'telefono', 'idTipoTelefono'],
        },
        { model: Direccion, as: 'EntidadDireccion' },
      ],
    },
    { model: Sexo, as: 'SexoPersona' },
  ],
};

const personClientParams = {
  model: Persona,
  as: 'ClientePersona',

  include: [
    {
      model: Entidad,
      as: 'EntidadPersona',
      where: { status: true },
      include: [
        {
          model: Correo,
          as: 'EntidadCorreo',
          attributes: ['idCorreo', 'correo'],
        },
        {
          model: Telefono,
          as: 'EntidadTelefono',
          attributes: ['idTelefono', 'telefono', 'idTipoTelefono'],
        },
        { model: Direccion, as: 'EntidadDireccion' },
      ],
    },
    { model: Sexo, as: 'SexoPersona' },
  ],
};

const personParienteParams = {
  model: Persona,
  as: 'ParientePersona',

  include: [
    {
      model: Entidad,
      as: 'EntidadPersona',
      where: { status: true },
      include: [
        {
          model: Correo,
          as: 'EntidadCorreo',
          attributes: ['idCorreo', 'correo'],
        },
        {
          model: Telefono,
          as: 'EntidadTelefono',
          attributes: ['idTelefono', 'telefono', 'idTipoTelefono'],
        },
        { model: Direccion, as: 'EntidadDireccion' },
      ],
    },
    { model: Sexo, as: 'SexoPersona' },
  ],
};

const clientParienteParams = {
  model: Cliente,
  as: 'ParienteCliente',
  attributes: ['idCliente'],
  include: [
    {
      model: Persona,
      as: 'ClientePersona',
      attributes: ['apellido'],
      include: [
        {
          model: Entidad,
          as: 'EntidadPersona',
          attributes: ['nombre', 'status'],
          where: { status: true },
        },
        { model: Sexo, as: 'SexoPersona', attributes: ['sexo'] },
      ],
    },
  ],
};

module.exports = {
  personParienteParams,
  clientParienteParams,
  personClientParams,
  personEmployeParams,
};
