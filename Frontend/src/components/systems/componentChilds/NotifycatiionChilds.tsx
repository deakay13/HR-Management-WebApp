import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

export default function NotifycatiionChilds() {
    return (
        <div>
            <h2 className="text-lg font-semibold">Thông báo</h2>
            <p className="text-sm text-gray-500 mb-4">Notify me about…</p>

            {/* Radio chọn mức thông báo */}
            <RadioGroup defaultValue="all" className="space-y-2 mb-6">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <label htmlFor="all">tất cả tin nhắn</label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="direct" id="direct" />
                <label htmlFor="direct">Tin nhắn trực tiếp và đề cập</label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <label htmlFor="none">Không để thông báo</label>
            </div>
            </RadioGroup>

            {/* Email notifications */}
            <h3 className="text-md font-semibold mb-2">Thông báo email</h3>
            <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
                <div>
                <p className="font-medium">Email liên lạc</p>
                <p className="text-sm text-gray-500">
                    Nhận email về hoạt động tài khoản của bạn
                </p>
                </div>
                <Switch />
            </div>

            <div className="flex items-center justify-between">
                <div>
                <p className="font-medium">Nhận quảng cáo về Email</p>
                <p className="text-sm text-gray-500">
                    Thông báo về sản phẩm, tính năng mới và nhiều hơn nữa.
                </p>
                </div>
                <Switch />
            </div>

            <div className="flex items-center justify-between">
                <div>
                <p className="font-medium">Thông báo bảo mật</p>
                <p className="text-sm text-gray-500">
                    Nhận thông báo mọi hoạt động và bảo mật tài khoản của bạn
                </p>
                </div>
                <Switch />
            </div>
            </div>

            <Button className="mt-4">Cập nhật thông báo</Button>
        </div>
    );
}
