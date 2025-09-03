import React from 'react';
import { DocumentEditor } from "@onlyoffice/document-editor-react";

const OnlyOfficeViewer = ({ fileUrl, width = "100%", height = "100%" }) => {

  const getFileExtension = (url) => {
    try {
      const pathname = new URL(url).pathname;
      const ext = pathname.split('.').pop();
      return ext ? ext.toLowerCase() : '';
    } catch {
      const parts = url.split('.');
      return parts.length > 1 ? parts.pop().toLowerCase() : '';
    }
  };

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
        return { fileType: 'pptx', documentType: 'presentation' };
      case 'pdf':
        return { fileType: 'pdf', documentType: 'word' }; // PDFs load in word viewer
      case 'txt':
        return { fileType: 'txt', documentType: 'word' };
      default:
        return { fileType: 'docx', documentType: 'word' };
    }
  };

  const ext = getFileExtension(fileUrl);
  const { fileType, documentType } = getDocumentType(ext);

  const onDocumentReady = () => {
    console.log("OnlyOffice document loaded successfully");
  };

  const onLoadComponentError = (errorCode, errorDescription) => {
    console.error("OnlyOffice load error:", errorCode, errorDescription);
  };

  return (
    <div style={{ width, height }}>
      <DocumentEditor
        id="docEditor"
        documentServerUrl="http://192.168.137.75:8080/"
        config={{
          document: {
            fileType,
            key: `doc-${btoa(unescape(encodeURIComponent(fileUrl)))}`, // safer base64
            title: `Document.${fileType}`,
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
