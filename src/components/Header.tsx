import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface Props {
  title: string
  subtitle: string
  hasSidebar?: boolean
}

export default function header({ title, subtitle, hasSidebar }: Props) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" side='left' />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className='flex-col grow'>
          <h1 className="text-base font-medium">{title}</h1>
          <p className='text-sm font-medium text-primary'>{subtitle}</p>
        </div>
        {hasSidebar && (
          <>
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <SidebarTrigger className="-mr-1" side='right' />
          </>
        )}
      </div>
    </header>
  )
}
