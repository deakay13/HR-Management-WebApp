import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const sidebarItems = [
  "Hợp đồng",
  "Nhân Viên",
  "Phòng Ban",
  "Giờ làm",
  "Bảng Lương",
  "Lương Cơ Bản",
  "Phụ cấp",
  "Khấu trừ",
  "Hỗ trợ",
];

export default function DisplayChilds() {
    const [selected, setSelected] = useState<string[]>([]);
    const toggleItem = (item: string) => {
        setSelected((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
        );
    };
    return (
        <div>
            <h2 className="text-lg font-semibold">Thanh bên</h2>
            <p className="text-sm text-gray-500 mb-4">
                chọn những mục mà muốn ẩn đi ở bên cạnh
            </p>

            <div className="space-y-2">
            {sidebarItems.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                <Checkbox
                    checked={selected.includes(item)}
                    onCheckedChange={() => toggleItem(item)}
                />
                <label>{item}</label>
                </div>
            ))}
            </div>

            <Button className="mt-4">Cập nhật giao diện</Button>
        </div>
    );
};