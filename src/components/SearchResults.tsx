import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileData {
  fileName: string;
  keywords: string;
  downloadLink: string;
  uploadedOn: string;
  author: string;
  version: string;
}

interface SearchResult {
  indexedAt: string;
  fileData: FileData;
  content: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  onFileClick: (fileData: FileData, version: string) => void;
  searchQuery: string;
}

const SearchResults = ({ results, onFileClick ,searchQuery}: SearchResultsProps) => {
  console.log("SearchResults component rendered with results:", results);
  
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No results found. Try different search terms.
        </p>
      </div>
    );
  }

  const getFileType = (filename: string) => {
    const ext = filename.split(".").pop()?.toUpperCase() || "UNKNOWN";
    return ext;
  };

  const getSnippet = (content: string) => {
    return content.length > 200
      ? content.substring(0, 200) + "..."
      : content;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Search Results ({results.length})
      </h3>

      {results.map((result, index) => (
        <Card
          key={index}
          className="cursor-pointer transition-all duration-200 hover:shadow-file-card-hover hover:-translate-y-0.5 bg-card border-border shadow-file-card"
          onClick={() => onFileClick(result.fileData, result.fileData.version)}
        >
          <CardContent className="p-6">
            {/* File Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-card-foreground hover:text-primary transition-colors">
                    {result.fileData.fileName}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {getFileType(result.fileData.fileName)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/30 text-primary"
                    >
                      Indexed: {new Date(result.indexedAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(result.fileData.downloadLink, "_blank");
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            {/* Content Preview */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-card-foreground mb-2">
                Content Preview:
              </h5>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground mb-1 leading-relaxed">
                  {getSnippet(result.content)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;
