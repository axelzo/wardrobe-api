import prisma from '../config/prisma.js';

// @desc    Get all clothing items for a user
// @route   GET /api/clothing
// @access  Private
export const getClothingItems = async (req, res) => {
  console.log('[CLOTHING] Petición para obtener prendas del usuario:', req.user.userId);
  try {
    const clothingItems = await prisma.clothingItem.findMany({
      where: { ownerId: req.user.userId },
    });
    console.log('[CLOTHING] Prendas encontradas:', clothingItems.length);
    res.json(clothingItems);
  } catch (error) {
    console.error('[CLOTHING] Error al obtener prendas:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Create a new clothing item
// @route   POST /api/clothing
// @access  Private
export const createClothingItem = async (req, res) => {
  console.log('[CLOTHING] Petición para crear prenda. Body:', req.body);
  if (req.file) {
    console.log('[CLOTHING] Imagen recibida:', req.file.path);
  }
  const { name, category, color, brand } = req.body;
  const imageUrl = req.file ? req.file.path.replace(/\\/g, "/") : null;

  if (!name || !category || !color) {
    console.log('[CLOTHING] Faltan datos obligatorios.');
    return res.status(400).json({ message: 'Name, category, and color are required' });
  }

  try {
    const newItem = await prisma.clothingItem.create({
      data: {
        name,
        category,
        color,
        brand,
        imageUrl,
        ownerId: req.user.userId,
      },
    });
    console.log('[CLOTHING] Prenda creada:', newItem.id);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('[CLOTHING] Error al crear prenda:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Update a clothing item
// @route   PUT /api/clothing/:id
// @access  Private
export const updateClothingItem = async (req, res) => {
  console.log('[CLOTHING] Petición para actualizar prenda. ID:', req.params.id, 'Body:', req.body);
  if (req.file) {
    console.log('[CLOTHING] Imagen nueva recibida:', req.file.path);
  }
  const { id } = req.params;
  const { name, category, color, brand } = req.body;

  const dataToUpdate = { name, category, color, brand };

  if (req.file) {
    dataToUpdate.imageUrl = req.file.path.replace(/\\/g, "/");
  }


  try {
    const item = await prisma.clothingItem.findUnique({ where: { id: Number(id) } });

    if (!item) {
      return res.status(404).json({ message: 'Clothing item not found' });
    }

    if (item.ownerId !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to update this item' });
    }

    const updatedItem = await prisma.clothingItem.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Delete a clothing item
// @route   DELETE /api/clothing/:id
// @access  Private
export const deleteClothingItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await prisma.clothingItem.findUnique({ where: { id: Number(id) } });

    if (!item) {
      return res.status(404).json({ message: 'Clothing item not found' });
    }

    if (item.ownerId !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to delete this item' });
    }

    await prisma.clothingItem.delete({ where: { id: Number(id) } });

    res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
