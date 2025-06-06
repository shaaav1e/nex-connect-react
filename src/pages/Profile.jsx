import React from "react";
import { useParams, Link } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
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

  // Mock profile data - in real app, this would come from API
  const profileData = {
    investor: {
      name: "John Smith",
      title: "Senior Investment Partner",
      company: "Venture Capital Firm",
      location: "San Francisco, CA",
      bio: "Experienced investor with 10+ years in tech startups. Focus on early-stage companies in AI, SaaS, and FinTech.",
      investments: 45,
      portfolio: "$2.5M",
      sectors: ["AI/ML", "SaaS", "FinTech", "HealthTech"],
    },
    entrepreneur: {
      name: "Sarah Johnson",
      title: "Founder & CEO",
      company: "TechStartup Inc.",
      location: "Austin, TX",
      bio: "Serial entrepreneur building innovative solutions in the healthcare technology space. Previously founded two successful startups.",
      projects: 3,
      funding: "$1.2M raised",
      sectors: ["HealthTech", "B2B SaaS", "Mobile Apps"],
    },
  };

  const profile = profileData[userType];
  const dashboardLink = `/dashboard/${userType}`;

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
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarFallback className="text-lg">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl">{profile.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {profile.title} at {profile.company}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile.location}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-sm text-muted-foreground">
                      {profile.bio}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">
                      {userType === "investor"
                        ? "Investment Focus"
                        : "Expertise"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.sectors.map((sector) => (
                        <span
                          key={sector}
                          className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                        >
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userType === "investor" ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Total Investments
                      </span>
                      <span className="text-2xl font-bold">
                        {profile.investments}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Portfolio Value
                      </span>
                      <span className="text-2xl font-bold">
                        {profile.portfolio}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Active Projects
                      </span>
                      <span className="text-2xl font-bold">
                        {profile.projects}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Funding</span>
                      <span className="text-2xl font-bold">
                        {profile.funding}
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
              <CardHeader>
                <CardTitle>
                  {userType === "investor"
                    ? "Recent Investments"
                    : "Recent Projects"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="text-sm">
                        {userType === "investor"
                          ? `Investment ${item}`
                          : `Project ${item}`}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  ))}
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
                    <span className="text-sm">contact@example.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">LinkedIn:</span>
                    <span className="text-sm text-blue-600">
                      /in/{profile.name.toLowerCase().replace(" ", "")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="text-sm">+1 (555) 123-4567</span>
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
