"use client"

import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebarProvider,
} from "@/components/ui/sidebar"
import { NavLink } from "react-router"
import { useCallback } from 'react'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const { setOpenMobile } = useSidebarProvider('left')

  const handleClick = useCallback(() => setOpenMobile(false), [setOpenMobile])

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink id={`nav-${item.title}`} to={item.url} onClick={handleClick}>
                {({ isActive }) => (
                  <SidebarMenuButton tooltip={item.title} className={isActive ? 'bg-accent text-accent-foreground' : ''}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
