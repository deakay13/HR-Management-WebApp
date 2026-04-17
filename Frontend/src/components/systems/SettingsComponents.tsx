import { useState } from "react";
import { IconPalette, IconBell, IconDeviceDesktop } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import DisplayChildren from "./children/DisplayChildren";
import NotificationChildren from "./children/NotificationChildren";
import AppearanceChildren from "./children/AppearanceChildren";
const sidebarLinks = [
  { name: "Giao diện", icon: IconPalette },
  { name: "Thông báo", icon: IconBell },
  { name: "Màn hình", icon: IconDeviceDesktop },
];

export default function SettingsComponents() {
  const { t } = useTranslation();
  const [active, setActive] = useState("Giao diện");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b p-6">
        <h1 className="text-2xl font-bold">{t("Cài đặt")}</h1>
        <p className="text-gray-600">{t("Quản lý cài đặt và thiết lập của bạn.")}</p>
      </header>

      {/* Content area */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r p-4">
          <nav className="flex overflow-x-auto space-x-2 md:flex-col md:space-x-0 md:space-y-2 pb-2 md:pb-0">
            {sidebarLinks.map(({ name, icon: Icon }) => (
              <div
                key={name}
                onClick={() => setActive(name)}
                className={`flex flex-shrink-0 items-center gap-2 cursor-pointer rounded px-3 py-2 transition-colors ${
                  active === name 
                    ? "bg-primary text-primary-foreground font-semibold" 
                    : "hover:bg-primary hover:text-primary-foreground"
                }`}>
                <Icon size={18} />
                {t(name)}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 pb-20">
          {active === "Giao diện" && <AppearanceChildren />}
          {active === "Thông báo" && <NotificationChildren />}
          {active === "Màn hình" && <DisplayChildren />}
        </main>
      </div>
    </div>
  );
}
