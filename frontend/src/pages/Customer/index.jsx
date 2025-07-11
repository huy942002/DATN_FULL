// FileUploadComponent.jsx
import React, { useState } from 'react';

const FileUploadComponent = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  // Xử lý khi chọn files
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
    
    const newPreviews = newFiles.map(file => ({
      url: URL.createObjectURL(file),
      file: file
    }));
    setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  // Xử lý xóa ảnh
  const handleRemoveImage = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setPreviewImages(prevPreviews => {
      URL.revokeObjectURL(prevPreviews[index].url);
      return prevPreviews.filter((_, i) => i !== index);
    });
  };

  // Xử lý submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Upload thành công!');
        previewImages.forEach(preview => URL.revokeObjectURL(preview.url));
        setSelectedFiles([]);
        setPreviewImages([]);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Upload thất bại!');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Chọn ảnh để upload
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </label>
          <p className="text-xs text-gray-500">
            Chọn nhiều ảnh cùng lúc hoặc thêm từng ảnh
          </p>
        </div>
        
        <button
          type="submit"
          disabled={selectedFiles.length === 0}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${selectedFiles.length === 0 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          Upload
        </button>
      </form>

      {/* Hiển thị preview ảnh */}
      {previewImages.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previewImages.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview.url}
                alt={`Preview ${index}`}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 
                  rounded-full flex items-center justify-center opacity-75 
                  hover:opacity-100 transition-opacity duration-200"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;