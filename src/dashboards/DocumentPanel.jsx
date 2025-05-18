// DocumentPanel.jsx
import React, { useState, useRef } from 'react';
import { FaUpload, FaDownload, FaTrash, FaFilePdf } from 'react-icons/fa';

const DocumentPanel = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    setUploadedFiles(prev => [...prev, ...pdfFiles]);
    // Reset the file input value to allow uploading the same file again
    e.target.value = '';
  };

  const handleRemove = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="document-panel">
      <div className="upload-container">
        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf"
          multiple
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button 
          className="upload-button" 
          onClick={triggerFileInput}
        >
          <FaUpload className="button-icon" />
          Upload PDF
        </button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="files-container">
          <h4>Uploaded Files</h4>
          <ul className="file-list">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="file-item">
                <div className="file-info">
                  <FaFilePdf className="pdf-icon" />
                  <span className="file-name">{file.name}</span>
                </div>
                <div className="file-actions">
                  <a
                    href={URL.createObjectURL(file)}
                    download={file.name}
                    className="download-button"
                  >
                    <FaDownload /> Download
                  </a>
                  <button
                    onClick={() => handleRemove(index)}
                    className="remove-button"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        .document-panel {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 24px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .upload-container {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }
        
        .upload-button {
          background-color: #4a6cf7;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background-color 0.2s;
        }
        
        .upload-button:hover {
          background-color: #3a5ce5;
        }
        
        .button-icon {
          margin-right: 8px;
        }
        
        .files-container {
          margin-top: 20px;
        }
        
        .files-container h4 {
          font-size: 18px;
          margin-bottom: 16px;
          color: #333;
          border-bottom: 1px solid #eee;
          padding-bottom: 8px;
        }
        
        .file-list {
          list-style: none;
          padding: 0;
        }
        
        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 6px;
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
        }
        
        .file-info {
          display: flex;
          align-items: center;
        }
        
        .pdf-icon {
          color: #e74c3c;
          font-size: 20px;
          margin-right: 10px;
        }
        
        .file-name {
          font-size: 16px;
          color: #495057;
          word-break: break-all;
        }
        
        .file-actions {
          display: flex;
          gap: 8px;
        }
        
        .download-button {
          display: flex;
          align-items: center;
          gap: 5px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
        }
        
        .download-button:hover {
          background-color: #218838;
        }
        
        .remove-button {
          display: flex;
          align-items: center;
          gap: 5px;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          font-size: 14px;
          cursor: pointer;
        }
        
        .remove-button:hover {
          background-color: #c82333;
        }
        
        @media (max-width: 600px) {
          .file-item {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .file-actions {
            margin-top: 10px;
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default DocumentPanel;