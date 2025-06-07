import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { entrepreneursAPI, investorsAPI } from "@/services/api";
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
import {
  FileText,
  DollarSign,
  Building,
  Users,
  Target,
  Briefcase,
} from "lucide-react";

const Profile = ({ userType = "investor" }) => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dashboardLink = `/dashboard/${userType}`;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        let profileData;

        if (userType === "investor") {
          profileData = await investorsAPI.getById(id);
        } else {
          profileData = await entrepreneursAPI.getById(id);
        }

        setProfile(profileData);
      } catch (err) {
        setError("Failed to load profile");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id, userType]);

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar userType={userType} />
        <SidebarInset>
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error || !profile) {
    return (
      <SidebarProvider>
        <AppSidebar userType={userType} />
        <SidebarInset>
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">
                {error || "Profile not found"}
              </p>
              <Link to={dashboardLink}>
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
                  <BreadcrumbLink href={dashboardLink}>
                    {userType === "investor"
                      ? "Investor Dashboard"
                      : "Entrepreneur Dashboard"}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {" "}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {userType === "investor" ? "Investor" : "Entrepreneur"} Profile
            </h1>
            <Link to={dashboardLink}>
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
          {/* Profile Header */}
          <Card className="w-full">
            <CardHeader className="pb-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-xl font-semibold">
                    {profile.avatar ||
                      profile.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") ||
                      "??"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{profile.name}</CardTitle>
                  <CardDescription className="text-lg font-medium text-primary">
                    {userType === "investor"
                      ? profile.company
                      : profile.startupName}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mt-2">
                    {profile.location || "Location not specified"} •
                    {userType === "investor"
                      ? ` ${profile.yearsExperience || 0} years experience`
                      : ` Founded ${profile.foundedYear || "N/A"}`}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Main Content - Bio and Description */}
            <div className="md:col-span-2 space-y-6">
              {/* Bio Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Bio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {profile.description ||
                      profile.profileSnippet ||
                      "No bio available."}
                  </p>
                </CardContent>
              </Card>

              {userType === "entrepreneur" ? (
                <>
                  {/* Startup Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Startup Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Pitch Summary</h4>
                          <p className="text-sm text-muted-foreground">
                            {profile.pitchSummary ||
                              "No pitch summary available."}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-1">Industry</h4>
                            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                              {profile.industry || "Not specified"}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Stage</h4>
                            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                              {profile.stage || "Not specified"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Funding Need */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Funding Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-1">Current Funding</h4>
                          <p className="text-xl font-bold text-green-600">
                            {profile.funding || "$0"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Current Revenue</h4>
                          <p className="text-xl font-bold text-blue-600">
                            {profile.revenue || "$0"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Funding Need</h4>
                        <p className="text-sm text-muted-foreground">
                          Currently seeking Series{" "}
                          {profile.stage?.includes("Series")
                            ? profile.stage.split(" ")[1]
                            : "A"}{" "}
                          funding to scale operations and expand market reach.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pitch Deck Placeholder */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Pitch Deck
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Pitch Deck
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Upload your pitch deck to showcase your startup to
                          potential investors.
                        </p>
                        <Button variant="outline">Upload Pitch Deck</Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                /* Investor Portfolio Companies */
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Portfolio Companies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium mb-1">Portfolio Size</h4>
                          <p className="text-2xl font-bold">
                            {profile.portfolioSize || 0}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Successful Exits</h4>
                          <p className="text-2xl font-bold text-green-600">
                            {profile.successfulExits || 0}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">
                          Investment Specialties
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.specialties?.map((specialty, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                            >
                              {specialty}
                            </span>
                          )) || (
                            <span className="text-sm text-muted-foreground">
                              No specialties listed
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">
                          Recent Portfolio Highlights
                        </h4>
                        <div className="space-y-2">
                          {[1, 2, 3].map((item) => (
                            <div
                              key={item}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div>
                                <p className="font-medium">
                                  Portfolio Company {item}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Series A • HealthTech
                                </p>
                              </div>
                              <span className="text-sm text-green-600">
                                +15% growth
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Stats and Contact */}
            <div className="space-y-6">
              {/* Key Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userType === "investor" ? (
                    <>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold">
                          {profile.portfolioSize || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Portfolio Companies
                        </p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold">
                          {profile.investmentRange || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Investment Range
                        </p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold">
                          {profile.yearsExperience || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Years Experience
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold">
                          {profile.teamSize || 1}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Team Members
                        </p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold">
                          {profile.revenue || "$0"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Annual Revenue
                        </p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold">
                          {profile.funding || "$0"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total Funding
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profile.achievements?.map((achievement, index) => (
                      <div
                        key={index}
                        className="p-2 bg-secondary/50 rounded text-sm"
                      >
                        • {achievement}
                      </div>
                    )) || (
                      <p className="text-sm text-muted-foreground">
                        No achievements listed yet.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Email
                      </p>
                      <p className="text-sm">
                        {profile.contact?.email || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Phone
                      </p>
                      <p className="text-sm">
                        {profile.contact?.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        LinkedIn
                      </p>
                      <p className="text-sm text-blue-600">
                        {profile.contact?.linkedin || "Not provided"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Profile;
