import { Request, Response } from 'express';
import  File  from 'multer';

interface S3File extends File {
  location?: string;
}

export const uploadPhotoController = async (req: Request, res: Response): Promise<void> => {
  const file = req.file as unknown as S3File;
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded.' });
    return;
  }

  try {
  
    res.json({
      message: 'File uploaded successfully!',
      fileUrl: file.location, 
    });
  } catch (error) {
     res.status(500).json({ error: 'Error uploading the photo' });
  }
};
