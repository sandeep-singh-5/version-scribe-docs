import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchResult {
  id: string;
  filename: string;
  version: string;
  snippet: string;
  fullContent: string[];
  fileType: string;
  relevanceScore: number;
  createdBy: string;
  lastModified: string;
  size: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  onFileClick: (id: string) => void;
}

const SearchResults = ({ results, onFileClick }: SearchResultsProps) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No results found. Try different search terms.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Search Results ({results.length})
      </h3>
      
      {results.map((result) => (
        <Card 
          key={result.id} 
          className="cursor-pointer transition-all duration-200 hover:shadow-file-card-hover hover:-translate-y-0.5 bg-card border-border shadow-file-card"
          onClick={() => onFileClick(result.id)}
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
                    {result.filename}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {result.fileType.toUpperCase()}
                    </Badge>
                    <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                      {result.version}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      {Math.round(result.relevanceScore * 100)}% match
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
                  // Handle download
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            
            {/* Content Preview */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-card-foreground mb-2">Content Preview:</h5>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                {result.fullContent.map((line, index) => (
                  <p key={index} className="text-sm text-muted-foreground mb-1 leading-relaxed">
                    {line}
                  </p>
                ))}
                <div className="mt-2 pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground italic">
                    ...{result.snippet}...
                  </p>
                </div>
              </div>
            </div>
            
            {/* Version Details */}
            <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/20 rounded-lg p-3">
              <div className="flex items-center space-x-4">
                <span>
                  <span className="font-medium">Created by:</span> {result.createdBy}
                </span>
                <span>•</span>
                <span>
                  <span className="font-medium">Modified:</span> {result.lastModified}
                </span>
                <span>•</span>
                <span>
                  <span className="font-medium">Size:</span> {result.size}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;