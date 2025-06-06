import React from "react";
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
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{content.title}</h1>
            <p className="text-muted-foreground">{content.description}</p>
          </div>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                {userType === "investor"
                  ? "Investment Stats"
                  : "Project Overview"}
              </span>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                {userType === "investor" ? "Portfolio" : "Funding Status"}
              </span>
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                {userType === "investor" ? "Recent Opportunities" : "Messages"}
              </span>
            </div>
          </div>{" "}
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min flex items-center justify-center">
            <span className="text-muted-foreground">
              {userType === "investor"
                ? "Investment opportunities and detailed analytics will be displayed here"
                : "Project management tools and investor connections will be displayed here"}
            </span>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;
