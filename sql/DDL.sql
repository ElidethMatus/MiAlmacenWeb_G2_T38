CREATE DATABASE Inventario_Almacen;

USE Inventario_Almacen;

--Creando las tablas
CREATE TABLE Categorias (
    Id INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(90) NOT NULL,
    Descripcion VARCHAR(150),
    PRIMARY KEY (Id)
);

CREATE TABLE Proveedores (
    Id INT NOT NULL AUTO_INCREMENT,
    Nombre_Razon VARCHAR(120) NOT NULL,
    Telefono VARCHAR(30),
    Correo VARCHAR(100),
    Direccion_Ciudad VARCHAR(100),
    PRIMARY KEY (Id)
);

CREATE TABLE Productos (
    Id INT NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(120) NOT NULL,
    Descripcion VARCHAR(200),
    CodigoSKU VARCHAR(60) NOT NULL,
    Precio_Compra DECIMAL(10,2) NOT NULL,
    Precio_Venta DECIMAL(10,2) NOT NULL,
    Stock_Minimo INT NOT NULL,
    Estado ENUM('ACTIVO','INACTIVO') NOT NULL,
    CategoriaId INT NOT NULL,
    ProveedorId INT,
    PRIMARY KEY (Id),

    FOREIGN KEY (CategoriaId)
        REFERENCES Categorias(Id),

    FOREIGN KEY (ProveedorId)
        REFERENCES Proveedores(Id)
);

--Insertando la base de datos
INSERT INTO Categorias (Nombre, Descripcion)
VALUES ('Alimentos básicos', 'Productos de la canasta básica hondureña');

INSERT INTO Categorias (Nombre, Descripcion)
VALUES ('Bebidas', 'Bebidas alcohólicas y no alcohólicas');

INSERT INTO Categorias (Nombre, Descripcion)
VALUES ('Limpieza', 'Artículos de aseo del hogar y personal');

INSERT INTO Categorias (Nombre, Descripcion)
VALUES ('Electrónica', 'Dispositivos y accesorios electrónicos');

INSERT INTO Categorias (Nombre, Descripcion)
VALUES ('Papelería', 'Útiles escolares y de oficina');


INSERT INTO Proveedores (Nombre_Razon, Telefono, Correo, Direccion_Ciudad)
VALUES ('Distribuidora La Colonia S.A.', '+504 2234-5678', 'contacto@lacolonia.hn', 'Tegucigalpa');

INSERT INTO Proveedores (Nombre_Razon, Telefono, Correo, Direccion_Ciudad)
VALUES ('Supermercados La Antorcha', '+504 2501-1122', 'ventas@laantorcha.hn', 'San Pedro Sula');

INSERT INTO Proveedores (Nombre_Razon, Telefono, Correo, Direccion_Ciudad)
VALUES ('Alimentos Capiro S. de R.L.', '+504 2239-4455', 'info@capiro.hn', 'Comayagua');

INSERT INTO Proveedores (Nombre_Razon, Telefono, Correo, Direccion_Ciudad)
VALUES ('Lacthosa S.A.', '+504 2276-9000', 'servicio.cliente@lacthosa.hn', 'Tegucigalpa');

INSERT INTO Proveedores (Nombre_Razon, Telefono, Correo, Direccion_Ciudad)
VALUES ('Distribuidora Eléctrica HN', '+504 2556-7788', 'soporte@deh.hn', 'San Pedro Sula');


INSERT INTO Productos
(Nombre, Descripcion, CodigoSKU, Precio_Compra, Precio_Venta, Stock_Minimo, Estado, CategoriaId, ProveedorId)
VALUES
('Arroz blanco 1 kg', 'Arroz blanco marca nacional', 'HN-ALI-ARZ-001', 18.00, 25.00, 15, 'ACTIVO', 1, 1);

INSERT INTO Productos
(Nombre, Descripcion, CodigoSKU, Precio_Compra, Precio_Venta, Stock_Minimo, Estado, CategoriaId, ProveedorId)
VALUES
('Frijol rojo 1 kg', 'Frijol rojo de seda', 'HN-ALI-FRJ-001', 30.00, 40.00, 20, 'ACTIVO', 1, 3);

INSERT INTO Productos
(Nombre, Descripcion, CodigoSKU, Precio_Compra, Precio_Venta, Stock_Minimo, Estado, CategoriaId, ProveedorId)
VALUES
('Agua purificada 600 ml', 'Agua embotellada', 'HN-BEB-AGU-600', 8.00, 13.00, 30, 'ACTIVO', 2, 2);

INSERT INTO Productos
(Nombre, Descripcion, CodigoSKU, Precio_Compra, Precio_Venta, Stock_Minimo, Estado, CategoriaId, ProveedorId)
VALUES
('Detergente en polvo 900 g', 'Detergente para ropa', 'HN-LIM-DET-900', 40.00, 58.00, 10, 'ACTIVO', 3, 2);

INSERT INTO Productos
(Nombre, Descripcion, CodigoSKU, Precio_Compra, Precio_Venta, Stock_Minimo, Estado, CategoriaId, ProveedorId)
VALUES
('Teléfono celular básico', 'Teléfono celular de gama baja', 'HN-TEC-CEL-BSC', 900.00, 1200.00, 3, 'ACTIVO', 4, 5);

INSERT INTO Productos
(Nombre, Descripcion, CodigoSKU, Precio_Compra, Precio_Venta, Stock_Minimo, Estado, CategoriaId, ProveedorId)
VALUES
('Cuaderno universitario', 'Cuaderno 100 hojas rayado', 'HN-PAP-CUA-UNI', 25.00, 38.00, 15, 'ACTIVO', 5, 2);


SELECT * FROM Categorias;

SELECT * FROM Proveedores;

SELECT * FROM Productos;

SELECT 
c.Nombre AS Categoria,
p.Nombre AS Producto,
pr.Nombre_Razon AS Proveedor
FROM Productos p
LEFT JOIN Categorias c ON p.CategoriaId = c.Id
LEFT JOIN Proveedores pr ON p.ProveedorId = pr.Id;