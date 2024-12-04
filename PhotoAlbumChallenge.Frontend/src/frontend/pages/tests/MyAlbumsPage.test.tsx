import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MyAlbumsPage from '../AlbumsPage';
import { BrowserRouter as Router } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

jest.mock('jwt-decode');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn().mockReturnValue({ userId: '123' }),
}));


describe('MyAlbumsPage', () => {
  beforeEach(() => {
    (jwt_decode as jest.Mock).mockReturnValue({ user_id: '123', email: 'test@test.com' });
    Storage.prototype.getItem = jest.fn().mockReturnValue('mocked-token');
  });

  it('deve exibir a mensagem de erro se não houver token', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({}),
    });

    render(
      <Router>
        <MyAlbumsPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Token não encontrado. Faça login novamente.')).toBeInTheDocument();
    });
  });

  it('deve buscar os álbuns corretamente e exibir na tela', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        albums: [
          { id: '1', title: 'Álbum 1' },
          { id: '2', title: 'Álbum 2' },
        ],
      }),
    });

    render(
      <Router>
        <MyAlbumsPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Álbum 1')).toBeInTheDocument();
      expect(screen.getByText('Álbum 2')).toBeInTheDocument();
    });
  });

  it('deve exibir uma mensagem de erro se a busca de álbuns falhar', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({}),
    });

    render(
      <Router>
        <MyAlbumsPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Erro ao buscar álbuns. Tente novamente mais tarde.')).toBeInTheDocument();
    });
  });

  it('deve criar um novo álbum corretamente', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ id: '1', title: 'Novo Álbum' }),
    });

    jest.spyOn(window, 'prompt').mockReturnValueOnce('Novo Álbum');

    render(
      <Router>
        <MyAlbumsPage />
      </Router>
    );

    fireEvent.click(screen.getByText('Criar Álbum'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/album/createAlbum',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            session_token: 'mocked-token',
          }),
          body: JSON.stringify({
            title: 'Novo Álbum',
            userId: '123',
          }),
        })
      );
    });
  });

  it('deve deletar um álbum corretamente', async () => {
     global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({}),
    });

    render(
      <Router>
        <MyAlbumsPage />
      </Router>
    );

   fireEvent.click(screen.getByText('Deletar'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/album/deleteAlbum/1',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            session_token: 'mocked-token',
          }),
        })
      );
    });
  });
});
