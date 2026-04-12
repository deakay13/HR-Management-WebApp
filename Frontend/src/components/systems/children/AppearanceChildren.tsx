import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export default function AppearanceChilds() {
    const [theme, setTheme] = useState("light");
    const [font, setFont] = useState("Inter");

    return (
        <div>
        <h2 className="text-lg font-semibold">Tuỳ chỉnh giao diện</h2>
        <p className="text-sm text-gray-500 mb-6">
            Chọn font chữ và theme cho dashboard.
        </p>

        {/* Font */}
        <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Kiểu chữ</h3>
            <p className="text-sm text-gray-500 mb-2">
            lựa chọn kiểu chữ bạn muốn sử dụng cho hệ thống.
            </p>
            <Select value={font} onValueChange={setFont}>
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="OpenSans">Open Sans</SelectItem>
            </SelectContent>
            </Select>
        </div>

        {/* Theme */}
        <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Chủ đề</h3>
            <div className="flex gap-4">
            <Card
                className={`p-6 cursor-pointer w-40 text-center ${
                theme === "light" ? "ring-2 ring-black" : ""
                }`}
                onClick={() => setTheme("light")}>
                Sáng
            </Card>
            <Card
                className={`p-6 cursor-pointer w-40 text-center ${
                theme === "dark" ? "ring-2 ring-black" : ""
                }`}
                onClick={() => setTheme("dark")}>
                Tối
            </Card>
            </div>
        </div>

        <Button className="mt-4">Cập nhật tuỳ chọn</Button>
        </div>
    );
}
