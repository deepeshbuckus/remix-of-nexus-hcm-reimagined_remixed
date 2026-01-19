import { useState } from "react";
import { FileText, Upload, Search, Filter, Grid, List, MoreVertical, Download, Trash2, Eye, Calendar, AlertTriangle, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InlineDocumentUpload } from "@/components/documents/InlineDocumentUpload";
import { format, differenceInDays } from "date-fns";

interface Document {
  id: string;
  name: string;
  type: string;
  version: number;
  uploadedAt: Date;
  expiryDate?: Date;
  fileSize: string;
  status: "active" | "expiring" | "expired";
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Employment Contract",
    type: "Contract",
    version: 2,
    uploadedAt: new Date("2024-01-15"),
    expiryDate: new Date("2025-01-15"),
    fileSize: "2.4 MB",
    status: "active",
  },
  {
    id: "2",
    name: "Driver's License",
    type: "ID Document",
    version: 1,
    uploadedAt: new Date("2024-03-10"),
    expiryDate: new Date("2024-12-20"),
    fileSize: "1.1 MB",
    status: "expiring",
  },
  {
    id: "3",
    name: "Tax Form W-4",
    type: "Tax Document",
    version: 3,
    uploadedAt: new Date("2024-06-01"),
    fileSize: "856 KB",
    status: "active",
  },
  {
    id: "4",
    name: "Professional Certification",
    type: "Certificate",
    version: 1,
    uploadedAt: new Date("2023-09-20"),
    expiryDate: new Date("2024-09-20"),
    fileSize: "3.2 MB",
    status: "expired",
  },
  {
    id: "5",
    name: "Direct Deposit Authorization",
    type: "Banking",
    version: 1,
    uploadedAt: new Date("2024-02-28"),
    fileSize: "512 KB",
    status: "active",
  },
];

const getStatusBadge = (status: string, expiryDate?: Date) => {
  if (status === "expired") {
    return <Badge variant="destructive" className="text-xs">Expired</Badge>;
  }
  if (status === "expiring" && expiryDate) {
    const daysLeft = differenceInDays(expiryDate, new Date());
    return (
      <Badge variant="outline" className="text-xs border-amber-500 text-amber-600 bg-amber-50">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Expires in {daysLeft} days
      </Badge>
    );
  }
  return <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>;
};

const getDocumentIcon = (type: string) => {
  const colors: Record<string, string> = {
    Contract: "bg-blue-100 text-blue-600",
    "ID Document": "bg-purple-100 text-purple-600",
    "Tax Document": "bg-green-100 text-green-600",
    Certificate: "bg-amber-100 text-amber-600",
    Banking: "bg-teal-100 text-teal-600",
  };
  return colors[type] || "bg-gray-100 text-gray-600";
};

export default function Documents() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const documentTypes = [...new Set(mockDocuments.map((d) => d.type))];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">My Documents</h1>
            <p className="text-muted-foreground mt-1">
              Manage your personal and work documents securely
            </p>
          </div>
          <Button 
            onClick={() => setUploadPanelOpen(!uploadPanelOpen)} 
            className="gap-2"
            variant={uploadPanelOpen ? "secondary" : "default"}
          >
            {uploadPanelOpen ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Close Upload
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Document
              </>
            )}
          </Button>
        </div>

        {/* Inline Upload Panel */}
        <InlineDocumentUpload 
          isOpen={uploadPanelOpen} 
          onClose={() => setUploadPanelOpen(false)}
          onSuccess={() => setUploadPanelOpen(false)}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-background border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{mockDocuments.length}</p>
                  <p className="text-xs text-muted-foreground">Total Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">
                    {mockDocuments.filter((d) => d.status === "active").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">
                    {mockDocuments.filter((d) => d.status === "expiring").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Expiring Soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">
                    {mockDocuments.filter((d) => d.status === "expired").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Expired</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-background border-0 shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-muted/50 border-0"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px] bg-muted/50 border-0">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">All Types</SelectItem>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="rounded-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="rounded-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents List/Grid */}
        {viewMode === "list" ? (
          <Card className="bg-background border-0 shadow-sm overflow-hidden">
            <div className="divide-y divide-border">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 hover:bg-muted/50 transition-colors flex items-center gap-4"
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${getDocumentIcon(doc.type)}`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground truncate">{doc.name}</h3>
                      <span className="text-xs text-muted-foreground">v{doc.version}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-muted-foreground">{doc.type}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{doc.fileSize}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        Uploaded {format(doc.uploadedAt, "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(doc.status, doc.expiryDate)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="bg-background border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${getDocumentIcon(doc.type)}`}>
                      <FileText className="h-7 w-7" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-medium text-foreground truncate">{doc.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{doc.type} • v{doc.version}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-muted-foreground">{doc.fileSize}</span>
                    {getStatusBadge(doc.status, doc.expiryDate)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredDocuments.length === 0 && (
          <Card className="bg-background border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search or filters" : "Upload your first document to get started"}
              </p>
              <Button onClick={() => setUploadPanelOpen(true)} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
