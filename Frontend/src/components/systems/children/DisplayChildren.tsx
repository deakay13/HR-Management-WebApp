import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const sidebarItemKeys = [
  "Hợp Đồng",
  "Nhân Viên",
  "Phòng Ban",
  "Giờ Làm",
  "Bảng Lương",
  "Lương Cơ Bản",
  "Phụ Cấp",
  "Khấu Trừ",
  "Hỗ trợ",
];

export default function DisplayChilds() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>([]);
  const toggleItem = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };
  return (
    <div>
      <h2 className="text-lg font-semibold">{t("Thanh bên")}</h2>
      <p className="text-sm text-gray-500 mb-4">
        {t("chọn những mục mà muốn ẩn đi ở bên cạnh")}
      </p>

      <div className="space-y-2">
        {sidebarItemKeys.map((key) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              checked={selected.includes(key)}
              onCheckedChange={() => toggleItem(key)}
            />
            <label>{t(key)}</label>
          </div>
        ))}
      </div>

      <Button className="mt-4">{t("Cập nhật giao diện")}</Button>
    </div>
  );
}
