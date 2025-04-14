import React, { useState } from 'react';

function PdfUploadDownload() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfURL, setPdfURL] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfURL(URL.createObjectURL(file)); // 👈 this is your client-side "URL"
    } else {
      alert('Please upload a valid PDF');
    }
  };

  const handleDownload = () => {
    if (pdfURL) {
      const link = document.createElement('a');
      link.href = pdfURL;
      link.download = pdfFile?.name || 'download.pdf';
      link.click();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>PDF Upload & Download (Client-Side Only)</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {pdfFile && (
        <div style={{ marginTop: '20px' }}>
          <p>✅ Uploaded: {pdfFile.name}</p>
          <button onClick={handleDownload}>Download Again</button>
          <br /><br />
          <iframe
            src={pdfURL || ''}
            title="PDF Preview"
            width="100%"
            height="500px"
            style={{ border: '1px solid #ccc' }}
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default PdfUploadDownload;
