import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ImageUploadProps {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

export const ImageUpload = ({
  label,
  file,
  onFileChange,
  accept = "image/*",
  placeholder = "Upload image",
  icon,
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    onFileChange(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const removeFile = () => {
    onFileChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>
      
      <Card
        className={cn(
          "relative border-2 border-dashed transition-all duration-300 cursor-pointer group overflow-hidden",
          isDragging
            ? "border-primary bg-primary/5 shadow-glow"
            : file
            ? "border-accent bg-accent/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5",
          "min-h-[200px] flex items-center justify-center"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {preview ? (
          <div className="relative w-full h-full min-h-[200px]">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-lg hover:bg-destructive/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
              {file?.name}
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
              {icon}
            </div>
            <p className="text-sm font-medium mb-1">{placeholder}</p>
            <p className="text-xs text-muted-foreground">
              Drag & drop or click to select
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </Card>
    </div>
  );
};