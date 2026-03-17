import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="Light-mode">Light</Label>
            <Switch id="Theme-mode" />
            <Label htmlFor="Dark-mode">Dark</Label>
          </div>
        </div>
      </div>
    </header>
  );
}
