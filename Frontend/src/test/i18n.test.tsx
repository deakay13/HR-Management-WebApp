
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { useTranslation, I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Initializing a mock i18n instance strictly for testing
i18n.use(initReactI18next).init({
  lng: "vi",
  fallbackLng: "vi",
  resources: {
    vi: {
      translation: {
        hello: "Xin chào",
        button: "Đổi Ngôn Ngữ"
      }
    },
    en: {
      translation: {
        hello: "Hello",
        button: "Change Language"
      }
    }
  },
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  }
});

const DummyComponent = () => {
  const { t, i18n: i18nInstance } = useTranslation();

  const toggleLanguage = () => {
    i18nInstance.changeLanguage(i18nInstance.language === "vi" ? "en" : "vi");
  };

  return (
    <div>
      <h1 data-testid="greeting-text">{t("hello")}</h1>
      <button data-testid="toggle-btn" onClick={toggleLanguage}>
        {t("button")}
      </button>
    </div>
  );
};

describe("i18n language switching capabilities", () => {
  beforeAll(() => {
    // Ensure we start from 'vi'
    i18n.changeLanguage("vi");
  });

  afterEach(() => {
    // Revert back for consistency
    i18n.changeLanguage("vi");
  });

  it("should render correct initial text strictly based on default language (Vietnamese)", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <DummyComponent />
      </I18nextProvider>
    );

    expect(screen.getByTestId("greeting-text").textContent).toBe("Xin chào");
    expect(screen.getByTestId("toggle-btn").textContent).toBe("Đổi Ngôn Ngữ");
  });

  it("should dynamically change languages without unmounting", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <DummyComponent />
      </I18nextProvider>
    );

    const btn = screen.getByTestId("toggle-btn");
    
    // User clicks the button to change language to English
    await userEvent.click(btn);

    // Wait for the rerender
    await waitFor(() => {
      expect(screen.getByTestId("greeting-text").textContent).toBe("Hello");
      expect(screen.getByTestId("toggle-btn").textContent).toBe("Change Language");
    });
    
    // User clicks again to change language back to Vietnamese
    await userEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByTestId("greeting-text").textContent).toBe("Xin chào");
    });
  });
});
