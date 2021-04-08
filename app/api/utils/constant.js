const { Op } = require('sequelize');
const {
  Entidad,
  Persona,
  Correo,
  Telefono,
  Direccion,
  Sexo,
  Cliente,
  TipoTelefono,
  Identidad,
  TipoIdentidad,
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
          include: [{ model: TipoTelefono, as: 'TipoTele' }],
        },
        { model: Direccion, as: 'EntidadDireccion' },
      ],
    },
    { model: Sexo, as: 'SexoPersona' },
  ],
};

const personUserParams = {
  model: Entidad,
  as: 'EntidadUsuario',
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
      include: [{ model: TipoTelefono, as: 'TipoTele' }],
    },
    { model: Direccion, as: 'EntidadDireccion' },
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
          include: [{ model: TipoTelefono, as: 'TipoTele' }],
        },
        { model: Direccion, as: 'EntidadDireccion' },
      ],
    },
    { model: Sexo, as: 'SexoPersona' },
  ],
};

const personSuplidorParams = {
  model: Persona,
  as: 'SuplidorPersona',

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
          include: [{ model: TipoTelefono, as: 'TipoTele' }],
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
          include: [{ model: TipoTelefono, as: 'TipoTele' }],
        },
        { model: Direccion, as: 'EntidadDireccion' },
      ],
    },
    { model: Sexo, as: 'SexoPersona' },
  ],
};

const personDeceasedParams = {
  model: Persona,
  as: 'DifuntoPersona',
  where: { status: false },
  include: [
    {
      model: Entidad,
      as: 'EntidadPersona',
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
          include: [{ model: TipoTelefono, as: 'TipoTele' }],
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

const clientSuscripcionParams = {
  model: Cliente,
  as: 'SuscripcionCliente',
  attributes: ['idCliente'],
  include: [
    {
      model: Identidad,
      as: 'ClienteIdentidad',
      attributes: ['serie'],
      include: [{ model: TipoIdentidad, as: 'TipoIdentidad' }],
    },
    {
      model: Persona,
      as: 'ClientePersona',
      include: [
        {
          model: Entidad,
          as: 'EntidadPersona',
          // where: { status: true },
        },
        { model: Sexo, as: 'SexoPersona', attributes: ['sexo'] },
      ],
    },
  ],
};

const clientParienteSuscripcionParams = {
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
        },
        { model: Sexo, as: 'SexoPersona', attributes: ['sexo'] },
      ],
    },
  ],
};

const personSuscripcionParienteParams = {
  model: Persona,
  as: 'ParientePersona',

  include: [
    {
      model: Entidad,
      as: 'EntidadPersona',
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
          include: [{ model: TipoTelefono, as: 'TipoTele' }],
        },
        { model: Direccion, as: 'EntidadDireccion' },
      ],
    },
    { model: Sexo, as: 'SexoPersona' },
  ],
};

const clientDeceasedParams = {
  model: Cliente,
  as: 'DifuntoCliente',
  attributes: ['idCliente'],
  include: [
    {
      model: Persona,
      as: 'ClientePersona',
      attributes: ['apellido', 'status'],
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

// Where condition
const personWhereClientParams = (identifier, finder) => {
  // let where = {
  //   status: true,
  // };

  // if (isNaN(Number(finder))) {
  //   where = {
  //     [Op.and]: [{ nombre: { [Op.substring]: identifier } }, { status: true }],
  //   };
  // }

  return {
    model: Persona,
    as: 'ClientePersona',

    include: [
      {
        model: Entidad,
        as: 'EntidadPersona',
        where: {
          status: true,
        },
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
            include: [{ model: TipoTelefono, as: 'TipoTele' }],
          },
          { model: Direccion, as: 'EntidadDireccion' },
        ],
      },
      { model: Sexo, as: 'SexoPersona' },
    ],
    // where,
  };
};

module.exports = {
  personParienteParams,
  clientParienteParams,
  personClientParams,
  personEmployeParams,
  personDeceasedParams,
  clientDeceasedParams,
  clientSuscripcionParams,
  personSuscripcionParienteParams,
  clientParienteSuscripcionParams,
  personWhereClientParams,
  personUserParams,
  personSuplidorParams,
};
