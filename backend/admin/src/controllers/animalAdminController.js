const db = require('../../../src/config/db');
const { encrypt, decrypt } = require('../../../src/utils/crypto');

// Listar todos los animales con información del propietario
async function listAnimals(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT 
        a.id_animal,
        a.nombre_animal,
        a.edad,
        a.id_especie,
        a.id_raza,
        a.id_propietario,
        e.nombre_especie,
        r.nombre_raza,
        CONCAT(p.nombres, ' ', p.apellidos) as propietario_nombre
      FROM animal a
      LEFT JOIN especie e ON a.id_especie = e.id_especie
      LEFT JOIN raza r ON a.id_raza = r.id_raza
      LEFT JOIN propietario p ON a.id_propietario = p.id_propietario
      ORDER BY a.id_animal DESC
    `);
    
    // Descifrar nombres de animales
    const animals = rows.map(animal => ({
      ...animal,
      nombre_animal: decrypt(animal.nombre_animal)
    }));
    
    res.json({ success: true, animals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

// Obtener un animal por ID
async function getAnimal(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT 
        a.id_animal,
        a.nombre_animal,
        a.edad,
        a.id_especie,
        a.id_raza,
        a.id_propietario,
        e.nombre_especie,
        r.nombre_raza,
        CONCAT(p.nombres, ' ', p.apellidos) as propietario_nombre
      FROM animal a
      LEFT JOIN especie e ON a.id_especie = e.id_especie
      LEFT JOIN raza r ON a.id_raza = r.id_raza
      LEFT JOIN propietario p ON a.id_propietario = p.id_propietario
      WHERE a.id_animal = ?
    `, [id]);
    
    if (!rows[0]) {
      return res.status(404).json({ success: false, message: 'Animal no encontrado' });
    }
    
    const animal = {
      ...rows[0],
      nombre_animal: decrypt(rows[0].nombre_animal)
    };
    
    res.json({ success: true, animal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

// Actualizar un animal
async function updateAnimal(req, res) {
  try {
    const { id } = req.params;
    const { nombre_animal, edad, id_especie, id_raza } = req.body;

    // Verificar que el animal existe
    const [exists] = await db.query('SELECT * FROM animal WHERE id_animal = ?', [id]);
    if (!exists[0]) {
      return res.status(404).json({ success: false, message: 'Animal no encontrado' });
    }

    // Cifrar nombre del animal
    const encryptedName = encrypt(nombre_animal);

    await db.query(
      'UPDATE animal SET nombre_animal = ?, edad = ?, id_especie = ?, id_raza = ? WHERE id_animal = ?',
      [encryptedName, edad, id_especie, id_raza, id]
    );

    // Obtener el animal actualizado
    const [rows] = await db.query(`
      SELECT 
        a.id_animal,
        a.nombre_animal,
        a.edad,
        a.id_especie,
        a.id_raza,
        a.id_propietario,
        e.nombre_especie,
        r.nombre_raza,
        CONCAT(p.nombres, ' ', p.apellidos) as propietario_nombre
      FROM animal a
      LEFT JOIN especie e ON a.id_especie = e.id_especie
      LEFT JOIN raza r ON a.id_raza = r.id_raza
      LEFT JOIN propietario p ON a.id_propietario = p.id_propietario
      WHERE a.id_animal = ?
    `, [id]);
    
    const animal = {
      ...rows[0],
      nombre_animal: decrypt(rows[0].nombre_animal)
    };

    res.json({ success: true, animal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

// Eliminar un animal
async function deleteAnimal(req, res) {
  const connection = await db.getConnection();
  try {
    const { id } = req.params;
    await connection.beginTransaction();

    // Eliminar resultados asociados a muestras de este animal
    await connection.query(
      `DELETE r FROM resultado r
       JOIN muestra m ON m.id_muestra = r.id_muestra
       WHERE m.id_animal = ?`,
      [id]
    );

    // Eliminar muestras de este animal
    await connection.query('DELETE FROM muestra WHERE id_animal = ?', [id]);

    // Eliminar relaciones propietario_animal si existieran
    try {
      await connection.query('DELETE FROM propietario_animal WHERE id_animal = ?', [id]);
    } catch (_) {}

    // Eliminar el animal
    const [result] = await connection.query('DELETE FROM animal WHERE id_animal = ?', [id]);
    await connection.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Animal no encontrado' });
    }

    res.json({ success: true, message: 'Animal eliminado exitosamente' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  } finally {
    connection.release();
  }
}

module.exports = { listAnimals, getAnimal, updateAnimal, deleteAnimal };
