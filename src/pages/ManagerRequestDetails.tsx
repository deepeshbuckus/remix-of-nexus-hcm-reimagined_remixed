import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MessageSquare, CheckCircle2, X, AlertTriangle, User, Briefcase, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ManagerRequestDetails = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [responseMessage, setResponseMessage] = useState("");

  // Mock data - replace with actual data fetching
  const request = {
    id: requestId,
    employee: {
      name: "Sarah Johnson",
      role: "Senior Developer",
      department: "Engineering",
      avatar: "/placeholder.svg",
      email: "sarah.johnson@powerpay.com",
      phone: "+1 (555) 123-4567"
    },
    leaveType: "Vacation",
    duration: "Full Day",
    startDate: "2025-01-15",
    endDate: "2025-01-19",
    totalDays: 5,
    reason: "Family vacation to the mountains. Planning this trip for several months and have coordinated with team members.",
    status: "Pending",
    submittedDate: "2024-12-28",
    balances: {
      before: { vacation: 15, sick: 8, personal: 3 },
      after: { vacation: 10, sick: 8, personal: 3 }
    },
    conflicts: [
      { name: "Mike Chen", avatar: "/placeholder.svg", dates: "Jan 16-17", risk: "Medium" },
      { name: "Emily Davis", avatar: "/placeholder.svg", dates: "Jan 18-19", risk: "Low" }
    ]
  };

  const handleApprove = () => {
    toast.success("Request approved successfully");
    navigate("/time");
  };

  const handleReject = () => {
    if (!responseMessage) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    toast.success("Request rejected");
    navigate("/time");
  };

  const handleAskForInfo = () => {
    if (!responseMessage) {
      toast.error("Please enter your question");
      return;
    }
    toast.success("Information request sent");
    setResponseMessage("");
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "Vacation": return "bg-blue-100 text-blue-700";
      case "Sick Leave": return "bg-yellow-100 text-yellow-700";
      case "Personal": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "text-red-600";
      case "Medium": return "text-orange-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/time")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Team Time Away
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Request Details</h1>
              <p className="text-muted-foreground mt-1">Review and manage leave request</p>
            </div>
            <Badge variant={request.status === "Pending" ? "default" : "secondary"}>
              {request.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Employee Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Employee Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={request.employee.avatar} />
                    <AvatarFallback className="text-2xl">
                      {request.employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground">{request.employee.name}</h3>
                      <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Briefcase className="h-4 w-4" />
                        {request.employee.role} • {request.employee.department}
                      </p>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {request.employee.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {request.employee.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leave Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Leave Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Leave Type</label>
                    <div className="mt-2">
                      <Badge className={getLeaveTypeColor(request.leaveType)}>
                        {request.leaveType}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Duration</label>
                    <p className="mt-2 text-foreground font-medium">{request.duration}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Start Date
                    </label>
                    <p className="mt-2 text-foreground font-medium">
                      {new Date(request.startDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      End Date
                    </label>
                    <p className="mt-2 text-foreground font-medium">
                      {new Date(request.endDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Total Days Requested</span>
                    <span className="text-2xl font-bold text-primary">{request.totalDays} days</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reason / Comment</label>
                  <p className="mt-2 text-foreground leading-relaxed">{request.reason}</p>
                </div>

                <div className="text-xs text-muted-foreground">
                  Submitted on {new Date(request.submittedDate).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Response Section */}
            <Card>
              <CardHeader>
                <CardTitle>Manager Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Message to Employee (optional for approval, required for rejection/questions)
                  </label>
                  <Textarea
                    placeholder="Enter your message, question, or reason for rejection..."
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    className="mt-2 min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Balance & Conflicts */}
          <div className="space-y-6">
            {/* Leave Balance Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Leave Balance Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Vacation Balance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-foreground">{request.balances.before.vacation}</div>
                      <div className="text-xs text-muted-foreground">Before</div>
                    </div>
                    <div className="text-muted-foreground">→</div>
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-primary">{request.balances.after.vacation}</div>
                      <div className="text-xs text-muted-foreground">After</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sick Leave</span>
                    <span className="font-medium">{request.balances.before.sick} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Personal</span>
                    <span className="font-medium">{request.balances.before.personal} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conflict Detection */}
            {request.conflicts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Team Conflicts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {request.conflicts.length} team member{request.conflicts.length > 1 ? 's' : ''} will be away during overlapping dates
                  </p>
                  {request.conflicts.map((conflict, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conflict.avatar} />
                        <AvatarFallback>
                          {conflict.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{conflict.name}</p>
                        <p className="text-xs text-muted-foreground">{conflict.dates}</p>
                      </div>
                      <Badge variant="outline" className={getRiskColor(conflict.risk)}>
                        {conflict.risk}
                      </Badge>
                    </div>
                  ))}
                  <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      <strong>Medium Risk:</strong> Team coverage may be affected. Consider coordination with remaining team members.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Actions Footer - Sticky */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleAskForInfo}
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Ask for Info
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Reject Request
              </Button>
              <Button
                onClick={handleApprove}
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve Request
              </Button>
            </div>
          </div>
        </div>

        {/* Spacer for sticky footer */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default ManagerRequestDetails;
