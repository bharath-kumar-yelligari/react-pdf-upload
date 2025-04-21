import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function PdfManager() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewFile, setPreviewFile] = useState({});

  useEffect(() => {
    fetch('http://localhost:3001/pdfFiles')
      .then(response => response.json())
      .then(data => {
        setPdfFiles(data)
        setPreviewFile(data[0])
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        setSelectedFile(null);
        handleToast('error', 'File size exceeds 0.5MB. Please upload a smaller file.')
        return;
      }
      if (file && file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        alert('Please upload a valid PDF file.');
      }
    }
  };

  const handlePreview = (file) => {
    setPreviewFile(file)
  }

  const handleUpload = () => {
    if (!selectedFile) {
      alert('No file selected.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const newFile = {
        id: Date.now(),
        name: selectedFile.name,
        url: reader.result, // Base64 encoded file content
      };

      // Save to json-server
      fetch('http://localhost:3001/pdfFiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFile),
      })
        .then(response => response.json())
        .then(data => {
          setPdfFiles([...pdfFiles, data]);
          setSelectedFile(null);
          setPreviewFile(data)
          handleToast('success', 'File uploaded successfully!')
        })
        .catch(error => console.error('Error uploading file:', error));
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleDownload = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/pdfFiles/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setPdfFiles(pdfFiles.filter(file => file.id !== id));
        handleToast('success', 'File deleted successfully!')
        if (id === previewFile.id) {
          setPreviewFile(pdfFiles[0])
        }
      })
      .catch(error => console.error('Error deleting file:', error));
  };

  const handleToast = (type, msg) => {
    let toastOptions = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    };

    (type === "success") ? toast.success(msg, toastOptions) : toast.error(msg, toastOptions);
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>📄 PDF Upload, Download & Delete</h2>

      <div style={{ marginBottom: '20px' }}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button onClick={handleUpload} style={{ marginLeft: '10px' }}>
          Upload
        </button>
      </div>

      {pdfFiles.length > 0 ? (
        <div style={{ marginTop: '20px' }}>
          <h3>Uploaded Files:</h3>
          <div className='pdf-list'>
            <div className='pdf-list-div'>
              {pdfFiles.map((file) => (
                <div className='pdf-list-item' key={file.id} style={{ marginBottom: '10px' }}>
                  <span style={{ color: (previewFile.id === file.id) ? "#2424c1" : "inherit" }} onClick={() => handlePreview(file)}>{file.name}</span>
                  <i className="fas fa-download" style={{ color: "#2a2ab5" }} onClick={() => handleDownload(file.url, file.name)}></i>
                  <i className="fas fa-trash-alt" style={{ color: "#d32a2a" }} onClick={() => handleDelete(file.id)}></i>
                </div>
              ))}
            </div>
            <div className='iframe-container'>
              <iframe
                src={previewFile.url}
                title={previewFile.name}
                width="100%"
                height="200px"
                style={{ border: '1px solid #ccc', marginTop: '10px' }}
              ></iframe>
            </div>
          </div>
        </div>
      ) : (
        <p>No files uploaded yet.</p>
      )}
    </div>
  );
}

export default PdfManager;