import { useTheme } from "@/components/providers/theme-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";

export default function General() {
  const { theme, setTheme } = useTheme()

  return (
    <TabsContent value='general'>
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='system'>System</SelectItem>
          <SelectItem value='light'>Light</SelectItem>
          <SelectItem value='dark'>Dark</SelectItem>
        </SelectContent>
      </Select>
    </TabsContent>
  )
}