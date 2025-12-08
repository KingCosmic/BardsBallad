import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
  globals: any[]
}

export default function ScriptSidebar({ globals }: Props) {
  return (
    <Sidebar side='right' collapsible='offcanvas' className='h-full min-w-[280px]'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Global Variables</SidebarGroupLabel>
          <Separator className="my-2" />
          <SidebarGroupContent>
            <SidebarMenu>
              {globals.map((global, index) => (
                <SidebarMenuItem key={index} className="py-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold font-mono text-primary">
                        {global.name}
                      </span>
                      <Badge variant="secondary" className="text-xs font-mono">
                        {global.type}{global.isArray ? '[]' : ''}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      No description available
                    </p>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}