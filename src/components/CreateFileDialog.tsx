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

      <DialogContent className={showEditor ? "sm:max-w-4xl" : "sm:max-w-lg"}>
        <DialogHeader>
          <DialogTitle>{showEditor ? `Word Editor - ${formData.fileName}.docx` : "Create or Upload Document"}</DialogTitle>
        </DialogHeader>

        {showEditor ? (
          <>
            <div ref={quillRef} style={{ height: "600px", background: "white", border: "1px solid #ccc", borderRadius: "4px" }} />
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSaveDocument}>Save</Button>
            </div>
          </>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create"><FileText className="h-4 w-4" /> Create Document</TabsTrigger>
              <TabsTrigger value="upload"><Upload className="h-4 w-4" /> Upload File</TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-4">
              <Label>Filename</Label>
              <Input value={formData.fileName} onChange={(e) => handleInputChange("fileName", e.target.value)} />
              <Label>Author</Label>
              <Input value={formData.author} onChange={(e) => handleInputChange("author", e.target.value)} />
              <Label>Keywords</Label>
              <Input value={formData.keywords} onChange={(e) => handleInputChange("keywords", e.target.value)} />
              <Label>Remark</Label>
              <Textarea value={formData.remark} onChange={(e) => handleInputChange("remark", e.target.value)} />
            </div>

            <TabsContent value="create" className="mt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateFile}>Open Word Editor</Button>
            </TabsContent>

            <TabsContent value="upload" className="mt-4">
              <Input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".docx,.xlsx,.pptx,.pdf" />
              {selectedFile && <p>{selectedFile.name}</p>}
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              {selectedFile && <Button onClick={handleSubmitUpload}>Submit</Button>}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateFileDialog;
