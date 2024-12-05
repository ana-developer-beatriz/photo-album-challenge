import axios from 'axios';

const JSON_PLACEHOLDER_URL = 'https://jsonplaceholder.typicode.com';

export const createAlbumInApi = async (title: string, userId: string) => {
  const response = await axios.post(`${JSON_PLACEHOLDER_URL}/albums`, { title, userId });
  return response.data; 
};

export const createPhotoInApi = async (photo: { title: string, albumId: number, url: string, thumbnailUrl: string }) => {
  try {
    const response = await axios.post('https://jsonplaceholder.typicode.com/photos', photo);
    return response.data; 
  } catch (error) {
    throw new Error('Error to create Photo on the extern API');
  }
};