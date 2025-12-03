"use client"

import * as React from "react"
import { IconBrandDiscord, IconBrandGithub, IconMail } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function NavSecondary({
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <Card className="w-full max-w-sm">
            <CardContent>
              <Badge variant="default" className="mb-2">Beta</Badge>
              <p>We're happy you're using the BardsBallad Beta! If you run into any problems please reach out to us through one of the platforms below!</p>
            </CardContent>
          </Card>
          <ButtonGroup className='my-2'>
            <ButtonGroup className="hidden sm:flex">
              <Button variant="outline" size="icon" aria-label="Github">
                <IconBrandGithub />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline" size="icon" aria-label="Discord">
                <IconBrandDiscord />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline" size="icon" aria-label="Email">
                <IconMail />
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
