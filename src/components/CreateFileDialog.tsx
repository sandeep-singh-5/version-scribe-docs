import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Document, Packer, Paragraph, TextRun } from "docx";
import files from "../services/files/files.ts"
interface FileData {
  fileName: string;
  keywords: string;
  downloadLink: string;
  uploadedOn: string;
  author: string;
  version: string;
  remark: string;
}

export type { FileData };

interface CreateFileDialogProps {
  onFileCreate: (fileData: FileData) => void;
}

const CreateFileDialog = ({ onFileCreate }: CreateFileDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [showEditor, setShowEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fileName: "",
    keywords: "",
    author: "",
    remark: "",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.fileName.trim()) {
      toast({ title: "Error", description: "Please enter a filename", variant: "destructive" });
      return false;
    }
    if (!formData.author.trim()) {
      toast({ title: "Error", description: "Please enter author name", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleCreateFile = () => {
    if (!validateForm()) return;
    setShowEditor(true);
    setTimeout(() => {
      if (quillRef.current && !quillInstance.current) {
        quillInstance.current = new Quill(quillRef.current, { theme: "snow", placeholder: "Start writing your document..." });
      }
    }, 0);
  };

  const handleSaveDocument = async () => {
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

    const uploadForm = new FormData();
    uploadForm.append("file", blob, `${formData.fileName}.docx`);
    uploadForm.append("author", formData.author);
    uploadForm.append("remark", formData.remark);
    uploadForm.append("version", "1.0");
    uploadForm.append("filename", formData.fileName);
    uploadForm.append("keywords", formData.keywords);

    await files.CreateFile({ bodyData: uploadForm });

    const fileData: FileData = {
      fileName: `${formData.fileName}.docx`,
      keywords: formData.keywords,
      downloadLink: `/uploads/${formData.fileName}.docx`,
      uploadedOn: new Date().toISOString(),
      author: formData.author,
      version: "1.0",
      remark: formData.remark,
    };

    onFileCreate(fileData);
    toast({ title: "Document Created", description: `${fileData.fileName} uploaded successfully` });
    resetForm();
  } catch (err) {
    toast({
      title: "Error",
      description: err instanceof Error ? err.message : "Upload failed",
      variant: "destructive",
    });
  }
};


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Error", description: "Please upload a valid document file", variant: "destructive" });
      return;
    }

    setSelectedFile(file);
    if (!formData.fileName) handleInputChange("fileName", file.name);
  };

  const handleSubmitUpload = async () => {
  if (!selectedFile || !validateForm()) return;

  const uploadForm = new FormData();
  uploadForm.append("file", selectedFile);
  uploadForm.append("author", formData.author);
  uploadForm.append("remark", formData.remark);
  uploadForm.append("version", "1.0");
  uploadForm.append("filename", formData.fileName || selectedFile.name);
  uploadForm.append("keywords", formData.keywords);

  try {
    await files.CreateFile({ bodyData: uploadForm });

    const fileData: FileData = {
      fileName: formData.fileName || selectedFile.name,
      keywords: formData.keywords,
      downloadLink: `/uploads/${selectedFile.name}`,
      uploadedOn: new Date().toISOString(),
      author: formData.author,
      version: "1.0",
      remark: formData.remark,
    };

    onFileCreate(fileData);
    toast({ title: "File Uploaded", description: `${fileData.fileName} uploaded successfully` });
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
    setFormData({ fileName: "", keywords: "", author: "", remark: "" });
    setShowEditor(false);
    setSelectedFile(null);
    setIsOpen(false);
    setActiveTab("create");
    if (fileInputRef.current) fileInputRef.current.value = "";
    quillInstance.current = null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Create New File
        </Button>
      </DialogTrigger>

      <DialogContent className={`${showEditor ? "sm:max-w-6xl max-h-[90vh]" : "sm:max-w-2xl"} bg-card/95 backdrop-blur-sm border-border shadow-file-card-hover`}>
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {showEditor ? `Word Editor - ${formData.fileName}.docx` : "Create or Upload Document"}
          </DialogTitle>
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
              <Button onClick={handleSaveDocument} className="bg-gradient-primary hover:opacity-90 text-primary-foreground min-w-20">
                Save Document
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/30 p-1 h-12">
                <TabsTrigger value="create" className="h-10 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Document
                </TabsTrigger>
                <TabsTrigger value="upload" className="h-10 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-card-foreground">Filename *</Label>
                    <Input 
                      value={formData.fileName} 
                      onChange={(e) => handleInputChange("fileName", e.target.value)}
                      placeholder="Enter filename"
                      className="h-10 bg-background/50 border-border focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-card-foreground">Author *</Label>
                    <Input 
                      value={formData.author} 
                      onChange={(e) => handleInputChange("author", e.target.value)}
                      placeholder="Enter author name"
                      className="h-10 bg-background/50 border-border focus:border-primary"
                    />
                  </div>
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
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-card-foreground">Remark</Label>
                  <Textarea 
                    value={formData.remark} 
                    onChange={(e) => handleInputChange("remark", e.target.value)}
                    placeholder="Add any remarks or notes"
                    className="min-h-20 bg-background/50 border-border focus:border-primary resize-none"
                  />
                </div>
              </div>

              <TabsContent value="create" className="mt-6 pt-4 border-t border-border/50">
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsOpen(false)} className="min-w-20">
                    Cancel
                  </Button>
                  <Button onClick={handleCreateFile} className="bg-gradient-primary hover:opacity-90 text-primary-foreground min-w-32">
                    Open Word Editor
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="mt-6 space-y-4">
                <div className="p-6 border-2 border-dashed border-border/50 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors duration-200">
                  <div className="text-center space-y-3">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div>
                      <Input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        accept=".docx,.xlsx,.pptx,.pdf"
                        className="sr-only"
                        id="file-upload"
                      />
                      <Label 
                        htmlFor="file-upload" 
                        className="cursor-pointer text-primary hover:text-primary-hover font-medium"
                      >
                        Click to browse files
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        or drag and drop your file here
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: .docx, .xlsx, .pptx, .pdf
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
                      Submit File
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

export default CreateFileDialog;
