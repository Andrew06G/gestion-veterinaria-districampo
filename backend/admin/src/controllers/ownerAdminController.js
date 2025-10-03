const db = require('../../../src/config/db');
const { encryptObject, decryptObject } = require('../../../src/utils/crypto');

const SENSITIVE_FIELDS = ['correo_electronico', 'telefono', 'direccion'];

async function listOwners(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM propietario ORDER BY id_propietario DESC');
    const owners = rows.map(row => decryptObject(row, SENSITIVE_FIELDS));
    res.json({ success: true, owners });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

async function getOwner(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM propietario WHERE id_propietario = ?', [id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Propietario no encontrado' });
    const owner = decryptObject(rows[0], SENSITIVE_FIELDS);
    res.json({ success: true, owner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

async function updateOwner(req, res) {
  try {
    const { id } = req.params;
    const { nombres, apellidos, correo_electronico, telefono, direccion } = req.body;

    const [exists] = await db.query('SELECT * FROM propietario WHERE id_propietario = ?', [id]);
    if (!exists[0]) return res.status(404).json({ success: false, message: 'Propietario no encontrado' });

    const encrypted = encryptObject({ correo_electronico, telefono, direccion }, SENSITIVE_FIELDS);

    await db.query(
      'UPDATE propietario SET nombres = ?, apellidos = ?, correo_electronico = ?, telefono = ?, direccion = ? WHERE id_propietario = ?',
      [nombres, apellidos, encrypted.correo_electronico, encrypted.telefono, encrypted.direccion, id]
    );

    const [rows] = await db.query('SELECT * FROM propietario WHERE id_propietario = ?', [id]);
    const owner = decryptObject(rows[0], SENSITIVE_FIELDS);
    res.json({ success: true, owner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

async function deleteOwner(req, res) {
  const connection = await db.getConnection();
  try {
    const { id } = req.params;
    await connection.beginTransaction();

    // Eliminar resultados asociados a muestras de animales del propietario
    await connection.query(
      `DELETE r FROM resultado r
       JOIN muestra m ON m.id_muestra = r.id_muestra
       JOIN animal a ON a.id_animal = m.id_animal
       WHERE a.id_propietario = ?`,
      [id]
    );

    // Eliminar muestras de animales del propietario
    await connection.query(
      `DELETE m FROM muestra m
       JOIN animal a ON a.id_animal = m.id_animal
       WHERE a.id_propietario = ?`,
      [id]
    );

    // Eliminar relaciones propietario_animal si existieran
    try {
      await connection.query(
        `DELETE pa FROM propietario_animal pa WHERE pa.id_propietario = ?`,
        [id]
      );
    } catch (_) {}

    // Eliminar animales del propietario
    await connection.query('DELETE FROM animal WHERE id_propietario = ?', [id]);

    // Finalmente eliminar propietario
    const [result] = await connection.query('DELETE FROM propietario WHERE id_propietario = ?', [id]);
    await connection.commit();

    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Propietario no encontrado' });
    res.json({ success: true, message: 'Propietario eliminado' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  } finally {
    connection.release();
  }
}

module.exports = { listOwners, getOwner, updateOwner, deleteOwner };


