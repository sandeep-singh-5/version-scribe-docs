import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Download, History } from "lucide-react";
import { FileDataResponse,FileVersionRaw } from "@/types/types";


interface FileIndexProps {
  files: FileDataResponse[];
  onFileView: (fileId: FileVersionRaw, version?: string) => void;
  onFileEdit: (fileId: string, version?: string) => void;
  onFileDownload: (fileId: string, version?: string) => void;
  onViewHistory: (fileId: string) => void;
}


const FileIndex = ({ files, onFileView, onFileEdit, onFileDownload, onViewHistory }: FileIndexProps) => {

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'docx':
        return '📄';
      case 'xlsx':
        return '📊';
      case 'pptx':
        return '📺';
      default:
        return '📁';
    }
  };

  return (
    <div className="space-y-4">
      {files.map((file) => (
        
        <Card key={`${file.fileName}`}
 className="p-6 bg-card border-border">
          <div className="flex items-start justify-between">
            {/* File Title Section */}
            
            <div className="flex-1 min-w-0 pr-8">
              <div className="flex items-center space-x-3 mb-2">
                
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground truncate">
                    {file.fileName}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    
                    <span>•</span>
                    <span>{file.versions.length} version{file.versions.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              
              {/* File Actions */}
              <div className="flex items-center space-x-2 mt-3">
                <Button
                  size="sm"
                  onClick={() => onFileView(file.versions[0], file.versions[0].version)}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Latest
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onFileEdit(file.fileName)}
                  className="border-border hover:bg-muted"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewHistory(file.fileName)}
                  className="border-border hover:bg-muted"
                >
                  <History className="h-3 w-3 mr-1" />
                  History
                </Button>
              </div>
            </div>

            {/* Versions Section */}
            <div className="flex-1 min-w-0">
  <h4 className="text-sm font-medium text-card-foreground mb-3">Available Versions</h4>

  {/* Limit height and make scrollable */}
  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
    {file.versions.map((version, index) => (
      <div
        key={version.version + version.uploadedOn}
        className={`flex items-center justify-between p-3 rounded-lg border transition-all hover:bg-muted/50 ${
          index === 0 ? 'border-primary/30 bg-primary/5' : 'border-border'
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <Badge
              variant={index === 0 ? "default" : "secondary"}
              className={index === 0 ? "bg-primary text-primary-foreground" : ""}
            >
              {version.fileName}
            </Badge>
            <Badge
              variant={index === 0 ? "default" : "secondary"}
              className={index === 0 ? "bg-primary text-primary-foreground" : ""}
            >
              {version.version}
            </Badge>
            {index === 0 && (
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                Current
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            <div>{version.uploadedOn} • {version.author} </div>
            <div className="truncate">{version.keywords}</div>
          </div>
        </div>

        <div className="flex items-center space-x-1 ml-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFileView(file.versions[index], version.version)}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onFileDownload(file.fileName, version.version)}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
    ))}
  </div>
</div>

          </div>
        </Card>
      ))}
    </div>
  );
};

export default FileIndex;