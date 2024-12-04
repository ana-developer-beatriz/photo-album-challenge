import { Request, Response } from 'express';
import { createAlbumController } from '../controllers/AlbumController';
import { createAlbum } from '../services/albumService';

jest.mock('../services/albumService');

describe('createAlbumController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it('deve retornar erro 403 se o usuário não for fornecido', async () => {
    req = {
      body: {
        title: 'Álbum de fotos',
      },
    };

    await createAlbumController(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Usuário não autenticado',
    });
  });

  it('deve retornar erro 400 se o título não for fornecido', async () => {
    req = {
      body: {
        user: { _id: '123' },
      },
    };

    await createAlbumController(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Por favor, forneça um título para o álbum',
    });
  });

  it('deve criar um álbum com sucesso e retornar status 201', async () => {
    const mockAlbum = {
      id: '1',
      userId: '123',
      title: 'Álbum de férias',
    };

    (createAlbum as jest.Mock).mockResolvedValue(mockAlbum);

    req = {
      body: {
        title: 'Álbum de férias',
        user: { _id: '123' },
      },
    };

    await createAlbumController(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Álbum criado com sucesso',
      album: mockAlbum,
    });
  });

  it('deve retornar erro 500 se ocorrer um erro ao criar o álbum', async () => {

    (createAlbum as jest.Mock).mockRejectedValue(new Error('Erro ao criar álbum'));

    req = {
      body: {
        title: 'Álbum de férias',
        user: { _id: '123' },
      },
    };

    await createAlbumController(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Erro ao criar álbum',
      error: 'Erro ao criar álbum',
    });
  });
});
