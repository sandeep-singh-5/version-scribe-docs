import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchResult {
  id: string;
  filename: string;
  version: string;
  snippet: string;
  fileType: string;
  relevanceScore: number;
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Search Results ({results.length})
      </h3>
      
      {results.map((result) => (
        <Card 
          key={result.id} 
          className="cursor-pointer transition-all duration-200 hover:shadow-file-card-hover hover:-translate-y-0.5 bg-card border-border shadow-file-card"
          onClick={() => onFileClick(result.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-primary/10 rounded">
                  <FileText className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-card-foreground hover:text-primary-foreground transition-colors">
                    {result.filename}
                  </h4>
                  <p className="text-xs text-muted-foreground">{result.fileType}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {Math.round(result.relevanceScore * 100)}% match
                </Badge>
                <Badge variant="secondary" className="bg-primary/20 text-primary-foreground text-xs">
                  {result.version}
                </Badge>
              </div>
            </div>
            
            <div className="mb-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                ...{result.snippet}...
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary-foreground hover:bg-primary/20"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle download
                }}
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;