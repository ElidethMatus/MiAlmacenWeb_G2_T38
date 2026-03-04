const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'R00tP4ssw0rd',
  database: 'inventario_almacen'
});

pool.getConnection((error, conexion) => {
  if (error) {
    console.log('Error de conexión a la base de datos:', error.message);
    return;
  }
  console.log('Conexión exitosa a MySQL');
  conexion.release();
});

app.get('/api/productos', (req, res) => {

    const sql = `
        SELECT 
            p.Id,
            p.Nombre,
            p.CodigoSKU,
            p.Precio_Compra,
            p.Precio_Venta,
            p.Estado,
            c.Nombre AS Categoria,
            pr.Nombre_Razon AS Proveedor
        FROM Productos p
        LEFT JOIN Categorias c ON p.CategoriaId = c.Id
        LEFT JOIN Proveedores pr ON p.ProveedorId = pr.Id
    `;

    pool.query(sql, (error, results) => {

        if (error) {
            console.log('Error en la consulta SQL');
            return res.status(500).json({ status: 500, message: 'Error en la consulta SQL' });
        }

        return res.status(200).json({ status: 200, message: 'Success', data: results });
    });

});

app.get('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const sql = `
        SELECT 
            p.Id,
            p.Nombre,
            p.CodigoSKU,
            p.Precio_Compra,
            p.Precio_Venta,
            p.Estado,
            c.Nombre AS Categoria,
            pr.Nombre_Razon AS Proveedor
        FROM Productos p
        LEFT JOIN Categorias c ON p.CategoriaId = c.Id
        LEFT JOIN Proveedores pr ON p.ProveedorId = pr.Id
        WHERE p.Id = ?
    `;

    pool.query(sql, [id], (error, results) => {

        if (error) {
            console.log('Error en la consulta SQL');
            return res.status(500).json({ status: 500, message: 'Error en la consulta SQL' });
        }

        if (results.length === 0) {
            return res.status(404).json({ status: 404, message: 'Este producto no fue encontrado' });
        }

        return res.status(200).json({ status: 200, message: 'Success', data: results[0] });
    });

});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});