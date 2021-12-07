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
  Sexo = require('./Sexo'),
  Identidad = require('./Identidad'),
  TipoIdentidad = require('./TipoIdentidad'),
  Empleado = require('./Empleado'),
  Cargo = require('./Cargo'),
  Cliente = require('./Cliente'),
  Pariente = require('./Pariente'),
  Difunto = require('./Difunto'),
  TipoPlan = require('./TipoPlan'),
  Suscripcion = require('./Suscripcion'),
  Mensualidad = require('./Mensualidad'),
  Producto = require('./Producto'),
  ImagenProducto = require('./ImagenProducto'),
  ProductoLog = require('./ProductoLog'),
  TipoProducto = require('./TipoProducto'),
  Categoria = require('./Categoria'),
  Almacen = require('./Almacen'),
  Factura = require('./Factura'),
  DetalleFactura = require('./DetalleFactura'),
  Compra = require('./Compra'),
  DetalleCompra = require('./DetalleCompra'),
  Itebis = require('./Itebis'),
  TipoPago = require('./TipoPago'),
  Transporte = require('./Transporte'),
  Vehiculo = require('./Vehiculo'),
  Marca = require('./Marca'),
  Modelo = require('./Modelo'),
  Suplidor = require('./Suplidor'),
  ArmarPlan = require('./ArmarPlan'),
  UnidadMedida = require('./UnidadMedida'),
  SalidaServicios = require('./SalidaServicios'),
  EntradaServicios = require('./EntradaServicios'),
  HistorialTiempoServicios = require('./HistorialTiempoServicios'),
  HistorialSuscripcion = require('./HistorialSuscripcion'),
  Pedido = require('./Pedido'),
  ConfSuplidor = require('./ConfSuplidor'),
  DetallePedido = require('./DetallePedido');

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

/////////////////////////////P2////////////////////////////

//Empleado
Empleado.belongsToMany(Cargo, {
  as: 'EmpleadoCargo',
  through: 'EmpleadoVSCargo',
});

Cargo.belongsToMany(Empleado, {
  as: 'CargoEmpleado',
  through: 'EmpleadoVSCargo',
});

Empleado.belongsTo(Persona, {
  as: 'EmpleadoPersona',
  foreignKey: 'idPersona',
});

Empleado.belongsTo(Identidad, {
  as: 'EmpleadoIdentidad',
  foreignKey: 'idIdentidad',
});

Usuario.hasMany(HistorialSuscripcion, {
  as: 'UsuarioHistorialSuscripcion',
  foreignKey: 'idUsuario',
});

//Pariente
Pariente.belongsToMany(Identidad, {
  as: 'ParienteIdentidad',
  through: 'ParienteVSIdentidad',
});

Identidad.belongsToMany(Pariente, {
  as: 'IdentidadPariente',
  through: 'ParienteVSIdentidad',
});

Pariente.belongsTo(Persona, {
  as: 'ParientePersona',
  foreignKey: 'idPersona',
});

Pariente.belongsTo(Cliente, {
  as: 'ParienteCliente',
  foreignKey: 'idCliente',
});

//Cliente
Cliente.belongsTo(Persona, {
  as: 'ClientePersona',
  foreignKey: 'idPersona',
});

Cliente.belongsTo(Identidad, {
  as: 'ClienteIdentidad',
  foreignKey: 'idIdentidad',
});

Cliente.hasMany(HistorialSuscripcion, {
  as: 'ClienteHistorialSuscripcion',
  foreignKey: 'idCliente',
});

//Suplidor
Suplidor.belongsTo(Persona, {
  as: 'SuplidorPersona',
  foreignKey: 'idPersona',
});

Suplidor.belongsTo(Identidad, {
  as: 'SuplidorIdentidad',
  foreignKey: 'idIdentidad',
});

//Difunto
Difunto.belongsTo(Persona, {
  as: 'DifuntoPersona',
  foreignKey: 'idPersona',
});

Difunto.belongsTo(Cliente, {
  as: 'DifuntoCliente',
  foreignKey: 'idCliente',
});

//TipoPlan
TipoPlan.hasMany(HistorialSuscripcion, {
  as: 'PlanHistorialSuscripcion',
  foreignKey: 'idTipoPlan',
});

//Suscripcion
Suscripcion.belongsTo(Cliente, {
  as: 'SuscripcionCliente',
  foreignKey: 'idCliente',
});

Suscripcion.belongsTo(TipoPlan, {
  as: 'SuscripcionTipoPlan',
  foreignKey: 'idTipoPlan',
});

Suscripcion.hasMany(HistorialSuscripcion, {
  as: 'SuscripcionHistorialSuscripcion',
  foreignKey: 'idSuscripcion',
});

//Mensualidad
Mensualidad.belongsTo(Suscripcion, {
  as: 'MensualidadSuscripcion',
  foreignKey: 'idSuscripcion',
});

Mensualidad.belongsTo(TipoPago, {
  as: 'MensualidadTipoPago',
  foreignKey: 'idTipoPago',
});

//ArmarPlan
ArmarPlan.belongsTo(UnidadMedida, {
  as: 'ArmarUnidadMedida',
  foreignKey: 'idUnidadMedida',
});

ArmarPlan.belongsTo(TipoPlan, {
  as: 'ArmarTipoPlan',
  foreignKey: 'idTipoPlan',
});

ArmarPlan.belongsTo(Producto, {
  as: 'ArmarProducto',
  foreignKey: 'idProducto',
});

//Producto
Producto.belongsToMany(Almacen, {
  as: 'ProductoAmacen',
  through: 'ProductoVSAlmacen',
});

Almacen.belongsToMany(Producto, {
  as: 'AlmacenProducto',
  through: 'ProductoVSAlmacen',
});

Producto.belongsToMany(Suplidor, {
  as: 'ProductoSuplidor',
  through: 'ProductoVSSuplidor',
});

Suplidor.belongsToMany(Producto, {
  as: 'SuplidorProducto',
  through: 'ProductoVSSuplidor',
});

Producto.belongsTo(TipoProducto, {
  as: 'ProductoTipo',
  foreignKey: 'idTipoProducto',
});

Producto.belongsTo(Categoria, {
  as: 'ProductoCategoria',
  foreignKey: 'idCategoria',
});

//ImagenProducto
ImagenProducto.belongsTo(Producto, {
  as: 'ImagenProducto',
  foreignKey: 'idProducto',
});

//ProductoLog
ProductoLog.belongsTo(Producto, {
  as: 'ProductoLog',
  foreignKey: 'idProducto',
});

//Identidad
Identidad.belongsTo(TipoIdentidad, {
  as: 'TipoIdentidad',
  foreignKey: 'idTipoIdentidad',
});

//Factura
Factura.belongsTo(Cliente, {
  as: 'FacturaCliente',
  foreignKey: 'idCliente',
});

Factura.belongsToMany(TipoPago, {
  as: 'FacturaTipoPago',
  through: 'FacturaVSTipoPago',
});

TipoPago.belongsToMany(Factura, {
  as: 'TipoPagoFactura',
  through: 'FacturaVSTipoPago',
});

Factura.belongsToMany(Difunto, {
  as: 'FacturaDifunto',
  through: 'DifuntoVSFactura',
});

Difunto.belongsToMany(Factura, {
  as: 'DifuntoFactura',
  through: 'DifuntoVSFactura',
});

HistorialTiempoServicios.belongsTo(Factura, {
  as: 'HistorialTiempoServicios',
  foreignKey: 'numFactura',
});

Factura.belongsTo(Itebis, {
  as: 'FacturaItebis',
  foreignKey: 'idItebis',
});

//Compra
Compra.belongsTo(Suplidor, {
  as: 'CompraSuplidor',
  foreignKey: 'idSuplidor',
});

Compra.belongsToMany(TipoPago, {
  as: 'CompraTipoPago',
  through: 'CompraVSTipoPago',
});

TipoPago.belongsToMany(Compra, {
  as: 'TipoPagoCompra',
  through: 'CompraVSTipoPago',
});

//DetalleFactura
Factura.hasMany(DetalleFactura, {
  as: 'FacturaDetalle',
  foreignKey: 'numFactura',
});

DetalleFactura.belongsTo(Producto, {
  as: 'DetalleFacturaProducto',
  foreignKey: 'idProducto',
});

//DetalleCompra

Compra.hasMany(DetalleCompra, {
  as: 'CompraDetalle',
  foreignKey: 'numCompra',
});

DetalleCompra.belongsTo(Producto, {
  as: 'DetalleCompraProducto',
  foreignKey: 'idProducto',
});

//EntradaServicios
EntradaServicios.belongsTo(Factura, {
  as: 'EntradaServiciosFactura',
  foreignKey: 'numFactura',
});

EntradaServicios.belongsTo(Producto, {
  as: 'EntradaServiciosProducto',
  foreignKey: 'idProducto',
});

//SalidaServicios
SalidaServicios.belongsTo(Factura, {
  as: 'SalidaServiciosFactura',
  foreignKey: 'numFactura',
});

SalidaServicios.belongsTo(Producto, {
  as: 'SalidaServiciosProducto',
  foreignKey: 'idProducto',
});

//Transporte
Transporte.belongsTo(Factura, {
  as: 'TransporteFactura',
  foreignKey: 'numFactura',
});

Transporte.belongsTo(Empleado, {
  as: 'TransporteEmpleado',
  foreignKey: 'idEmpleado',
});

Transporte.belongsTo(Vehiculo, {
  as: 'TransporteVehiculo',
  foreignKey: 'idVehiculo',
});

Transporte.belongsTo(Direccion, {
  as: 'TransporteDireccion',
  foreignKey: 'idDireccion',
});

//Vehiculo
Vehiculo.belongsTo(Marca, {
  as: 'VehiculoMarca',
  foreignKey: 'idMarca',
});

Vehiculo.belongsTo(Modelo, {
  as: 'VehiculoModelo',
  foreignKey: 'idModelo',
});

//Pedido
Pedido.belongsTo(Suplidor, {
  as: 'PedidoSuplidor',
  foreignKey: 'idSuplidor',
});

//DetallePedido
Pedido.hasMany(DetallePedido, {
  as: 'PedidoDetalle',
  foreignKey: 'numPedido',
});

DetallePedido.belongsTo(Pedido, {
  as: 'DetallePedidoos',
  foreignKey: 'numPedido',
});

DetallePedido.belongsTo(Producto, {
  as: 'DetallePedidoProducto',
  foreignKey: 'idProducto',
});

Compra.belongsToMany(Pedido, {
  as: 'CompraPedido',
  through: 'CompraVSPedido',
});

Pedido.belongsToMany(Compra, {
  as: 'PedidoCompra',
  through: 'CompraVSPedido',
});

// DetallePedido.sync({
//   logging: console.log,
//   force: true,
// })
// .then(() => console.log('conectado'))
// .catch((error) => {
//   console.error('No se pudo conectar:', error);
// });

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
  Sexo,
  Identidad,
  TipoIdentidad,
  Empleado,
  Cargo,
  Cliente,
  Pariente,
  Difunto,
  TipoPlan,
  Suscripcion,
  Mensualidad,
  Producto,
  ImagenProducto,
  ProductoLog,
  TipoProducto,
  Categoria,
  Almacen,
  Factura,
  DetalleFactura,
  Itebis,
  TipoPago,
  Transporte,
  Vehiculo,
  Marca,
  Modelo,
  Suplidor,
  ArmarPlan,
  UnidadMedida,
  HistorialSuscripcion,
  HistorialTiempoServicios,
  Compra,
  DetalleCompra,
  EntradaServicios,
  SalidaServicios,
  Pedido,
  DetallePedido,
  ConfSuplidor,
};
