/*eslint-disable*/ 
import React, { useState } from 'react';
interface PhotoUploadProps {
  onUpload: (file: File) => void | Promise<void>;
}
const PhotoUpload: React.FC<PhotoUploadProps> = ({ onUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        
      };
      reader.readAsDataURL(file);
      onUpload(file); 
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px' }} />}
    </div>
  );
};

export default PhotoUpload;
