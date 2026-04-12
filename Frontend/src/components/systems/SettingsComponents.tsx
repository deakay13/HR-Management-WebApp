import { useState } from "react";
import { Paintbrush, Bell, Monitor } from "lucide-react";
import DisplayChildren from "./children/DisplayChildren";
import NotificationChildren from "./children/NotificationChildren";
import AppearanceChildren from "./children/AppearanceChildren";
const sidebarLinks = [
  { name: "Giao diện", icon: Paintbrush },
  { name: "Thông báo", icon: Bell },
  { name: "Màn hình", icon: Monitor },
];

export default function SettingsComponents() {
  const [active, setActive] = useState("Display");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b p-6">
        <h1 className="text-2xl font-bold">Cài đặt</h1>
        <p className="text-gray-600">Quản lý cài đặt và thiết lập của bạn.</p>
      </header>

      {/* Content area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r p-4">
          <nav className="space-y-2">
            {sidebarLinks.map(({ name, icon: Icon }) => (
              <div
                key={name}
                onClick={() => setActive(name)}
                className={`flex items-center gap-2 cursor-pointer rounded px-2 py-1 ${
                  active === name ? "bg-gray-200 font-semibold" : ""
                }`}>
                <Icon size={18} />
                {name}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {active === "Giao diện" && <AppearanceChildren />}
          {active === "Thông báo" && <NotificationChildren />}
          {active === "Màn hình" && <DisplayChildren />}
        </main>
      </div>
    </div>
  );
}
