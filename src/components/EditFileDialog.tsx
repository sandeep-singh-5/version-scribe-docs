import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Edit, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Document, Packer, Paragraph, TextRun } from "docx";
import files from "../services/files/files";

interface EditFileDialogProps {
  fileName: string;
  fileType: string;
  versionCount: number;
  onFileUpdate: (fileData: any) => void;
  children: React.ReactNode;
  latestVersion?: {
    content?: string;
    downloadLink: string;
    author: string;
    version: string;
  };
}

const EditFileDialog = ({ 
  fileName, 
  fileType, 
  versionCount, 
  onFileUpdate, 
  children,
  latestVersion 
}: EditFileDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [showEditor, setShowEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    keywords: "",
    author: latestVersion?.author || "",
    remark: "",
  });

  const isDocxFile = fileType.toLowerCase() === 'docx';
  const hasMultipleVersions = versionCount > 1;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.author.trim()) {
      toast({ title: "Error", description: "Please enter author name", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleCreateNewFile = () => {
    if (!validateForm()) return;
    setShowEditor(true);
    setTimeout(() => {
      if (quillRef.current && !quillInstance.current) {
        quillInstance.current = new Quill(quillRef.current, { 
          theme: "snow", 
          placeholder: "Start editing your document..." 
        });
        
        // Load content from latest version if available
        if (latestVersion?.content) {
          quillInstance.current.setText(latestVersion.content);
        }
      }
    }, 0);
  };

  const handleSaveNewVersion = async () => {
    if (!quillInstance.current) return;
    const plainText = quillInstance.current.getText().trim();

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun(plainText)],
            }),
          ],
        },
      ],
    });

    try {
      const blob = await Packer.toBlob(doc);
      const nextVersion = `${parseFloat(latestVersion?.version || "1.0") + 0.1}`;

      const uploadForm = new FormData();
      uploadForm.append("file", blob, fileName);
      uploadForm.append("author", formData.author);
      uploadForm.append("remark", formData.remark);
      uploadForm.append("version", nextVersion);
      uploadForm.append("filename", fileName.replace(/\.[^/.]+$/, ""));
      uploadForm.append("keywords", formData.keywords);

      await files.CreateFile({ bodyData: uploadForm });

      const fileData = {
        fileName,
        keywords: formData.keywords,
        downloadLink: `/uploads/${fileName}`,
        uploadedOn: new Date().toISOString(),
        author: formData.author,
        version: nextVersion,
        remark: formData.remark,
      };

      onFileUpdate(fileData);
      toast({ title: "New Version Created", description: `${fileName} v${nextVersion} saved successfully` });
      resetForm();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Save failed",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file type matches original for non-docx files
    if (!isDocxFile) {
      const originalExt = fileName.split('.').pop()?.toLowerCase();
      const selectedExt = file.name.split('.').pop()?.toLowerCase();
      
      if (originalExt !== selectedExt) {
        toast({ 
          title: "Error", 
          description: `Please upload a ${originalExt?.toUpperCase()} file to match the original format`, 
          variant: "destructive" 
        });
        return;
      }
    } else {
      // For docx files, only allow docx uploads
      if (!file.type.includes("wordprocessingml.document")) {
        toast({ 
          title: "Error", 
          description: "Please upload a Word document (.docx) file", 
          variant: "destructive" 
        });
        return;
      }
    }

    setSelectedFile(file);
  };

  const handleSubmitUpload = async () => {
    if (!selectedFile || !validateForm()) return;

    const nextVersion = `${parseFloat(latestVersion?.version || "1.0") + 0.1}`;

    const uploadForm = new FormData();
    uploadForm.append("file", selectedFile);
    uploadForm.append("author", formData.author);
    uploadForm.append("remark", formData.remark);
    uploadForm.append("version", nextVersion);
    uploadForm.append("filename", fileName.replace(/\.[^/.]+$/, ""));
    uploadForm.append("keywords", formData.keywords);

    try {
      await files.CreateFile({ bodyData: uploadForm });

      const fileData = {
        fileName,
        keywords: formData.keywords,
        downloadLink: `/uploads/${selectedFile.name}`,
        uploadedOn: new Date().toISOString(),
        author: formData.author,
        version: nextVersion,
        remark: formData.remark,
      };

      onFileUpdate(fileData);
      toast({ title: "File Updated", description: `${fileName} v${nextVersion} uploaded successfully` });
      resetForm();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Upload failed",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ keywords: "", author: latestVersion?.author || "", remark: "" });
    setShowEditor(false);
    setSelectedFile(null);
    setIsOpen(false);
    setActiveTab("upload");
    if (fileInputRef.current) fileInputRef.current.value = "";
    quillInstance.current = null;
  };

  const getAcceptedFileTypes = () => {
    if (isDocxFile) return ".docx";
    const ext = fileName.split('.').pop()?.toLowerCase();
    return `.${ext}`;
  };

  const showCreateOption = isDocxFile && hasMultipleVersions;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className={`${showEditor ? "sm:max-w-6xl max-h-[90vh]" : "sm:max-w-2xl"} bg-card/95 backdrop-blur-sm border-border shadow-file-card-hover`}>
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {showEditor ? `Editing - ${fileName}` : `Edit ${fileName}`}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Current version: {latestVersion?.version || "1.0"} • Type: {fileType.toUpperCase()}
          </p>
        </DialogHeader>

        {showEditor ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 bg-muted/30 rounded-xl border border-border/50">
              <div 
                ref={quillRef} 
                className="h-[600px] bg-background rounded-lg border border-border shadow-inner"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border/50">
              <Button variant="outline" onClick={resetForm} className="min-w-20">
                Cancel
              </Button>
              <Button onClick={handleSaveNewVersion} className="bg-gradient-primary hover:opacity-90 text-primary-foreground min-w-20">
                Save New Version
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
              defaultValue={showCreateOption ? "create" : "upload"}
            >
              {showCreateOption && (
                <TabsList className="grid w-full grid-cols-2 bg-muted/30 p-1 h-12">
                  <TabsTrigger value="create" className="h-10 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Version
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="h-10 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </TabsTrigger>
                </TabsList>
              )}

              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-card-foreground">Author *</Label>
                    <Input 
                      value={formData.author} 
                      onChange={(e) => handleInputChange("author", e.target.value)}
                      placeholder="Enter author name"
                      className="h-10 bg-background/50 border-border focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-card-foreground">Keywords</Label>
                    <Input 
                      value={formData.keywords} 
                      onChange={(e) => handleInputChange("keywords", e.target.value)}
                      placeholder="Enter keywords separated by commas"
                      className="h-10 bg-background/50 border-border focus:border-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-card-foreground">Remark</Label>
                  <Textarea 
                    value={formData.remark} 
                    onChange={(e) => handleInputChange("remark", e.target.value)}
                    placeholder="Add any remarks or notes about this version"
                    className="min-h-20 bg-background/50 border-border focus:border-primary resize-none"
                  />
                </div>
              </div>

              {showCreateOption && (
                <TabsContent value="create" className="mt-6 pt-4 border-t border-border/50">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">Create New Version</p>
                        <p className="text-sm text-muted-foreground">
                          Opens editor with content from version {latestVersion?.version || "1.0"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsOpen(false)} className="min-w-20">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateNewFile} className="bg-gradient-primary hover:opacity-90 text-primary-foreground min-w-32">
                      Open Editor
                    </Button>
                  </div>
                </TabsContent>
              )}

              <TabsContent value="upload" className="mt-6 space-y-4">
                <div className="p-6 border-2 border-dashed border-border/50 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors duration-200">
                  <div className="text-center space-y-3">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div>
                      <Input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        accept={getAcceptedFileTypes()}
                        className="sr-only"
                        id="file-upload-edit"
                      />
                      <Label 
                        htmlFor="file-upload-edit" 
                        className="cursor-pointer text-primary hover:text-primary-hover font-medium"
                      >
                        Click to browse files
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        or drag and drop your file here
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isDocxFile 
                        ? "Only .docx files are accepted" 
                        : `Only ${fileType.toUpperCase()} files are accepted to match the original format`
                      }
                    </p>
                  </div>
                </div>
                
                {selectedFile && (
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-card-foreground truncate">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                  <Button variant="outline" onClick={() => setIsOpen(false)} className="min-w-20">
                    Cancel
                  </Button>
                  {selectedFile && (
                    <Button onClick={handleSubmitUpload} className="bg-gradient-primary hover:opacity-90 text-primary-foreground min-w-20">
                      Upload New Version
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditFileDialog;