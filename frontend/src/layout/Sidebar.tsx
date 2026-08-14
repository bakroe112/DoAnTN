"use client"

/**
 * AppSidebar — primary navigation sidebar for ElderCare AI.
 *
 * Uses the shadcn/ui Sidebar primitive with HugeIcons (project-standard icon library).
 * Nav items are intentionally unlinked until their respective pages are implemented.
 *
 * Keyboard shortcut: Ctrl/Cmd + B toggles the sidebar (wired up inside SidebarProvider).
 */

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
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/src/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CctvCameraIcon,
  Chat01Icon,
  DashboardSquare01Icon,
  UserAccountIcon,
  BadgeIcon,
  CreditCardIcon,
  Notification01Icon,
  Logout01Icon,
  UnfoldMoreIcon,
  CaduceusIcon,
} from "@hugeicons/core-free-icons"

/** Navigation items — href will be populated once pages are created. */
const navItems = [
  {
    label: "Dashboard",
    icon: DashboardSquare01Icon,
    href: "#",
  },
  {
    label: "Chat",
    icon: Chat01Icon,
    href: "#",
  },
  {
    label: "Camera Check",
    icon: CctvCameraIcon,
    href: "#",
  },
  {
    label: "Personal Info",
    icon: UserAccountIcon,
    href: "#",
  },
]

/** Mock user data — replace with real auth context when ready. */
const currentUser = {
  name: "Nguyen Van A",
  email: "user@eldercare.ai",
  avatar: "",
}

function NavUser() {
  const { isMobile } = useSidebar()
  const user = currentUser

  // Initials fallback derived from display name
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <HugeiconsIcon icon={UnfoldMoreIcon} />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* User info header */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Account actions */}
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon icon={BadgeIcon} strokeWidth={1.5} />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={CreditCardIcon} strokeWidth={1.5} />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Notification01Icon} strokeWidth={1.5} />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Sign out */}
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Logout01Icon} strokeWidth={1.5} />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

// ---------------------------------------------------------------------------
// AppSidebar
// ---------------------------------------------------------------------------

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* Brand header — shows app name when expanded, collapses to a dot when icon-only */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1 py-1 group-data-[collapsible=icon]:hidden">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <HugeiconsIcon icon={CaduceusIcon} className="size-4" />
          </div>
          <span
            className="text-sidebar-primary text-status font-semibold tracking-tight"
            aria-label="ElderCare AI"
          >
            ElderCare AI
          </span>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    aria-label={item.label}
                  >
                    <HugeiconsIcon icon={item.icon} strokeWidth={1.5} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User footer */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      {/* Drag rail to resize / collapse the sidebar */}
      <SidebarRail />
    </Sidebar>
  )
}
