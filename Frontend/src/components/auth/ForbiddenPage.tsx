import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import forbiddenImage from "@/assets/403Forbidden.jpg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ForbiddenPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex min-h-dvh w-full flex-col items-center justify-center gap-6 p-6 md:gap-10 md:p-12">
      {/* Image Container */}
      <div className="w-full max-w-sm md:max-w-2xl overflow-hidden rounded-2xl shadow-xl border border-border/50 bg-muted/20">
        <img
          src={forbiddenImage}
          alt={t("403 Lỗi Phân Quyền")}
          className="w-full h-auto object-cover dark:brightness-[0.85] transition-all hover:scale-105 duration-700 ease-out"
        />
      </div>

      {/* Content Container */}
      <div className="text-center px-4 flex flex-col items-center">
        <h1 className="mb-3 text-4xl md:text-5xl font-black tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {t("403 Forbidden")}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
          {t(
            "Rất tiếc! Bạn không có quyền truy cập vào khu vực này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là một sự nhầm lẫn.",
          )}
        </p>

        {/* Action Button */}
        <Link to="/PortalPage/DashBoard" className="inline-block">
          <Button
            size="lg"
            className="h-12 px-8 rounded-full font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group">
            <IconArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1.5" />
            {t("Về Trang Chủ")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
