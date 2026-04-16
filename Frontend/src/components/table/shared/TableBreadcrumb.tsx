import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface TableBreadcrumbProps {
  /** Tên nhóm (VD: "Danh Mục", "Quản Lý", "Thông Tin") */
  section: string;
  /** Tên trang hiện tại (VD: "Phụ Cấp", "Tài Khoản", "Nhân Viên") */
  page: string;
}

export function TableBreadcrumb({ section, page }: TableBreadcrumbProps) {
  const { t } = useTranslation();

  return (
    <Breadcrumb className="hidden @4xl/main:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/PortalPage/DashBoard">{t("Dashboard")}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t(section)}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t(page)}</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
