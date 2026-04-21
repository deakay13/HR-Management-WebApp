
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useTheme } from "../ThemeProvider";
import { IconSun, IconMoon, IconDeviceDesktop } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export default function AppearanceChilds() {
  const { theme, setTheme, language, setLanguage } = useTheme();
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-lg font-semibold">{t("Tuỳ chỉnh giao diện")}</h2>
      <p className="text-sm text-gray-500 mb-6">
        {t("Chọn font chữ và theme cho dashboard.")}
      </p>

      {/* Language */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">{t("Ngôn ngữ")}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {t("Lựa chọn ngôn ngữ bạn muốn sử dụng cho hệ thống.")}
        </p>
        <Select value={language} onValueChange={(val) => setLanguage(val as Parameters<typeof setLanguage>[0])}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Chọn ngôn ngữ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vi">Vietnamese</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Theme */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">{t("Chủ đề")}</h3>
        <div className="flex gap-4">
          <Card
            className={`p-6 cursor-pointer w-32 flex flex-col items-center gap-2 transition-all ${
              theme === "light"
                ? "bg-primary text-primary-foreground font-semibold"
                : "hover:bg-primary/10"
            }`}
            onClick={() => setTheme("light")}>
            <IconSun className="w-8 h-8" />
            <span>{t("Sáng")}</span>
          </Card>
          <Card
            className={`p-6 cursor-pointer w-32 flex flex-col items-center gap-2 transition-all ${
              theme === "dark"
                ? "bg-primary text-primary-foreground font-semibold"
                : "hover:bg-primary/10"
            }`}
            onClick={() => setTheme("dark")}>
            <IconMoon className="w-8 h-8" />
            <span>{t("Tối")}</span>
          </Card>
          <Card
            className={`p-6 cursor-pointer w-32 flex flex-col items-center gap-2 transition-all ${
              theme === "system"
                ? "bg-primary text-primary-foreground font-semibold"
                : "hover:bg-primary/10"
            }`}
            onClick={() => setTheme("system")}>
            <IconDeviceDesktop className="w-8 h-8" />
            <span>{t("Hệ thống")}</span>
          </Card>
        </div>
      </div>
    </div>
  );
}
