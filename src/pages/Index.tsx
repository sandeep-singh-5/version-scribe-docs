import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Grid, List } from "lucide-react";
import FileCard from "@/components/FileCard";
import SearchResults from "@/components/SearchResults";
import CreateFileDialog from "@/components/CreateFileDialog";
import FileViewer from "@/components/FileViewer";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockFiles = [
  {
    id: "1",
    name: "Project Proposal",
    version: "v2.1",
    lastModified: "2024-01-15 14:30",
    fileType: "docx",
  },
  {
    id: "2", 
    name: "Budget Analysis",
    version: "v1.3",
    lastModified: "2024-01-14 09:15",
    fileType: "xlsx",
  },
  {
    id: "3",
    name: "Marketing Strategy",
    version: "v1.0",
    lastModified: "2024-01-13 16:45",
    fileType: "pptx",
  },
  {
    id: "4",
    name: "Technical Documentation",
    version: "v3.0",
    lastModified: "2024-01-12 11:20",
    fileType: "docx",
  },
];

const mockSearchResults = [
  {
    id: "sr1",
    filename: "Project Proposal",
    version: "v2.1",
    snippet: "This document outlines the comprehensive project proposal for the upcoming quarter including budget allocations and timeline",
    fileType: "docx",
    relevanceScore: 0.95,
  },
  {
    id: "sr2",
    filename: "Budget Analysis",
    version: "v1.3", 
    snippet: "Financial projections and cost analysis for the project implementation phase with detailed breakdowns",
    fileType: "xlsx",
    relevanceScore: 0.87,
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [files, setFiles] = useState(mockFiles);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }

    // Simulate API call
    setShowSearchResults(true);
    toast({
      title: "Search Completed",
      description: `Found ${mockSearchResults.length} results for "${searchQuery}"`,
    });
  };

  const handleFileCreate = (filename: string, fileType: string) => {
    const newFile = {
      id: `file-${Date.now()}`,
      name: filename,
      version: "v1.0",
      lastModified: new Date().toLocaleString(),
      fileType,
    };
    setFiles([newFile, ...files]);
  };

  const handleFileView = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileEdit = (fileId: string) => {
    toast({
      title: "Opening Editor",
      description: "OnlyOffice editor would open here for document editing",
    });
  };

  const handleFileDownload = (fileId: string) => {
    toast({
      title: "Download Started",
      description: "File download has been initiated",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">Document Manager</h1>
              <p className="text-muted-foreground mt-1">Manage your file versions with ease</p>
            </div>
            <CreateFileDialog onFileCreate={handleFileCreate} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents, content, or versions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 border-border bg-card"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="border-border hover:bg-muted"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant={!showSearchResults ? "default" : "outline"}
                size="sm"
                onClick={() => setShowSearchResults(false)}
                className={!showSearchResults ? "bg-primary text-primary-foreground" : "border-border hover:bg-muted"}
              >
                All Files ({files.length})
              </Button>
              {showSearchResults && (
                <Button
                  variant="default"
                  size="sm"
                  className="bg-primary text-primary-foreground"
                >
                  Search Results ({mockSearchResults.length})
                </Button>
              )}
            </div>

            {!showSearchResults && (
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-primary text-primary-foreground" : "border-border hover:bg-muted"}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-primary text-primary-foreground" : "border-border hover:bg-muted"}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {showSearchResults ? (
          <SearchResults 
            results={mockSearchResults} 
            onFileClick={handleFileView}
          />
        ) : (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {files.map((file) => (
              <FileCard
                key={file.id}
                name={file.name}
                version={file.version}
                lastModified={file.lastModified}
                fileType={file.fileType}
                onView={() => handleFileView(file.id)}
                onEdit={() => handleFileEdit(file.id)}
                onDownload={() => handleFileDownload(file.id)}
              />
            ))}
          </div>
        )}

        {!showSearchResults && files.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-card rounded-lg border border-border p-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                No Documents Yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first document
              </p>
              <CreateFileDialog onFileCreate={handleFileCreate} />
            </div>
          </div>
        )}
      </main>

      {/* File Viewer Dialog */}
      {selectedFile && (
        <FileViewer
          isOpen={!!selectedFile}
          onClose={() => setSelectedFile(null)}
          filename={selectedFile.name}
          version={selectedFile.version}
          fileType={selectedFile.fileType}
          onEdit={() => handleFileEdit(selectedFile.id)}
          onDownload={() => handleFileDownload(selectedFile.id)}
        />
      )}
    </div>
  );
};

export default Index;