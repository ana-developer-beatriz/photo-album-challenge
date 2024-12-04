import axios from 'axios';

const JSON_PLACEHOLDER_URL = 'https://jsonplaceholder.typicode.com';

export const createAlbumInApi = async (title: string, userId: string) => {
  const response = await axios.post(`${JSON_PLACEHOLDER_URL}/albums`, { title, userId });
  return response.data; 
};
