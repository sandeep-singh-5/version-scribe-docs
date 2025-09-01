import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Download, FileText, X } from "lucide-react";

interface FileViewerProps {
  isOpen: boolean;
  onClose: () => void;
  filename: string;
  version: string;
  fileType: string;
  onEdit: () => void;
  onDownload: () => void;
}

const FileViewer = ({ 
  isOpen, 
  onClose, 
  filename, 
  version, 
  fileType, 
  onEdit, 
  onDownload 
}: FileViewerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-card border-border">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-card-foreground">
                {filename}.{fileType}
              </DialogTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                  {version}
                </Badge>
                <span className="text-sm text-muted-foreground">{fileType.toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onEdit}
              className="text-primary-foreground hover:bg-primary/20"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDownload}
              className="text-primary-foreground hover:bg-primary/20"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 bg-background rounded-lg border border-border p-4 overflow-hidden">
          {/* OnlyOffice Integration Placeholder */}
          <div className="h-full flex items-center justify-center bg-gradient-secondary rounded-lg border-2 border-dashed border-border">
            <div className="text-center">
              <FileText className="h-16 w-16 text-primary-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                OnlyOffice Document Viewer
              </h3>
              <p className="text-muted-foreground mb-4">
                This is where the OnlyOffice document viewer would be integrated.
              </p>
              <div className="bg-card p-4 rounded-lg border border-border max-w-md mx-auto">
                <p className="text-sm text-card-foreground">
                  <strong>Document:</strong> {filename}.{fileType}
                </p>
                <p className="text-sm text-card-foreground">
                  <strong>Version:</strong> {version}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Integration with OnlyOffice Document Server would display the actual document content here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileViewer;