import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DocumentInfo } from '@/types/onboarding';

interface DocumentsStepProps {
  data: DocumentInfo;
  onUpdate: (updates: Partial<DocumentInfo>) => void;
}

interface DocumentUploadProps {
  title: string;
  description: string;
  required: boolean;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

function DocumentUpload({ title, description, required, file, onFileChange }: DocumentUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileChange(acceptedFiles[0]);
    }
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{title}</h3>
              <Badge variant={required ? "destructive" : "secondary"} className="text-xs">
                {required ? 'Required' : 'Optional'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {file ? (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <File className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFileChange(null)}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive ? 'Drop the file here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG or PDF up to 10MB</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DocumentsStep({ data, onUpdate }: DocumentsStepProps) {
  const requiredDocuments = [
    {
      key: 'governmentId' as const,
      title: 'Government Photo ID',
      description: "Driver's licence, Passport, PR card",
    },
    {
      key: 'directDepositProof' as const,
      title: 'Direct Deposit Proof',
      description: 'Void cheque or Direct deposit form',
    },
  ];

  const optionalDocuments = [
    {
      key: 'workEligibility' as const,
      title: 'Work Eligibility',
      description: 'Work permit, Study permit, SIN confirmation letter',
    },
    {
      key: 'proofOfAddress' as const,
      title: 'Proof of Address',
      description: 'Utility bill, Bank statement, Government letter',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Documents</h1>
        <p className="text-muted-foreground">Upload required documents to complete your profile</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Required Documents</h2>
        {requiredDocuments.map((doc) => (
          <DocumentUpload
            key={doc.key}
            title={doc.title}
            description={doc.description}
            required={true}
            file={data[doc.key]}
            onFileChange={(file) => onUpdate({ [doc.key]: file })}
          />
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Optional Documents</h2>
        {optionalDocuments.map((doc) => (
          <DocumentUpload
            key={doc.key}
            title={doc.title}
            description={doc.description}
            required={false}
            file={data[doc.key]}
            onFileChange={(file) => onUpdate({ [doc.key]: file })}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        <Shield className="h-4 w-4 shrink-0" />
        <p>Your documents are stored securely and accessed only by authorized personnel</p>
      </div>
    </div>
  );
}
