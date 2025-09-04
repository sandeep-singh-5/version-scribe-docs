import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Eye, Download, History } from "lucide-react";
import EditFileDialog from "./EditFileDialog";

interface FileCardProps {
  name: string;
  version: string;
  lastModified: string;
  fileType: string;
  versionCount?: number;
  onView: () => void;
  onEdit: () => void;
  onDownload: () => void;
  onViewHistory: () => void;
  onFileUpdate?: (fileData: any) => void;
  latestVersion?: {
    content?: string;
    downloadLink: string;
    author: string;
    version: string;
  };
}

const FileCard = ({ 
  name, 
  version, 
  lastModified, 
  fileType, 
  versionCount = 1,
  onView, 
  onEdit, 
  onDownload,
  onViewHistory,
  onFileUpdate,
  latestVersion 
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
          <div className="flex flex-col items-end space-y-1">
            <Badge variant="secondary" className="bg-primary/20 text-primary-foreground hover:bg-primary/30">
              {version}
            </Badge>
            {versionCount > 1 && (
              <span className="text-xs text-muted-foreground">
                {versionCount} versions
              </span>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Last modified: {lastModified}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="text-primary hover:bg-primary/20"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {onFileUpdate ? (
            <EditFileDialog
              fileName={name}
              fileType={fileType}
              versionCount={versionCount}
              onFileUpdate={onFileUpdate}
              latestVersion={latestVersion}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => e.stopPropagation()}
                className="text-primary hover:bg-primary/20"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </EditFileDialog>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="text-primary hover:bg-primary/20"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          {versionCount > 1 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onViewHistory();
              }}
              className="text-primary hover:bg-primary/20"
            >
              <History className="h-4 w-4 mr-1" />
              History
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className="text-primary hover:bg-primary/20"
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