const Animal = require('../models/Animal');

// Crear un nuevo animal
const createAnimal = async (req, res) => {
  try {
    const { nombre_animal, edad, id_raza, id_especie } = req.body;
    const id_propietario = req.user.id;

    // Validar campos requeridos
    if (!nombre_animal || !edad || !id_raza || !id_especie) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Crear el animal usando el modelo
    const id_animal = await Animal.create({
      nombre_animal,
      edad,
      id_raza,
      id_especie,
      id_propietario
    });

    res.status(201).json({
      message: 'Animal registrado exitosamente',
      id_animal
    });

  } catch (error) {
    console.error('Error al crear animal:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener animales del usuario autenticado
const getUserAnimals = async (req, res) => {
  try {
    const id_propietario = req.user.id;
    const animals = await Animal.findByOwner(id_propietario);
    
    res.json(animals);
  } catch (error) {
    console.error('Error al obtener animales:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener un animal específico por ID
const getAnimalById = async (req, res) => {
  try {
    const { id } = req.params;
    const id_propietario = req.user.id;
    
    const animal = await Animal.findById(id);
    
    if (!animal) {
      return res.status(404).json({ message: 'Animal no encontrado' });
    }
    
    // Verificar que el animal pertenece al usuario
    if (animal.id_propietario !== id_propietario) {
      return res.status(403).json({ message: 'No tienes permisos para ver este animal' });
    }
    
    res.json(animal);
  } catch (error) {
    console.error('Error al obtener animal:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener lista simple de animales para dropdowns
const getSimpleAnimalList = async (req, res) => {
  try {
    const id_propietario = req.user.id;
    const animals = await Animal.findSimpleListByOwner(id_propietario);
    
    res.json(animals);
  } catch (error) {
    console.error('Error al obtener lista de animales:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener especies disponibles
const getSpecies = async (req, res) => {
  try {
    const species = await Animal.getSpecies();
    res.json(species);
  } catch (error) {
    console.error('Error al obtener especies:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener razas por especie
const getRacesBySpecies = async (req, res) => {
  try {
    const { id_especie } = req.params;
    const races = await Animal.getRacesBySpecies(id_especie);
    
    res.json(races);
  } catch (error) {
    console.error('Error al obtener razas por especie:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar un animal
const updateAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_animal, edad, id_raza, id_especie } = req.body;
    const id_propietario = req.user.id;

    // Validar campos requeridos
    if (!nombre_animal || !edad || !id_raza || !id_especie) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Verificar que el animal pertenece al usuario
    const animal = await Animal.findById(id);
    if (!animal || animal.id_propietario !== id_propietario) {
      return res.status(404).json({ message: 'Animal no encontrado' });
    }

    // Actualizar el animal
    await Animal.update(id, {
      nombre_animal,
      edad,
      id_raza,
      id_especie
    });

    res.json({ message: 'Animal actualizado exitosamente' });

  } catch (error) {
    console.error('Error al actualizar animal:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar un animal
const deleteAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const id_propietario = req.user.id;

    console.log(`Controlador: Intentando eliminar animal ID: ${id} para propietario: ${id_propietario}`);

    // Verificar que el animal pertenece al usuario
    const animal = await Animal.findById(id);
    if (!animal || animal.id_propietario !== id_propietario) {
      console.log('Controlador: Animal no encontrado o no pertenece al usuario');
      return res.status(404).json({ message: 'Animal no encontrado' });
    }

    console.log('Controlador: Animal encontrado, procediendo con eliminación...');

    // Eliminar el animal
    await Animal.delete(id);

    console.log('Controlador: Eliminación completada exitosamente');
    res.json({ message: 'Animal eliminado exitosamente' });

  } catch (error) {
    console.error('Controlador: Error al eliminar animal:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  createAnimal,
  getUserAnimals,
  getAnimalById,
  getSimpleAnimalList,
  getSpecies,
  getRacesBySpecies,
  updateAnimal,
  deleteAnimal
};
