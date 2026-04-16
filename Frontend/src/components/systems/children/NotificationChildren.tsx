import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

export default function NotificationChilds() {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-lg font-semibold">{t("Thông báo")}</h2>
      <p className="text-sm text-gray-500 mb-4">{t("Thông báo về...")}</p>

      {/* Radio chọn mức thông báo */}
      <RadioGroup defaultValue="all" className="space-y-2 mb-6">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" />
          <label htmlFor="all">{t("Tất cả tin nhắn")}</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="direct" id="direct" />
          <label htmlFor="direct">{t("Tin nhắn trực tiếp và đề cập")}</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="none" id="none" />
          <label htmlFor="none">{t("Không để thông báo")}</label>
        </div>
      </RadioGroup>

      {/* Email notifications */}
      <h3 className="text-md font-semibold mb-2">{t("Thông báo email")}</h3>
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{t("Email liên lạc")}</p>
            <p className="text-sm text-gray-500">
              {t("Nhận email về hoạt động tài khoản của bạn")}
            </p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{t("Nhận quảng cáo về Email")}</p>
            <p className="text-sm text-gray-500">
              {t("Thông báo về sản phẩm, tính năng mới và nhiều hơn nữa.")}
            </p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{t("Thông báo bảo mật")}</p>
            <p className="text-sm text-gray-500">
              {t("Nhận thông báo mọi hoạt động và bảo mật tài khoản của bạn")}
            </p>
          </div>
          <Switch />
        </div>
      </div>

      <Button className="mt-4">{t("Cập nhật thông báo")}</Button>
    </div>
  );
}
