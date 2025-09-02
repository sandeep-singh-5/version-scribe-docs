import React from 'react';
import { DocumentEditor } from "@onlyoffice/document-editor-react";

const OnlyOfficeViewer = ({ fileUrl }) => {
  // Helper to get file extension from URL
  const getFileExtension = (url) => {
    try {
      const pathname = new URL(url).pathname;
      const ext = pathname.split('.').pop().toLowerCase();
      return ext;
    } catch (e) {
      // fallback if URL constructor fails (non-URL string)
      const parts = url.split('.');
      return parts.length > 1 ? parts.pop().toLowerCase() : '';
    }
  };

  // Map file extensions to OnlyOffice types
  const getDocumentType = (ext) => {
    switch (ext) {
      case 'doc':
      case 'docx':
      case 'odt':
      case 'rtf':
        return { fileType: 'docx', documentType: 'word' };

      case 'xls':
      case 'xlsx':
      case 'ods':
        return { fileType: 'xlsx', documentType: 'cell' };

      case 'ppt':
      case 'pptx':
      case 'odp':
        return { fileType: 'pptx', documentType: 'slide' };

      case 'pdf':
        return { fileType: 'pdf', documentType: 'text' };

      case 'txt':
        return { fileType: 'txt', documentType: 'text' };

      default:
        // default fallback
        return { fileType: 'docx', documentType: 'word' };
    }
  };

  const ext = getFileExtension(fileUrl);
  const { fileType, documentType } = getDocumentType(ext);

  const onDocumentReady = () => {
    console.log("Document is loaded");
  };

  const onLoadComponentError = (errorCode, errorDescription) => {
    switch (errorCode) {
      case -1:
      case -2:
      case -3:
        console.error("OnlyOffice load error:", errorDescription);
        break;
      default:
        console.error("Unknown error:", errorDescription);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <DocumentEditor
        id="docEditor"
        documentServerUrl="http://192.168.137.75:8080/" 
        config={{
          document: {
            fileType,
            key: `task-${fileType}-${Date.now()}`,
            title: `Task Document.${fileType}`,
            url: fileUrl,
          },
          documentType,
          editorConfig: {
            mode: "view",
            lang: "en",
            callbackUrl: "http://192.168.137.75:3000/callback",
          },
        }}
        events_onDocumentReady={onDocumentReady}
        onLoadComponentError={onLoadComponentError}
      />
    </div>
  );
};

export default OnlyOfficeViewer;
