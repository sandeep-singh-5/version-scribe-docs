import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateFileDialogProps {
  onFileCreate: (filename: string, fileType: string, template?: string) => void;
}

const CreateFileDialog = ({ onFileCreate }: CreateFileDialogProps) => {
  const [filename, setFilename] = useState("");
  const [fileType, setFileType] = useState("docx");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleCreate = () => {
    if (!filename.trim()) {
      toast({
        title: "Error",
        description: "Please enter a filename",
        variant: "destructive",
      });
      return;
    }

    // Create the file with version 1.0
    onFileCreate(filename.trim(), fileType);
    
    toast({
      title: "File Created",
      description: `${filename}.${fileType} v1.0 has been created successfully`,
    });

    // Reset form and close dialog
    setFilename("");
    setFileType("docx");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Create New File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Create New Document</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="filename" className="text-card-foreground">
              Filename
            </Label>
            <Input
              id="filename"
              placeholder="Enter filename (without extension)"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="border-border bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="filetype" className="text-card-foreground">
              File Type
            </Label>
            <Select value={fileType} onValueChange={setFileType}>
              <SelectTrigger className="border-border bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="docx">Word Document (.docx)</SelectItem>
                <SelectItem value="xlsx">Excel Spreadsheet (.xlsx)</SelectItem>
                <SelectItem value="pptx">PowerPoint Presentation (.pptx)</SelectItem>
                <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="border-border text-muted-foreground hover:bg-muted"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreate}
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            Create File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFileDialog;