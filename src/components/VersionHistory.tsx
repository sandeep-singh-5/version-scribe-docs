import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, Download, Clock, User } from "lucide-react";

interface Version {
  version: string;
  lastModified: string;
  modifiedBy: string;
  size: string;
  changes?: string;
}

interface VersionHistoryProps {
  filename: string;
  versions: Version[];
  onVersionView: (version: string) => void;
  onVersionDownload: (version: string) => void;
}

const VersionHistory = ({ filename, versions, onVersionView, onVersionDownload }: VersionHistoryProps) => {
  const getVersionBadgeVariant = (version: string) => {
    const versionNum = parseFloat(version.replace('v', ''));
    if (versionNum >= 2.0) return "default";
    if (versionNum >= 1.5) return "secondary";
    return "outline";
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Version History - {filename}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {versions.map((version, index) => (
          <div key={version.version}>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <Badge variant={getVersionBadgeVariant(version.version)} className="min-w-[60px] justify-center">
                  {version.version}
                </Badge>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-card-foreground">{version.lastModified}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{version.size}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{version.modifiedBy}</span>
                    {version.changes && (
                      <>
                        <span>•</span>
                        <span>{version.changes}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onVersionView(version.version)}
                  className="text-primary-foreground hover:bg-primary/20"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onVersionDownload(version.version)}
                  className="text-primary-foreground hover:bg-primary/20"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            {index < versions.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default VersionHistory;