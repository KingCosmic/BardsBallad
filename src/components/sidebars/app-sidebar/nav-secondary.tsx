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
          <Card className='bg-linear-to-br from-primary/40 to-primary/30 border-primary/70 dark:from-primary/20 dark:to-primary/10 dark:border-primary/30'>
            <CardContent>
              <Badge variant="default" className="mb-2">Beta</Badge>
              <p>We're happy you're using the BardsBallad Beta! If you run into any problems please reach out to us through one of the platforms below!</p>
            </CardContent>
          </Card>
          <ButtonGroup className='mb-2 mt-3'>
            <ButtonGroup>
              <Button
                variant="outline" 
                size="icon" 
                aria-label="Github" 
                onClick={() => window.open('https://github.com/KingCosmic/BardsBallad', '_blank')}
              >
                <IconBrandGithub />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button 
                variant="outline" 
                size="icon" 
                aria-label="Discord" 
                onClick={() => window.open('https://discord.gg/a5qSfxv', '_blank')}
              >
                <IconBrandDiscord />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button 
                variant="outline" 
                size="icon" 
                aria-label="Email" 
                onClick={() => window.location.href = 'mailto:support@bardsballad.com'}
              >
                <IconMail />
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
