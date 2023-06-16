import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

function MyComponent() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    onDrop: acceptedFiles => {
      setFile(acceptedFiles[0]);
    },
  });

  const handleUpload = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      console.log("file append", file)
      formData.append('excel', file);
      await axios.post(
        "https://infinite-waters-75444-dacdc86dadc2.herokuapp.com/api/file/excelToPDF/api/file/excelToPDF",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  }

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag and drop an Excel file here, or click to select a file</p>
      <button disabled={!file || uploading} onClick={handleUpload}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}


export default MyComponent;
