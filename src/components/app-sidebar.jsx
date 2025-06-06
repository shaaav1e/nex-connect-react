import * as React from "react";
import { authAPI } from "@/services/api";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  DollarSign,
  Users,
  Briefcase,
  TrendingUp,
  FileText,
  MessageSquare,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Data for different user types
const getDataForUserType = (userType) => {
  // Get current user from localStorage
  const currentUser = authAPI.getCurrentUser();

  const commonData = {
    user: {
      name: currentUser?.name || "User",
      email: currentUser?.email || "user@example.com",
      avatar: currentUser?.avatar || "/avatars/default.jpg",
    },
    teams: [
      {
        name: userType === "investor" ? "Investment Hub" : "Startup Hub",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: userType === "investor" ? "Portfolio Manager" : "Project Manager",
        logo: AudioWaveform,
        plan: "Pro",
      },
    ],
  };

  if (userType === "investor") {
    return {
      ...commonData,
      navMain: [
        {
          title: "Dashboard",
          url: "#",
          icon: SquareTerminal,
          isActive: true,
          items: [
            {
              title: "Overview",
              url: "#",
            },
            {
              title: "Portfolio",
              url: "#",
            },
            {
              title: "Analytics",
              url: "#",
            },
          ],
        },
        {
          title: "Opportunities",
          url: "#",
          icon: TrendingUp,
          items: [
            {
              title: "Browse Startups",
              url: "#",
            },
            {
              title: "Saved Opportunities",
              url: "#",
            },
            {
              title: "Due Diligence",
              url: "#",
            },
          ],
        },
        {
          title: "Investments",
          url: "#",
          icon: DollarSign,
          items: [
            {
              title: "Active Investments",
              url: "#",
            },
            {
              title: "Transaction History",
              url: "#",
            },
            {
              title: "Performance",
              url: "#",
            },
          ],
        },
        {
          title: "Messages",
          url: "#",
          icon: MessageSquare,
          items: [
            {
              title: "Inbox",
              url: "#",
            },
            {
              title: "Entrepreneurs",
              url: "#",
            },
          ],
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings2,
          items: [
            {
              title: "Profile",
              url: "#",
            },
            {
              title: "Investment Preferences",
              url: "#",
            },
            {
              title: "Notifications",
              url: "#",
            },
          ],
        },
      ],
      projects: [
        {
          name: "Tech Startups",
          url: "#",
          icon: Frame,
        },
        {
          name: "Healthcare",
          url: "#",
          icon: PieChart,
        },
        {
          name: "FinTech",
          url: "#",
          icon: DollarSign,
        },
      ],
    };
  } else {
    // entrepreneur data
    return {
      ...commonData,
      navMain: [
        {
          title: "Dashboard",
          url: "#",
          icon: SquareTerminal,
          isActive: true,
          items: [
            {
              title: "Overview",
              url: "#",
            },
            {
              title: "Metrics",
              url: "#",
            },
            {
              title: "Goals",
              url: "#",
            },
          ],
        },
        {
          title: "My Projects",
          url: "#",
          icon: Briefcase,
          items: [
            {
              title: "Active Projects",
              url: "#",
            },
            {
              title: "Drafts",
              url: "#",
            },
            {
              title: "Completed",
              url: "#",
            },
          ],
        },
        {
          title: "Funding",
          url: "#",
          icon: DollarSign,
          items: [
            {
              title: "Funding Rounds",
              url: "#",
            },
            {
              title: "Investor Matches",
              url: "#",
            },
            {
              title: "Pitch Deck",
              url: "#",
            },
          ],
        },
        {
          title: "Network",
          url: "#",
          icon: Users,
          items: [
            {
              title: "Investors",
              url: "#",
            },
            {
              title: "Mentors",
              url: "#",
            },
            {
              title: "Partners",
              url: "#",
            },
          ],
        },
        {
          title: "Resources",
          url: "#",
          icon: BookOpen,
          items: [
            {
              title: "Guides",
              url: "#",
            },
            {
              title: "Templates",
              url: "#",
            },
            {
              title: "Legal Docs",
              url: "#",
            },
          ],
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings2,
          items: [
            {
              title: "Profile",
              url: "#",
            },
            {
              title: "Company Info",
              url: "#",
            },
            {
              title: "Notifications",
              url: "#",
            },
          ],
        },
      ],
      projects: [
        {
          name: "Current Startup",
          url: "#",
          icon: Frame,
        },
        {
          name: "Side Projects",
          url: "#",
          icon: Map,
        },
        {
          name: "Ideas",
          url: "#",
          icon: Bot,
        },
      ],
    };
  }
};

export function AppSidebar({ userType = "investor", ...props }) {
  const data = getDataForUserType(userType);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
