import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import CollaborationRequestModal from "@/components/CollaborationRequestModal";
import { entrepreneursAPI, collaborationAPI } from "@/services/api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw } from "lucide-react";

// Investor Dashboard Content Component
const InvestorDashboardContent = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      try {
        setLoading(true);
        const data = await entrepreneursAPI.getAll();
        setEntrepreneurs(data);
      } catch (err) {
        setError("Failed to load entrepreneurs");
        console.error("Error fetching entrepreneurs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntrepreneurs();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading entrepreneurs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Entrepreneurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entrepreneurs.length}</div>
            <p className="text-xs text-muted-foreground">Active profiles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Investment Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {entrepreneurs.filter((e) => e.stage !== "Series B").length}
            </div>
            <p className="text-xs text-muted-foreground">Seeking funding</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.5M</div>
            <p className="text-xs text-muted-foreground">Current investments</p>
          </CardContent>
        </Card>
      </div>

      {/* Entrepreneurs List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Entrepreneurs</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entrepreneurs.map((entrepreneur) => (
            <Card
              key={entrepreneur.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-sm font-semibold">
                      {entrepreneur.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg leading-tight">
                      {entrepreneur.name}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-primary">
                      {entrepreneur.startupName}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground mt-1">
                      {entrepreneur.location} • {entrepreneur.stage}
                    </p>
                  </div>
                </div>
              </CardHeader>{" "}
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {entrepreneur.pitchSummary}
                </p>
                <div className="flex gap-2">
                  <Link
                    to={`/profile/entrepreneur/${entrepreneur.id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                  <div className="flex-1">
                    <CollaborationRequestModal entrepreneur={entrepreneur} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Entrepreneur Dashboard Content Component
const EntrepreneurDashboardContent = () => {
  const [collaborationRequests, setCollaborationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCollaborationRequests = async () => {
    try {
      setLoading(true); // Get current user from localStorage (in a real app, this would come from auth context)
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || '{"id": 1}'
      );
      const data = await collaborationAPI.getByEntrepreneurId(currentUser.id);
      setCollaborationRequests(data);
    } catch (err) {
      setError("Failed to load collaboration requests");
      console.error("Error fetching collaboration requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborationRequests();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      await collaborationAPI.updateStatus(requestId, "accepted");
      setCollaborationRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "accepted" } : req
        )
      );
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await collaborationAPI.updateStatus(requestId, "rejected");
      setCollaborationRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "rejected" } : req
        )
      );
    } catch (err) {
      console.error("Error declining request:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Declined";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Loading collaboration requests...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {collaborationRequests.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Collaboration requests
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                collaborationRequests.filter((req) => req.status === "pending")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Accepted Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                collaborationRequests.filter((req) => req.status === "accepted")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Active collaborations
            </p>
          </CardContent>
        </Card>
      </div>{" "}
      {/* Collaboration Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Collaboration Requests from Investors
          </h2>{" "}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCollaborationRequests}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        {collaborationRequests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No collaboration requests yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {collaborationRequests.map((request) => (
              <Card
                key={request.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-sm font-semibold">
                          {request.investor?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "IN"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg leading-tight">
                            {request.investor?.name || "Unknown Investor"}
                          </CardTitle>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {getStatusText(request.status)}
                          </span>
                        </div>
                        <CardDescription className="text-sm font-medium text-primary mb-1">
                          {request.investor?.company || "Investment Company"}
                        </CardDescription>
                        <p className="text-xs text-muted-foreground">
                          Investment Range: {request.proposedAmount || "TBD"} •
                          Requested:{" "}
                          {new Date(request.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    {request.message || "No message provided."}
                  </p>
                  <div className="flex gap-2">
                    <Link to={`/profile/investor/${request.investorId}`}>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </Link>
                    {request.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeclineRequest(request.id)}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {request.status === "accepted" && (
                      <Button size="sm">Start Collaboration</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ userType = "investor" }) => {
  const dashboardContent = {
    investor: {
      title: "Investor Dashboard",
      breadcrumb: "Investment Opportunities",
      description: "Discover and track investment opportunities",
    },
    entrepreneur: {
      title: "Entrepreneur Dashboard",
      breadcrumb: "My Projects",
      description: "Manage your projects and connect with investors",
    },
  };

  const content = dashboardContent[userType];

  return (
    <SidebarProvider>
      <AppSidebar userType={userType} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">{content.title}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{content.breadcrumb}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>{" "}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{content.title}</h1>
            <p className="text-muted-foreground">{content.description}</p>
          </div>

          {userType === "investor" ? (
            <InvestorDashboardContent />
          ) : (
            <EntrepreneurDashboardContent />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;
