import React, { useState, useEffect } from 'react';

function PdfManager() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/pdfFiles')
      .then(response => response.json())
      .then(data => setPdfFiles(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

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
          alert('File uploaded successfully!');
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
        alert('File deleted successfully!');
      })
      .catch(error => console.error('Error deleting file:', error));
  };

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
                  {file.name}
                  <i className="fas fa-download" onClick={() => handleDownload(file.url, file.name)}></i>
                  <i className="fas fa-trash-alt" onClick={() => handleDelete(file.id)}></i>
                </div>
              ))}
            </div>
            <div className='iframe-container'>
              <iframe
                src={pdfFiles[0].url}
                title={pdfFiles[0].name}
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