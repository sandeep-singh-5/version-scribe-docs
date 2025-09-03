import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Filter, Grid, List } from "lucide-react";
import FileIndex from "@/components/FileIndex";
import SearchResults from "@/components/SearchResults";
import CreateFileDialog from "@/components/CreateFileDialog";
import VersionHistory from "@/components/VersionHistory";
import { useToast } from "@/hooks/use-toast";
import { FileDataResponse, FileVersionRaw } from "@/types/types";
import { FileData } from "@/components/CreateFileDialog";
import FileServices from "@/services/files/files";


// const mockFileGroups = [
//   {
//     id: "1",
//     name: "Project Proposal",
//     currentVersion: "v2.1",
//     lastModified: "2024-01-15 14:30",
//     fileType: "docx",
//     versionCount: 3,
//     versions: [
//       { version: "v2.1", lastModified: "2024-01-15 14:30", modifiedBy: "John Doe", size: "2.4 MB", changes: "Updated budget section" },
//       { version: "v2.0", lastModified: "2024-01-12 10:15", modifiedBy: "Jane Smith", size: "2.3 MB", changes: "Major revision with new timeline" },
//       { version: "v1.0", lastModified: "2024-01-08 16:20", modifiedBy: "John Doe", size: "1.8 MB", changes: "Initial version" },
//     ]
//   },
//   {
//     id: "2", 
//     name: "Budget Analysis",
//     currentVersion: "v1.3",
//     lastModified: "2024-01-14 09:15",
//     fileType: "xlsx",
//     versionCount: 4,
//     versions: [
//       { version: "v1.3", lastModified: "2024-01-14 09:15", modifiedBy: "Alice Johnson", size: "1.2 MB", changes: "Q4 projections updated" },
//       { version: "v1.2", lastModified: "2024-01-11 14:30", modifiedBy: "Bob Wilson", size: "1.1 MB", changes: "Fixed calculation errors" },
//       { version: "v1.1", lastModified: "2024-01-09 11:45", modifiedBy: "Alice Johnson", size: "1.0 MB", changes: "Added quarterly breakdown" },
//       { version: "v1.0", lastModified: "2024-01-05 13:20", modifiedBy: "Alice Johnson", size: "950 KB", changes: "Initial budget analysis" },
//     ]
//   },
//   {
//     id: "3",
//     name: "Marketing Strategy",
//     currentVersion: "v1.0",
//     lastModified: "2024-01-13 16:45",
//     fileType: "pptx",
//     versionCount: 1,
//     versions: [
//       { version: "v1.0", lastModified: "2024-01-13 16:45", modifiedBy: "Sarah Connor", size: "5.2 MB", changes: "Initial presentation" },
//     ]
//   },
//   {
//     id: "4",
//     name: "Technical Documentation",
//     currentVersion: "v3.0",
//     lastModified: "2024-01-12 11:20",
//     fileType: "docx",
//     versionCount: 5,
//     versions: [
//       { version: "v3.0", lastModified: "2024-01-12 11:20", modifiedBy: "Mike Chen", size: "3.8 MB", changes: "Complete API documentation rewrite" },
//       { version: "v2.2", lastModified: "2024-01-10 15:30", modifiedBy: "Mike Chen", size: "3.2 MB", changes: "Added new endpoints" },
//       { version: "v2.1", lastModified: "2024-01-08 09:45", modifiedBy: "Lisa Park", size: "3.0 MB", changes: "Security updates" },
//       { version: "v2.0", lastModified: "2024-01-05 14:10", modifiedBy: "Mike Chen", size: "2.8 MB", changes: "Major restructure" },
//       { version: "v1.0", lastModified: "2024-01-01 10:00", modifiedBy: "Mike Chen", size: "2.1 MB", changes: "Initial documentation" },
//     ]
//   },
// ];

const mockSearchResults = [
  {
    id: "sr1",
    fileName: "Project Proposal",
    version: "v2.1",
    snippet: "quarterly budget allocations and comprehensive implementation timeline",
    fullContent: [
      "Executive Summary: This document outlines the comprehensive project proposal for Q2 2024.",
      "The project aims to enhance our document management system with advanced version control.",
      "Key objectives include implementing OnlyOffice integration and improving user experience.",
      "Budget allocation: $150,000 distributed across development, testing, and deployment phases."
    ],
    fileType: "docx",
    relevanceScore: 0.95,
    createdBy: "John Doe",
    lastModified: "2024-01-15 14:30",
    size: "2.4 MB",
  },
  {
    id: "sr2",
    fileName: "Budget Analysis",
    version: "v1.3", 
    snippet: "Q4 financial projections and detailed cost analysis for implementation phase",
    fullContent: [
      "Q4 Financial Analysis Report: Comprehensive review of project expenditures and forecasts.",
      "Total project cost estimate: $285,000 including infrastructure and personnel costs.",
      "ROI projection shows 150% return within 18 months of full implementation.",
      "Risk assessment indicates low financial risk with high confidence in timeline adherence."
    ],
    fileType: "xlsx",
    relevanceScore: 0.87,
    createdBy: "Alice Johnson",
    lastModified: "2024-01-14 09:15",
    size: "1.2 MB",
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFileHistory, setSelectedFileHistory] = useState<FileDataResponse | null>(null);
  const [files, setFiles] = useState<FileDataResponse[]>([]); 
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await FileServices.GetAllFiles(); 
        console.log(res);
        
        // Ensure res is an array before setting files
        setFiles(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Error fetching files:", err);
        setError("Failed to load files. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);
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

  const handleFileCreate = (fileData: FileData) => {
    const newFile = {
      fileName: fileData.fileName,
      versions: [
        {
          fileName: fileData.fileName,
          keywords: fileData.keywords,
          downloadLink: fileData.downloadLink,
          uploadedOn: fileData.uploadedOn,
          author: fileData.author,
          version: fileData.version,
          remark: fileData.remark
        }
      ]
    };
    setFiles([newFile, ...files]);
  };
const handleFileView = (fileData: FileVersionRaw, version?: string) => {
 console.log(".........................>>>>>>>>>>>>>>>",fileData);
 
console.log("=====================>",fileData);

  if (!fileData) {
    toast({
      title: "File Not Found",
      description: `No file found for ${fileData.fileName}`,
      variant: "destructive",
    });
    return;
  }

  const viewVersion = version;

  // Validate that this version exists in the file's versions
  const matchingVersion = fileData.version;
  if (!matchingVersion) {
    toast({
      title: "Version Not Found",
      description: `Version ${viewVersion} is not available for ${fileData.fileName}`,
      variant: "destructive",
    });
    return;
  }
// Suppose you have fileId and version values
const routeUrl = `/file/${fileData.fileName}/${fileData.version}?keywords=${encodeURIComponent(fileData.keywords)}&downloadLink=${encodeURIComponent(fileData.downloadLink)}&uploadedOn=${encodeURIComponent(fileData.uploadedOn)}&author=${encodeURIComponent(fileData.author)}`;

window.open(routeUrl, "_blank");


// Open in new tab/window
window.open(routeUrl, "_blank");


  toast({
    title: "File Opened",
    description: `Opening ${fileData.fileName} (version ${viewVersion}) in a new tab.`,
  });
};

const handleFileEdit = (fileName: string, version?: string) => {
  const fileIndex = files.findIndex(f => f.fileName === fileName);
  if (fileIndex === -1) {
    toast({
      title: "File Not Found",
      description: `No file found for ${fileName}`,
      variant: "destructive",
    });
    return;
  }

  const file = files[fileIndex];
  const currentVersion = version || file.versions[0]?.version || "v1.0";

  // Validate version format vX.Y
  const match = currentVersion.match(/^v(\d+)\.(\d+)$/);
  if (!match) {
    toast({
      title: "Invalid Version Format",
      description: `Cannot edit file with invalid version format: ${currentVersion}`,
      variant: "destructive",
    });
    return;
  }

  const major = parseInt(match[1], 10);
  const minor = parseInt(match[2], 10);
  const newVersion = minor >= 9 ? `v${major + 1}.0` : `v${major}.${minor + 1}`;

  // Open in edit mode
  window.open(`/file/${fileName}/${currentVersion}?mode=edit`, "_blank");

  // Add placeholder for new version (local UI only until saved)
  const newVersionEntry: FileVersionRaw = {
    fileName: fileName,
    keywords: file.versions[0]?.keywords || "",
    downloadLink: "#", // Will be set once saved
    uploadedOn: new Date().toISOString(),
    author: "You",
    version: newVersion,
  };

  const updatedFile = {
    ...file,
    versions: [newVersionEntry, ...file.versions],
  };

  const updatedFiles = [...files];
  updatedFiles[fileIndex] = updatedFile;
  setFiles(updatedFiles);

  toast({
    title: "File Opened for Editing",
    description: `Opening ${fileName} in new tab. New version ${newVersion} will be created on save.`,
  });
};
const handleFileDownload = (fileName: string, version?: string) => {
  const file = files.find(f => f.fileName === fileName);
  if (!file) {
    toast({
      title: "File Not Found",
      description: `No file found for ${fileName}`,
      variant: "destructive",
    });
    return;
  }

  const versionToDownload = version || file.versions[0]?.version;
  const versionData = file.versions.find(v => v.version === versionToDownload);

  if (!versionData) {
    toast({
      title: "Version Not Found",
      description: `Version ${versionToDownload} not found for ${fileName}`,
      variant: "destructive",
    });
    return;
  }

  // Trigger download
  window.open(versionData.downloadLink, "_blank");

  toast({
    title: "Download Started",
    description: `Downloading ${fileName} ${versionToDownload}`,
  });
};

const handleViewHistory = (fileName: string) => {
  const file = files.find(f => f.fileName === fileName);
  if (file) {
    setSelectedFileHistory(file);
  } else {
    toast({
      title: "File Not Found",
      description: `No history found for ${fileName}`,
      variant: "destructive",
    });
  }
};

const handleVersionView = (version: string) => {
  if (!selectedFileHistory) {
    toast({
      title: "No File Selected",
      description: "Please select a file before viewing a version.",
      variant: "destructive",
    });
    return;
  }

  const versionData = selectedFileHistory.versions.find(v => v.version === version);
  if (!versionData) {
    toast({
      title: "Version Not Found",
      description: `Version ${version} not found for ${selectedFileHistory.fileName}`,
      variant: "destructive",
    });
    return;
  }

  window.open(versionData.downloadLink, "_blank");

  toast({
    title: "Version Opened",
    description: `Opening ${selectedFileHistory.fileName} ${version} in a new tab.`,
  });
};

const handleVersionDownload = (version: string) => {
  if (!selectedFileHistory) {
    toast({
      title: "No File Selected",
      description: "Please select a file before downloading a version.",
      variant: "destructive",
    });
    return;
  }

  const versionData = selectedFileHistory.versions.find(v => v.version === version);
  if (!versionData) {
    toast({
      title: "Version Not Found",
      description: `Version ${version} not found for ${selectedFileHistory.fileName}`,
      variant: "destructive",
    });
    return;
  }

  window.open(versionData.downloadLink, "_blank");

  toast({
    title: "Download Started",
    description: `Downloading ${selectedFileHistory.fileName} ${version}`,
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
                All Files 
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
        {/* {showSearchResults ? (
          <SearchResults 
            results={mockSearchResults} 
            onFileClick={handleFileView}
          />
        ) : ( */}
          <FileIndex
            files={files}
            onFileView={handleFileView}
            onFileEdit={handleFileEdit}
            onFileDownload={handleFileDownload}
            onViewHistory={handleViewHistory}
          />
        {/* )} */}

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


      {/* Version History Dialog */}
      {selectedFileHistory && (
        <Dialog open={!!selectedFileHistory} onOpenChange={() => setSelectedFileHistory(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Version History</DialogTitle>
            </DialogHeader>
            <VersionHistory
              filename={selectedFileHistory.fileName}
              versions={selectedFileHistory.versions}
              onVersionView={handleVersionView}
              onVersionDownload={handleVersionDownload}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Index;