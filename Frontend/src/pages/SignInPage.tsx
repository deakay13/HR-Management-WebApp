import { SignInFrom } from "@/components/auth/SignIn";
import { useEffect } from "react";
import { useTheme } from "@/components/systems/ThemeProvider";

const SignInPage = () => {
  const { theme } = useTheme();

  useEffect(() => {
    const root = window.document.documentElement;
    // Sử dụng setTimeout để đảm bảo đoạn code này chạy SAU useEffect của ThemeProvider (Parent component)
    const timeout = setTimeout(() => {
      root.classList.remove("dark", "light");
      root.classList.add("light");
    }, 10);

    return () => {
      clearTimeout(timeout);
      // Khôi phục lại theme cũ khi rời khỏi trang đăng nhập (sau khi login thành công)
      root.classList.remove("light", "dark");
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    };
  }, [theme]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-(image:--gradient-purple) p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignInFrom />
      </div>
    </div>
  );
};

export default SignInPage;
