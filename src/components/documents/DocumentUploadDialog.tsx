import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { 
  FileText, 
  Upload, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  CheckCircle2,
  RefreshCw,
  File
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const documentTypes = [
  "Contract",
  "ID Document",
  "Tax Document",
  "Certificate",
  "Banking",
  "Insurance",
  "Performance Review",
  "Training Record",
  "Other",
];

const reminderOptions = [
  { value: "7", label: "7 days before" },
  { value: "14", label: "14 days before" },
  { value: "30", label: "30 days before" },
  { value: "60", label: "60 days before" },
  { value: "90", label: "90 days before" },
];

export function DocumentUploadDialog({ open, onOpenChange }: DocumentUploadDialogProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [expiryOption, setExpiryOption] = useState<"never" | "set">("never");
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [reminderOption, setReminderOption] = useState<"none" | "send">("none");
  const [reminderDays, setReminderDays] = useState("30");
  const [expiryExpanded, setExpiryExpanded] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setDocumentName(file.name.replace(/\.[^/.]+$/, ""));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    multiple: false,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSave = async () => {
    if (!uploadedFile || !documentName || !documentType) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setIsSuccess(true);

    setTimeout(() => {
      toast.success("Document uploaded successfully");
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setUploadedFile(null);
    setDocumentName("");
    setDocumentType("");
    setExpiryOption("never");
    setExpiryDate(undefined);
    setReminderOption("none");
    setReminderDays("30");
    setExpiryExpanded(false);
    setIsSuccess(false);
    setIsSaving(false);
    onOpenChange(false);
  };

  const replaceFile = () => {
    setUploadedFile(null);
    setDocumentName("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[540px] p-0 gap-0 overflow-hidden bg-background">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl font-semibold">Upload Document</DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-16 px-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Upload Complete!</h3>
              <p className="text-muted-foreground text-center">
                Your document has been saved successfully.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col max-h-[70vh]"
            >
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* Drop Zone */}
                {!uploadedFile ? (
                  <div
                    {...getRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <input {...getInputProps()} />
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-foreground font-medium mb-1">
                      {isDragActive ? "Drop your file here" : "Drag & drop your file here"}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOCX, XLSX, JPG, PNG • Max 20MB
                    </p>
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <File className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(uploadedFile.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={replaceFile}
                      className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Replace
                    </Button>
                  </div>
                )}

                {/* Document Details */}
                {uploadedFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="documentName" className="text-sm font-medium">
                          Document Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="documentName"
                          value={documentName}
                          onChange={(e) => setDocumentName(e.target.value)}
                          placeholder="Enter document name"
                          className="mt-1.5 bg-background"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Document Type <span className="text-destructive">*</span>
                        </Label>
                        <Select value={documentType} onValueChange={setDocumentType}>
                          <SelectTrigger className="mt-1.5 bg-background">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            {documentTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Version Date</Label>
                        <Input
                          value={format(new Date(), "MMM d, yyyy")}
                          disabled
                          className="mt-1.5 bg-muted/50"
                        />
                      </div>
                    </div>

                    {/* Expiry Settings - Collapsible */}
                    <Collapsible open={expiryExpanded} onOpenChange={setExpiryExpanded}>
                      <CollapsibleTrigger asChild>
                        <button className="flex items-center justify-between w-full py-3 px-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              Expiry & Reminder Settings
                            </span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-[250px] bg-background border">
                                <p className="text-xs">
                                  The system automatically monitors expiry and will send reminders based on your preference.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          {expiryExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="pt-4 space-y-4"
                        >
                          {/* Expiry Date */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Expiry Date</Label>
                            <RadioGroup
                              value={expiryOption}
                              onValueChange={(val) => setExpiryOption(val as "never" | "set")}
                              className="space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="never" id="never" />
                                <Label htmlFor="never" className="font-normal cursor-pointer">
                                  Never expires
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="set" id="set" />
                                <Label htmlFor="set" className="font-normal cursor-pointer">
                                  Set expiry date
                                </Label>
                              </div>
                            </RadioGroup>
                            {expiryOption === "set" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="pl-6"
                              >
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !expiryDate && "text-muted-foreground"
                                      )}
                                    >
                                      <FileText className="mr-2 h-4 w-4" />
                                      {expiryDate ? format(expiryDate, "PPP") : "Pick a date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0 bg-background" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={expiryDate}
                                      onSelect={setExpiryDate}
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                      className="pointer-events-auto"
                                    />
                                  </PopoverContent>
                                </Popover>
                              </motion.div>
                            )}
                          </div>

                          {/* Reminder Email */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Reminder Email</Label>
                            <RadioGroup
                              value={reminderOption}
                              onValueChange={(val) => setReminderOption(val as "none" | "send")}
                              className="space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="none" id="none" />
                                <Label htmlFor="none" className="font-normal cursor-pointer">
                                  Don't send reminder
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="send" id="send" />
                                <Label htmlFor="send" className="font-normal cursor-pointer">
                                  Send reminder before expiry
                                </Label>
                              </div>
                            </RadioGroup>
                            {reminderOption === "send" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="pl-6"
                              >
                                <Select value={reminderDays} onValueChange={setReminderDays}>
                                  <SelectTrigger className="w-full bg-background">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background">
                                    {reminderOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      </CollapsibleContent>
                    </Collapsible>
                  </motion.div>
                )}
              </div>

              {/* Sticky Footer */}
              <div className="sticky bottom-0 px-6 py-4 border-t border-border bg-background flex items-center justify-end gap-3">
                <Button variant="outline" onClick={handleClose} disabled={isSaving}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!uploadedFile || !documentName || !documentType || isSaving}
                  className="min-w-[120px]"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Document"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
