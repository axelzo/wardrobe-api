
import {
  getClothingItems,
  createClothingItem,
  updateClothingItem,
  deleteClothingItem,
} from '../controllers/clothing.controller.js';
import prisma from '../config/prisma.js';

// Mockeamos el cliente de Prisma
jest.mock('../config/prisma.js', () => ({
  clothingItem: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Clothing Controller', () => {
  let req, res;
  const userId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
      params: {},
      // Simulamos el objeto user que el middleware 'protect' agregaría
      user: { userId },
      // Simulamos el objeto file que multer agregaría
      file: undefined,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('getClothingItems', () => {
    it('should return all clothing items for a user', async () => {
      const items = [{ id: 1, name: 'T-Shirt', ownerId: userId }];
      // Simulamos la respuesta de Prisma
      prisma.clothingItem.findMany.mockResolvedValue(items);

      await getClothingItems(req, res);

      // Verificamos que se llame a findMany con el ID del usuario correcto
      expect(prisma.clothingItem.findMany).toHaveBeenCalledWith({ where: { ownerId: userId } });
      // Verificamos que la respuesta JSON contenga los items
      expect(res.json).toHaveBeenCalledWith(items);
    });
  });

  describe('createClothingItem', () => {
    it('should create a new item successfully', async () => {
      req.body = { name: 'Jeans', category: 'Pants', color: 'Blue' };
      req.file = { path: 'uploads/image.jpg' };
      const newItem = { id: 2, ...req.body, ownerId: userId, imageUrl: 'uploads/image.jpg' };
      prisma.clothingItem.create.mockResolvedValue(newItem);

      await createClothingItem(req, res);

      // Verificamos que se llame a 'create' con los datos correctos
      expect(prisma.clothingItem.create).toHaveBeenCalled();
      // Verificamos que el estado de la respuesta sea 201
      expect(res.status).toHaveBeenCalledWith(201);
      // Verificamos que la respuesta contenga el nuevo item
      expect(res.json).toHaveBeenCalledWith(newItem);
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = { name: 'Incomplete' }; // Faltan category y color

      await createClothingItem(req, res);

      // Verificamos que el estado de la respuesta sea 400
      expect(res.status).toHaveBeenCalledWith(400);
      // Verificamos el mensaje de error
      expect(res.json).toHaveBeenCalledWith({ message: 'Name, category, and color are required' });
    });
  });

  describe('updateClothingItem', () => {
    it('should update an item successfully', async () => {
      req.params.id = '1';
      req.body = { name: 'Updated T-Shirt' };
      const item = { id: 1, ownerId: userId };
      const updatedItem = { ...item, ...req.body };

      prisma.clothingItem.findUnique.mockResolvedValue(item);
      prisma.clothingItem.update.mockResolvedValue(updatedItem);

      await updateClothingItem(req, res);

      // Verificamos que se buscó el item por ID
      expect(prisma.clothingItem.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      // Verificamos que se llamó a la función de actualización
      expect(prisma.clothingItem.update).toHaveBeenCalled();
      // Verificamos que la respuesta contiene el item actualizado
      expect(res.json).toHaveBeenCalledWith(updatedItem);
    });

    it('should return 403 if user is not the owner', async () => {
      req.params.id = '1';
      const item = { id: 1, ownerId: 999 }; // Otro usuario es el dueño

      prisma.clothingItem.findUnique.mockResolvedValue(item);

      await updateClothingItem(req, res);

      // Verificamos que el estado de la respuesta es 403 (Forbidden)
      expect(res.status).toHaveBeenCalledWith(403);
      // Verificamos el mensaje de error
      expect(res.json).toHaveBeenCalledWith({ message: 'User not authorized to update this item' });
    });
  });

  describe('deleteClothingItem', () => {
    it('should delete an item successfully', async () => {
      req.params.id = '1';
      const item = { id: 1, ownerId: userId };

      prisma.clothingItem.findUnique.mockResolvedValue(item);
      prisma.clothingItem.delete.mockResolvedValue({});

      await deleteClothingItem(req, res);

      // Verificamos que se buscó el item por ID
      expect(prisma.clothingItem.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      // Verificamos que se llamó a la función de borrado
      expect(prisma.clothingItem.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      // Verificamos que el estado de la respuesta es 204 (No Content)
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should return 404 if item not found', async () => {
      req.params.id = '99';
      prisma.clothingItem.findUnique.mockResolvedValue(null);

      await deleteClothingItem(req, res);

      // Verificamos que el estado de la respuesta es 404 (Not Found)
      expect(res.status).toHaveBeenCalledWith(404);
      // Verificamos el mensaje de error
      expect(res.json).toHaveBeenCalledWith({ message: 'Clothing item not found' });
    });
  });
});
