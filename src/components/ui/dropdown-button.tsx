import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { VariantProps } from "class-variance-authority"
import { PropsWithChildren } from "react"

export function DropdownButton({ children, label, ...props }: PropsWithChildren<VariantProps<typeof buttonVariants> & { label: string }>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...props}>{label}</Button>
      </DropdownMenuTrigger>
      {children}
    </DropdownMenu>
  )
}