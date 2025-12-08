import { ScrollAreaProps } from '@radix-ui/react-scroll-area'
import { ScrollArea } from './ui/scroll-area'
import { cn } from '@/lib/utils'

function PageContent({ className, children, ...props }: ScrollAreaProps) {
  return (
    <ScrollArea className={cn(
      'h-[calc(100dvh-var(--header-height)-var(--spacing)*4)] p-4',
      className
    )} {...props}>
      {children}
    </ScrollArea>
  )
}

export default PageContent