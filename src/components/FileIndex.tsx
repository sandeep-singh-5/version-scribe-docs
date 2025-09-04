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
  // Safety check to ensure files is always an array
  const safeFiles = Array.isArray(files) ? files : [];

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
    <div className="space-y-6">
      {safeFiles.map((file) => (
        <Card 
          key={`${file.fileName}`}
          className="group bg-card/50 backdrop-blur-sm border-border hover:border-primary/20 shadow-file-card hover:shadow-file-card-hover transition-all duration-300 overflow-hidden"
        >
          <div className="p-6">
            {/* Mobile-first responsive layout */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              
              {/* File Title Section */}
              <div className="flex-1 min-w-0 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{getFileIcon(file.fileName.split('.').pop() || '')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-card-foreground truncate mb-1 group-hover:text-primary transition-colors duration-200">
                        {file.fileName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {file.versions.length} version{file.versions.length !== 1 ? 's' : ''}
                        </Badge>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-xs">Latest: {file.versions[0]?.uploadedOn}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* File Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => onFileView(file.versions[0], file.versions[0].version)}
                    className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Latest
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onFileEdit(file.fileName)}
                    className="border-border hover:bg-muted/50 backdrop-blur-sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewHistory(file.fileName)}
                    className="border-border hover:bg-muted/50 backdrop-blur-sm"
                  >
                    <History className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">History</span>
                  </Button>
                </div>
              </div>

              {/* Versions Section */}
              <div className="flex-1 min-w-0 lg:max-w-md">
                <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                  <h4 className="text-sm font-semibold text-card-foreground mb-3 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Available Versions
                  </h4>

                  {/* Scrollable versions list */}
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {file.versions.map((version, index) => (
                      <div
                        key={version.version + version.uploadedOn}
                        className={`group/version relative rounded-lg border p-3 transition-all duration-200 hover:shadow-sm ${
                          index === 0 
                            ? 'border-primary/30 bg-primary/5 shadow-sm' 
                            : 'border-border/50 bg-card/30 hover:bg-muted/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <Badge
                                variant={index === 0 ? "default" : "secondary"}
                                className={`text-xs ${index === 0 ? "bg-gradient-primary text-primary-foreground" : "bg-muted"}`}
                              >
                                {version.version}
                              </Badge>
                              {index === 0 && (
                                <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/10">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <div className="truncate">
                                <span className="font-medium">{version.author}</span> • {new Date(version.uploadedOn).toLocaleDateString()}
                              </div>
                              <div className="truncate italic">{version.keywords || 'No keywords'}</div>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-1 opacity-60 group-hover/version:opacity-100 transition-opacity duration-200">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onFileView(file.versions[index], version.version)}
                              className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary"
                              title="View this version"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onFileDownload(file.fileName, version.version)}
                              className="h-7 w-7 p-0 hover:bg-success/10 hover:text-success"
                              title="Download this version"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FileIndex;