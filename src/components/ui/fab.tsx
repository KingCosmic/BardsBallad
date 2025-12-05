import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconPlus } from "@tabler/icons-react"
import { VariantProps } from "class-variance-authority"
import { PropsWithChildren } from "react"

export default function FloatingActionButton({ children, ...props }: PropsWithChildren<VariantProps<typeof buttonVariants>> & { onClick?(): void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='absolute bottom-0 right-4' {...props}>
          <IconPlus />
        </Button>
      </DropdownMenuTrigger>
      {children}
    </DropdownMenu>
  )
}