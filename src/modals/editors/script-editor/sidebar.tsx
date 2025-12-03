import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

interface Props {
  globals: any[]
}

export default function ScriptSidebar({ globals }: Props) {
  return (
    <Sidebar side='right'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {globals.map((global, index) => (
                <SidebarMenuItem key={index}>
                  <div className="text-primary text-sm font-semibold font-mono mb-1">
                    {global.name}
                  </div>
                  <div className="text-muted text-xs font-mono">
                    {global.type}{global.isArray ? '[]' : ''}
                  </div>
                  <div className="text-[11px] mt-1.5 leading-snug">
                    coming soon~
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