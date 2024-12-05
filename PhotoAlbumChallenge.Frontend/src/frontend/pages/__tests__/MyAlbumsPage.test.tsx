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

  it('should display the error message if there is no token', async () => {
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
      expect(screen.getByText('Token not found. Please log in again.')).toBeInTheDocument();
    });
  });

  it('should fetch albums correctly and display them on the screen', async () => {
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

  it('should display an error message if fetching albums fails', async () => {
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
      expect(screen.getByText('Error fetching albums. Please try again later.')).toBeInTheDocument();
    });
  });

  it('should create a new album correctly', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ id: '1', title: 'New Album' }),
    });

    jest.spyOn(window, 'prompt').mockReturnValueOnce('New Album');

    render(
      <Router>
        <MyAlbumsPage />
      </Router>
    );

    fireEvent.click(screen.getByText('Create Album'));

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

  it('should delete an album correctly', async () => {
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

    fireEvent.click(screen.getByText('Delete'));

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
