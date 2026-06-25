"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Shield, Flame, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export { SidebarProvider, SidebarTrigger };

const policeLinks = [
  { href: "/police/national", label: "Policía Nacional" },
  { href: "/police/municipal", label: "Policía Municipal" },
  { href: "/police/all", label: "Todas las Policías" },
];

const fireLinks = [
  { href: "/fire/municipal", label: "Bomberos Municipales" },
  { href: "/fire/volunteer", label: "Bomberos Voluntarios" },
  { href: "/fire/all", label: "Todos los Bomberos" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="px-4 py-4 border-b border-white/20">
        <Link href="/map" className="flex flex-col">
          <span className="text-lg font-bold text-white tracking-wide">
            UBICASURE
          </span>
          <span className="text-xs text-white/60 mt-0.5">
            Guatemala, Guatemala
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-2">
        {/* Map */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/map" />}
                  isActive={pathname === "/map"}
                  className={cn(
                    "text-white/80 hover:text-white hover:bg-white/10",
                    pathname === "/map" && "!bg-white/20 !text-white font-medium"
                  )}
                >
                  <Map className="w-4 h-4" />
                  <span>Mapa General</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Police */}
        <Collapsible defaultOpen>
          <SidebarGroup>
            <SidebarGroupLabel className="text-white/60 text-xs uppercase tracking-wider px-4 py-1">
              <CollapsibleTrigger className="flex w-full items-center gap-2 hover:text-white/80 transition-colors">
                <Shield className="w-3.5 h-3.5 text-blue-300" />
                <span>Policía</span>
                <ChevronDown className="ml-auto w-3.5 h-3.5" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {policeLinks.map((link) => (
                    <SidebarMenuItem key={link.href}>
                      <SidebarMenuButton
                        render={<Link href={link.href} />}
                        isActive={pathname === link.href}
                        className={cn(
                          "text-white/80 hover:text-white hover:bg-white/10 pl-8",
                          pathname === link.href &&
                            "!bg-white/20 !text-white font-medium"
                        )}
                      >
                        {link.label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Fire */}
        <Collapsible defaultOpen>
          <SidebarGroup>
            <SidebarGroupLabel className="text-white/60 text-xs uppercase tracking-wider px-4 py-1">
              <CollapsibleTrigger className="flex w-full items-center gap-2 hover:text-white/80 transition-colors">
                <Flame className="w-3.5 h-3.5 text-red-300" />
                <span>Bomberos</span>
                <ChevronDown className="ml-auto w-3.5 h-3.5" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {fireLinks.map((link) => (
                    <SidebarMenuItem key={link.href}>
                      <SidebarMenuButton
                        render={<Link href={link.href} />}
                        isActive={pathname === link.href}
                        className={cn(
                          "text-white/80 hover:text-white hover:bg-white/10 pl-8",
                          pathname === link.href &&
                            "!bg-white/20 !text-white font-medium"
                        )}
                      >
                        {link.label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  );
}
