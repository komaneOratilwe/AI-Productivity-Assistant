import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  Search,
  Bot,
  Sparkles,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export const navItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email-generator", icon: Mail },
  { title: "Meeting Summarizer", url: "/meeting-summarizer", icon: NotebookPen },
  { title: "Task Planner", url: "/task-planner", icon: ListChecks },
  { title: "Research Assistant", url: "/research-assistant", icon: Search },
  { title: "AI Chatbot", url: "/chatbot", icon: Bot },
] as const;

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex min-w-0 items-center gap-2.5 px-1 py-2">
          <div className="hero-gradient grid size-9 shrink-0 place-items-center rounded-xl text-primary-foreground">
            <Sparkles className="size-4.5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">
                Assistly AI
              </p>
              <p className="truncate text-xs text-muted-foreground">Workplace productivity</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link
                        to={item.url}
                        onClick={() => setOpenMobile(false)}
                        className="flex items-center gap-2.5"
                      >
                        <item.icon className="size-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="border-t border-sidebar-border">
          <div className="rounded-xl bg-primary-soft p-3">
            <p className="text-xs font-semibold text-accent-foreground">Pro workspace</p>
            <p className="mt-1 text-xs text-muted-foreground">
              1,240 of 5,000 AI actions used this month.
            </p>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
