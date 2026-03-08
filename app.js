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

app.post('/api/productos',(req,res)=>{
    const producto = req.body;
    if(!producto.Nombre || !producto.Descripcion || !producto.CodigoSKU
        || !producto.Precio_Compra || !producto.Precio_Venta || !producto.Stock_Minimo || !producto.Estado || !producto.CategoriaId ||!['ACTIVO', 'INACTIVO'].includes(producto.Estado)){
         return res.status(400).json({status:400,message:'Todos los campos son obligatorios...'});
    }
    
    const sql = 'INSERT INTO Productos (Nombre,Descripcion,CodigoSKU, Precio_Compra,Precio_Venta,Stock_Minimo,Estado,CategoriaId) VALUES(?,?,?,?,?,?,?,?)';

        pool.query(sql,[producto.Nombre ,producto.Descripcion ,producto.CodigoSKU,producto.Precio_Compra ,producto.Precio_Venta ,producto.Stock_Minimo ,producto.Estado,producto.CategoriaId],(error,results)=>{
            if (error) {
                console.log('Existe un error en la consulta SQL');
                res.status(500).json({ status: 500, message: 'Error en la consulta SQL' });
            } else {
                producto.id = results.insertId;
                res.status(200).json({ status: 200, message: 'Success', data: producto });
            }
    });

});

app.put("/api/productos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  const {
    Nombre,
    CodigoSKU,
    Precio_Compra,
    Precio_Venta,
    Estado,
    CategoriaId,
    ProveedorId,
  } = req.body;

  // Validación básica de campos obligatorios
  if (!Nombre || !CodigoSKU || !Precio_Compra || !Precio_Venta || !Estado) {
    return res.status(400).json({
      status: 400,
      message: "Faltan campos obligatorios en el cuerpo de la solicitud",
    });
  }

  const sql = `
    UPDATE Productos
    SET
      Nombre = ?,
      CodigoSKU = ?,
      Precio_Compra = ?,
      Precio_Venta = ?,
      Estado = ?,
      CategoriaId = ?,
      ProveedorId = ?
    WHERE Id = ?
  `;

  const params = [
    Nombre,
    CodigoSKU,
    Precio_Compra,
    Precio_Venta,
    Estado,
    CategoriaId || null,
    ProveedorId || null,
    id,
  ];

  pool.query(sql, params, (error, result) => {
    if (error) {
      console.log("Error en la consulta SQL", error);
      return res
        .status(500)
        .json({ status: 500, message: "Error en la consulta SQL" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Este producto no fue encontrado" });
    }

    return res.status(200).json({
      status: 200,
      message: "Producto actualizado correctamente",
      data: {
        Id: id,
        Nombre,
        CodigoSKU,
        Precio_Compra,
        Precio_Venta,
        Estado,
        CategoriaId,
        ProveedorId,
      },
    });
  });
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});