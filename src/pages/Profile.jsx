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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Profile</h1>
            <Link to={dashboardLink}>
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Profile Overview Card */}
            <Card className="md:col-span-2">
              {" "}
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarFallback className="text-lg">
                    {profile.avatar ||
                      profile.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") ||
                      "??"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl">{profile.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {userType === "investor"
                      ? `${profile.company}`
                      : `${profile.startupName}`}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile.location || "Location not specified"}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-sm text-muted-foreground">
                      {userType === "investor"
                        ? profile.description || profile.profileSnippet
                        : profile.description || profile.pitchSummary}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">
                      {userType === "investor"
                        ? "Investment Focus"
                        : "Industry & Stage"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {userType === "investor" ? (
                        profile.specialties?.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                          >
                            {specialty}
                          </span>
                        ))
                      ) : (
                        <>
                          <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                            {profile.industry}
                          </span>
                          <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                            {profile.stage}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>{" "}
              <CardContent className="space-y-4">
                {userType === "investor" ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Portfolio Size
                      </span>
                      <span className="text-2xl font-bold">
                        {profile.portfolioSize || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Investment Range
                      </span>
                      <span className="text-2xl font-bold">
                        {profile.investmentRange || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Years Experience
                      </span>
                      <span className="text-2xl font-bold">
                        {profile.yearsExperience || 0}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Team Size</span>
                      <span className="text-2xl font-bold">
                        {profile.teamSize || 1}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Revenue</span>
                      <span className="text-2xl font-bold">
                        {profile.revenue || "$0"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Funding</span>
                      <span className="text-2xl font-bold">
                        {profile.funding || "$0"}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional sections */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              {" "}
              <CardHeader>
                <CardTitle>
                  {userType === "investor"
                    ? "Achievements"
                    : "Key Achievements"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profile.achievements?.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="text-sm">{achievement}</span>
                    </div>
                  )) || (
                    <p className="text-sm text-muted-foreground">
                      No achievements listed yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">
                      {profile.contact?.email || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="text-sm">
                      {profile.contact?.phone || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">LinkedIn:</span>
                    <span className="text-sm text-blue-600">
                      {profile.contact?.linkedin || "Not provided"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Profile;
