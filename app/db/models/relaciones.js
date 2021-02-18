const Pais = require('./Pais'),
  Region = require('./Region'),
  Ciudad = require('./Ciudad'),
  Municipio = require('./Municipio'),
  Sector = require('./Sector'),
  Calle = require('./Calle'),
  Casa = require('./Casa'),
  Correo = require('./Correo'),
  Entidad = require('./Entidad'),
  Permisos = require('./Permisos'),
  Telefono = require('./Telefono'),
  TipoTelefono = require('./TipoTelefono'),
  TipoUsuario = require('./TipoUsuario'),
  Direccion = require('./Direccion'),
  Usuario = require('./Usuario'),
  Persona = require('./Persona'),
  Sexo = require('./Sexo');

// Calle
Calle.hasMany(Casa, {
  as: 'CasaSector',
  foreignKey: 'idCalle',
});

Calle.hasMany(Direccion, {
  as: 'DireccionCalle',
  foreignKey: 'idCalle',
});

// Casa
Casa.hasMany(Direccion, {
  as: 'DireccionCasa',
  foreignKey: 'idCasa',
});

// Ciudad
Ciudad.hasMany(Municipio, {
  as: 'MunicipioCiudad',
  foreignKey: 'idCiudad',
});

Ciudad.hasMany(Direccion, {
  as: 'DireccionCiudad',
  foreignKey: 'idCiudad',
});

// Entidad
Entidad.hasMany(Correo, {
  as: 'EntidadCorreo',
  foreignKey: 'idEntidad',
});

Entidad.hasMany(Telefono, {
  as: 'EntidadTelefono',
  foreignKey: 'idEntidad',
});

Usuario.belongsTo(Entidad, {
  as: 'EntidadUsuario',
  foreignKey: 'idEntidad',
});

Entidad.belongsToMany(Direccion, {
  as: 'EntidadDireccion',
  through: 'DireccionVSEntidad',
});

Direccion.belongsToMany(Entidad, {
  as: 'DireccionEntidad',
  through: 'DireccionVSEntidad',
});

// Persona
Persona.belongsTo(Entidad, {
  as: 'EntidadPersona',
  foreignKey: 'idEntidad',
});

Persona.belongsTo(Sexo, {
  as: 'SexoPersona',
  foreignKey: 'idSexo',
});

// Municipio
Municipio.hasMany(Sector, {
  as: 'SectorMunicipio',
  foreignKey: 'idMunicipio',
});

Municipio.hasMany(Direccion, {
  as: 'DireccionMunicipio',
  foreignKey: 'idMunicipio',
});

//Pais
Pais.hasMany(Region, {
  as: 'RegionPais',
  foreignKey: 'idPais',
});

Pais.hasMany(Direccion, {
  as: 'DireccionPais',
  foreignKey: 'idPais',
});

//Region
Region.hasMany(Ciudad, {
  as: 'CiudadRegion',
  foreignKey: 'idRegion',
});

Region.hasMany(Direccion, {
  as: 'DireccionRegion',
  foreignKey: 'idRegion',
});

//Sector
Sector.hasMany(Calle, {
  as: 'CalleSector',
  foreignKey: 'idSector',
});

Sector.hasMany(Direccion, {
  as: 'DireccionSector',
  foreignKey: 'idSector',
});

//Telefono
Telefono.belongsTo(TipoTelefono, {
  as: 'TipoTele',
  foreignKey: 'idTipoTelefono',
});

//TipoUsuario
TipoUsuario.belongsToMany(Permisos, {
  as: 'TipoUsuarioPermisos',
  through: 'TipoUsuarioVSPermisos',
});

Permisos.belongsToMany(TipoUsuario, {
  as: 'PermisosTipoUsuario',
  through: 'TipoUsuarioVSPermisos',
});

Usuario.belongsTo(TipoUsuario, {
  as: 'TipoUsuario',
  foreignKey: 'idTipoUsuario',
});

module.exports = {
  Pais,
  Region,
  Ciudad,
  Municipio,
  Sector,
  Calle,
  Casa,
  Correo,
  Entidad,
  Permisos,
  Telefono,
  TipoTelefono,
  TipoUsuario,
  Usuario,
  Direccion,
  Persona,
  Sexo
};
