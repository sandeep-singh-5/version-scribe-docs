import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Eye, Download } from "lucide-react";

interface FileCardProps {
  name: string;
  version: string;
  lastModified: string;
  fileType: string;
  onView: () => void;
  onEdit: () => void;
  onDownload: () => void;
}

const FileCard = ({ 
  name, 
  version, 
  lastModified, 
  fileType, 
  onView, 
  onEdit, 
  onDownload 
}: FileCardProps) => {
  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-file-card-hover hover:-translate-y-1 bg-card border-border shadow-file-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground group-hover:text-primary-foreground transition-colors">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground">{fileType}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/20 text-primary-foreground hover:bg-primary/30">
            {version}
          </Badge>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Last modified: {lastModified}
          </p>
        </div>
        
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="text-primary-foreground hover:bg-primary/20"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-primary-foreground hover:bg-primary/20"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className="text-primary-foreground hover:bg-primary/20"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileCard;