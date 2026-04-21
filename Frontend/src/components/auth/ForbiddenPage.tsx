import { IconLock } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "1.5rem",
        background: "linear-gradient(135deg, var(--background) 0%, color-mix(in srgb, var(--primary) 5%, var(--background)) 100%)",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {/* Icon container */}
      <div
        style={{
          width: "96px",
          height: "96px",
          borderRadius: "50%",
          background: "color-mix(in srgb, var(--primary) 12%, transparent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 0 16px color-mix(in srgb, var(--primary) 6%, transparent)",
          animation: "pulse 2.5s ease-in-out infinite",
        }}
      >
        <IconLock
          size={48}
          style={{ color: "var(--primary)", strokeWidth: 1.5 }}
        />
      </div>

      {/* Error code */}
      <p
        style={{
          fontSize: "0.875rem",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--primary)",
          margin: 0,
        }}
      >
        Lỗi 403
      </p>

      {/* Title */}
      <h1
        style={{
          fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
          fontWeight: 700,
          margin: 0,
          color: "var(--foreground)",
          lineHeight: 1.2,
        }}
      >
        Không Có Quyền Truy Cập
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: "1rem",
          color: "var(--muted-foreground)",
          maxWidth: "420px",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        Bạn không có quyền xem trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là nhầm lẫn.
      </p>

      {/* Back button */}
      <Link
        to="/PortalPage/DashBoard"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.625rem 1.5rem",
          borderRadius: "0.5rem",
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          fontWeight: 600,
          fontSize: "0.9rem",
          textDecoration: "none",
          transition: "opacity 0.2s ease",
          marginTop: "0.5rem",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        ← Quay về Trang Tổng Quát
      </Link>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 16px color-mix(in srgb, var(--primary) 6%, transparent); }
          50% { box-shadow: 0 0 0 24px color-mix(in srgb, var(--primary) 2%, transparent); }
        }
      `}</style>
    </div>
  );
}
