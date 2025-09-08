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
import EditFileDialog from "@/components/EditFileDialog";
import { set } from "date-fns";


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
interface SearchResult {
  indexedAt: string;
  fileData: {
    fileName: string;
    keywords: string;
    downloadLink: string;
    uploadedOn: string;
    author: string;
    version: string;
  };
  content: string;
}

const mockSearchResults: SearchResult[] = [
  {
    indexedAt: "2025-08-15T10:30:00Z",
    fileData: {
      fileName: "Project Proposal.pdf",
      keywords: "project, proposal, Q2 2024, version control",
      downloadLink: "https://example.com/files/project-proposal.pdf",
      uploadedOn: "2025-08-10T08:00:00Z",
      author: "John Smith",
      version: "1.0.0"
    },
    content: `Executive Summary: This document outlines the comprehensive project proposal for Q2 2024. The primary objective of the proposal is to overhaul the current document management infrastructure and introduce a modular, scalable version control system across departments. 

In doing so, the project will enhance operational efficiency, ensure higher compliance with audit standards, and reduce redundancy across data pipelines. The integration of OnlyOffice as a collaborative editing solution is also discussed in detail, emphasizing its role in streamlining internal document workflows.

The document breaks down the project into three phases: Planning & Design, Implementation, and Evaluation. Phase one will focus on stakeholder alignment and requirements gathering. Phase two includes system development, third-party integration, and internal training. The final phase is dedicated to user feedback, continuous improvement, and long-term roadmap planning.

Budget: $150,000 is allocated across the three phases, with a heavier focus on development resources and testing infrastructure. A contingency buffer of 10% has been applied to account for scope adjustments.

Risk analysis, timeline projections, and quality assurance measures are included in the appendices, offering a well-rounded view of project feasibility. The proposal concludes with KPIs designed to track adoption, performance improvements, and user satisfaction metrics.`
  },
  {
    indexedAt: "2025-08-20T14:45:00Z",
    fileData: {
      fileName: "Budget Analysis.pdf",
      keywords: "finance, analysis, ROI, Q4",
      downloadLink: "https://example.com/files/budget-analysis.pdf",
      uploadedOn: "2025-08-18T12:30:00Z",
      author: "Jane Doe",
      version: "2.1.3"
    },
    content: `The Q4 Financial Analysis Report provides a thorough breakdown of project expenditures, revenue forecasts, and overall financial health across departments. This quarter observed a 12% increase in operational costs, primarily driven by infrastructure investments and contractor fees.

Revenue, however, saw a 15% growth due to expansion into new markets and increased customer retention metrics. Marketing expenditure returned a higher-than-expected ROI, particularly in paid media and referral campaigns.

Forecasting models project a total cost of ownership (TCO) of $285,000 for the upcoming fiscal year, with a projected ROI of 150% within an 18-month horizon. Various scenarios were modeled, accounting for best-case, average-case, and pessimistic economic conditions.

Break-even analysis indicates profitability at month 14, assuming continued performance. Risk analysis identifies currency fluctuation, vendor delays, and regulatory changes as potential threats, each with mitigation strategies detailed in Section 7.

Tables A–F provide a granular view of department-level spend and actuals vs projections. Additional visualizations (charts and graphs) have been provided in the appendix for stakeholder presentations.`
  },
  {
    indexedAt: "2025-08-22T09:10:00Z",
    fileData: {
      fileName: "Marketing Strategy 2025.docx",
      keywords: "marketing, strategy, 2025, campaigns",
      downloadLink: "https://example.com/files/marketing-strategy-2025.docx",
      uploadedOn: "2025-08-21T11:00:00Z",
      author: "Emily Clarkson",
      version: "3.0"
    },
    content: `This strategy document defines the marketing roadmap for the 2025 fiscal year. Key objectives include brand visibility, lead generation, customer retention, and competitive differentiation. The document is structured into five core sections: Market Research, Strategy Framework, Tactical Execution, Budget Planning, and Metrics/KPIs.

We begin by analyzing macroeconomic trends and consumer behavior shifts, particularly post-pandemic digital adoption. The target audience segmentation has been refined using recent CRM and behavioral data, and new personas have been created to align campaigns accordingly.

The strategy is heavily focused on content marketing, community building, and inbound lead generation. Campaigns will span email, social media, influencer partnerships, webinars, and SEO. A particular focus is placed on TikTok, LinkedIn, and YouTube as growth channels.

Budget allocation is based on historical ROI and projected impact: 40% to paid search and social, 25% to content creation, and the rest split between events and branding initiatives. Each campaign includes detailed channel strategy, messaging guides, and intended funnel stage impact.

Monthly reporting cycles and quarterly strategy reviews are scheduled. Success will be measured through engagement rate, MQLs, CAC, and LTV. The appendix contains Gantt charts for rollout timelines and a content calendar outline.`
  },
  {
    indexedAt: "2025-08-25T08:00:00Z",
    fileData: {
      fileName: "Employee Handbook.pdf",
      keywords: "HR, policies, employee, handbook",
      downloadLink: "https://example.com/files/employee-handbook.pdf",
      uploadedOn: "2025-08-23T16:20:00Z",
      author: "HR Department",
      version: "5.2"
    },
    content: `The Employee Handbook is a comprehensive guide to our company’s policies, code of conduct, benefits, and workplace expectations. It begins with our mission, vision, and values, establishing the cultural framework all employees are expected to align with.

Core sections include: Workplace Policies, Equal Opportunity Employment, Harassment & Discrimination, Health & Safety, Internet & Device Use, Leave Policies, and Employee Benefits. New for 2025 is the inclusion of a Remote Work & Hybrid Policy, designed to offer flexibility while maintaining productivity and accountability.

Leave entitlements have been updated to reflect regional compliance changes, and our performance review system has transitioned to a continuous feedback model rather than annual reviews. The handbook also outlines our DEI commitments and employee support programs.

All employees are expected to acknowledge receipt of the handbook and complete annual compliance training. The final section addresses disciplinary procedures and grievance resolution protocols.

Legal compliance notes, revision history, and HR contact information are included in the final appendix for transparency.`
  },
  {
    indexedAt: "2025-08-28T13:40:00Z",
    fileData: {
      fileName: "Technical Specification - API Gateway.pdf",
      keywords: "tech spec, API, gateway, architecture",
      downloadLink: "https://example.com/files/api-gateway-spec.pdf",
      uploadedOn: "2025-08-26T09:55:00Z",
      author: "Backend Team",
      version: "0.9.1-beta"
    },
    content: `This technical specification details the architecture, components, and configurations for the company’s API Gateway. The purpose of this gateway is to manage, route, and secure external and internal API calls across microservices.

We cover three primary components: Routing Logic (based on URL patterns, headers, and query parameters), Rate Limiting (per client and endpoint), and Authentication (JWT, OAuth2, and API keys). The document also explains how plugins and middleware will be utilized to enable logging, tracing, CORS, and payload transformations.

Diagrams illustrate data flow, request chaining, and error handling processes. Infrastructure is built on top of Kubernetes, and the gateway will use Envoy Proxy with a custom control plane. Traffic observability is enabled through OpenTelemetry.

Security measures include WAF integration, IP whitelisting, and token revocation mechanisms. Performance benchmarks show 99th percentile latency under 20ms for 1000 RPS. Future versions will include GraphQL federation and edge caching.

Detailed configuration samples, Helm charts, and Terraform modules are attached in the appendix.`
  },
  {
    indexedAt: "2025-08-30T17:20:00Z",
    fileData: {
      fileName: "Client Contract - Acme Corp.docx",
      keywords: "legal, contract, client, Acme",
      downloadLink: "https://example.com/files/client-contract-acme.docx",
      uploadedOn: "2025-08-29T14:00:00Z",
      author: "Legal Team",
      version: "1.3.4"
    },
    content: `This contract outlines the complete terms of service between our organization and Acme Corp, including legal responsibilities, financial obligations, and service-level agreements (SLAs). 

The agreement is structured into 12 sections covering scope of services, payment terms, dispute resolution, confidentiality, termination clauses, and liability limitations. It includes detailed appendices for service delivery schedules, contact points, and escalation protocols.

Special attention is given to data protection, with clauses aligning with GDPR and CCPA regulations. Both parties agree to mutual indemnification in the event of data breaches or compliance failures.

The agreement is valid for 24 months, renewable upon mutual consent. Billing will occur quarterly with a 30-day net payment term. All intellectual property developed under this contract is owned by the client unless otherwise specified in writing.

Executed digitally and governed by California law, this document was reviewed by both legal teams and signed on August 28, 2025.`
  }
];



const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFileHistory, setSelectedFileHistory] = useState<FileDataResponse | null>(null);
  const [files, setFiles] = useState<FileDataResponse[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFileVersion, setEditingFileVersion] = useState<FileVersionRaw | null>(null);
  const [editedRemark, setEditedRemark] = useState(""); // Example editable field (remark)
  // ⬅️ Move this outside the useEffect block
  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await FileServices.GetAllFiles();
      console.log(res);
      setFiles(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to load files. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchFiles();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }

    try {
      const results = await FileServices.GetSearchResult({ fileId: searchQuery.trim() });
      console.log("------------------------->", results); // Correct use
      setSearchResults(results); // Store actual results

      setShowSearchResults(true); 
      console.log(results);

      toast({
        title: "Search Completed",
        description: `Found ${results?.length} results for "${searchQuery}"`,
      });
    } catch (error) {
      console.log(error);
      
      setShowSearchResults(false);
      toast({
        title: "Error",
        description: "Failed to fetch search results. Please try again."
      });
    }
  };

  const handleFileCreate = async (fileData: FileData) => {
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


    toast({
      title: "File Created",
      description: `File ${fileData.fileName} created successfully.`,
    });

    await fetchFiles(); // ⬅️ refresh list
  };

  const handleFileView = (fileData: FileVersionRaw, version?: string) => {
    console.log(".........................>>>>>>>>>>>>>>>", fileData);

    console.log("=====================>", fileData);

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

  const handleFileEdit = async (latestFileVersion: FileVersionRaw, version?: string) => {
    const currentVersion = version || latestFileVersion.version;
    console.log("Current version:", currentVersion);

    const match = currentVersion.match(/^v?(\d+)\.(\d+)(?:\.(\d+))?$/);
    console.log("Version match:", match);

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

    // Increment version
    const newVersion = minor >= 9
      ? `${major + 1}.0`
      : `${major}.${minor + 1}`;

    console.log("New version:", newVersion);

    // Prepare new version entry
    const newVersionEntry: FileVersionRaw = {
      fileName: latestFileVersion.fileName,
      keywords: latestFileVersion.keywords || "",
      downloadLink: latestFileVersion.downloadLink || "",
      uploadedOn: new Date().toISOString(),
      author: "You",
      version: newVersion,
    };
    console.log("New version entry:", newVersionEntry);

    // Instead of adding new file & opening new tab, open modal for editing
    setEditingFileVersion(newVersionEntry);
    setEditModalOpen(true);

    await fetchFiles();
  };

  // Save edited data (simulate saving)
  const handleSaveEdit = async () => {
    if (!editingFileVersion) return;

    const updatedVersion = {
      ...editingFileVersion,
      remark: editedRemark,
      uploadedOn: new Date().toISOString(),
    };

    // Simulate save logic here...

    setEditModalOpen(false);
    setEditingFileVersion(null);

    toast({
      title: "File Saved",
      description: `Saved new version ${updatedVersion.version} of file ${updatedVersion.fileName}.`,
    });

    await fetchFiles(); // ⬅️ refresh list after save
  };


  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingFileVersion(null);
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
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-border shadow-file-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Document Manager
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Manage your file versions with ease
              </p>
            </div>
            <div className="flex-shrink-0">
              <CreateFileDialog onFileCreate={handleFileCreate} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents, content, or versions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 h-12 text-base border-border bg-card/50 backdrop-blur-sm shadow-file-card focus:shadow-file-card-hover transition-all duration-200"
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button
                onClick={handleSearch}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-file-card hover:shadow-file-card-hover transition-all duration-200 h-12 px-6"
              >
                <Search className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Search</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-border hover:bg-muted/50 backdrop-blur-sm h-12 w-12"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={!showSearchResults ? "default" : "outline"}
                size="sm"
                onClick={() => setShowSearchResults(false)}
                className={!showSearchResults
                  ? "bg-gradient-primary text-primary-foreground shadow-file-card"
                  : "border-border hover:bg-muted/50 backdrop-blur-sm"
                }
              >
                All Files
              </Button>
              {showSearchResults && (
                <Button
                  variant="default"
                  size="sm"
                  className="bg-gradient-primary text-primary-foreground shadow-file-card"
                >
                  Search Results ({searchResults.length})
                </Button>
              )}
            </div>

            {!showSearchResults && (
              <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm p-1 rounded-lg border border-border">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted/50"
                  }
                >
                  <Grid className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Grid</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted/50"
                  }
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">List</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {showSearchResults ? (
          <SearchResults
            results={searchResults}
            onFileClick={handleFileView}
            searchQuery={searchQuery}
          />
        ) : (
          <FileIndex
            files={files}
            onFileView={handleFileView}
            onFileEdit={handleFileEdit}
            onFileDownload={handleFileDownload}
            onViewHistory={handleViewHistory}
          />
        )}

        {!showSearchResults && files.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-8 sm:p-12 max-w-md mx-auto shadow-file-card hover:shadow-file-card-hover transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-card-foreground mb-3">
                No Documents Yet
              </h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Get started by creating your first document or uploading an existing file
              </p>
              <CreateFileDialog onFileCreate={handleFileCreate} />
            </div>
          </div>
        )}
      </main>


      {/* Version History Dialog */}
      {selectedFileHistory && (
        <Dialog open={!!selectedFileHistory} onOpenChange={() => setSelectedFileHistory(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-border shadow-file-card-hover">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-card-foreground">Version History</DialogTitle>
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

      {/* Edit File Dialog */}
      {editingFileVersion && (
        <EditFileDialog
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          fileName={editingFileVersion.fileName}
          fileType={editingFileVersion.fileName.split('.').pop()?.toLowerCase() || 'docx'}
          versionCount={1}
          onFileUpdate={(fileData) => {
            const newFile = {
              fileName: fileData.fileName,
              versions: [fileData],
            };
            setFiles(prevFiles => [newFile, ...prevFiles]);
            setEditModalOpen(false);
            setEditingFileVersion(null);
          }}
          latestVersion={{
            content: '',
            downloadLink: editingFileVersion.downloadLink,
            author: editingFileVersion.author,
            version: editingFileVersion.version,
          }}
        />
      )}
    </div>
  );
};

export default Index;