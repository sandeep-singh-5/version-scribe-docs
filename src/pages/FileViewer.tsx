import React from 'react';
import { useParams,useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Edit3 } from 'lucide-react';
import OnlyOfficeViewer from '@/components/OnlyOfficeViewer';


type FileParams = {
  fileName: string;
  keywords: string;
  downloadLink: string;
  uploadedOn: string;
  author: string;
  version: string;
};
const FileViewerPage = () => {
  const navigate = useNavigate();

const { fileName, version } = useParams();
const [searchParams] = useSearchParams();

const keywords = searchParams.get("keywords");
const downloadLink = searchParams.get("downloadLink");
const uploadedOn = searchParams.get("uploadedOn");
const author = searchParams.get("author");

  const handleEdit = () => {
    // You could switch to edit mode or open a different editor
    console.log('Edit mode activated');
  };

  const handleDownload = () => {
    // Handle file download
    console.log('Download file');
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Files
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-card-foreground">
              {fileName}
            </h1>
            <p className="text-sm text-muted-foreground">
              Version {version}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleEdit}
            className="border-border hover:bg-muted"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownload}
            className="border-border hover:bg-muted"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* File Viewer */}
      <div className="flex-1 p-4">
        <div className="h-full border border-border rounded-lg overflow-hidden bg-card">
          <OnlyOfficeViewer fileUrl={downloadLink} />
        </div>
      </div>
    </div>
  );
};

export default FileViewerPage;