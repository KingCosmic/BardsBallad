import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconPlus } from "@tabler/icons-react"
import { VariantProps } from "class-variance-authority"
import { PropsWithChildren } from "react"

export default function FloatingActionButton({ children, onClick, ...props }: PropsWithChildren<VariantProps<typeof buttonVariants>> & { onClick?(): void }) {
  
  if (onClick) {
    return (
      <Button variant='outline' size='icon' className='absolute bottom-4 right-4' onClick={onClick} {...props}>
        <IconPlus />
      </Button>
    )
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='absolute bottom-4 right-4' {...props}>
          <IconPlus />
        </Button>
      </DropdownMenuTrigger>
      {children}
    </DropdownMenu>
  )
}