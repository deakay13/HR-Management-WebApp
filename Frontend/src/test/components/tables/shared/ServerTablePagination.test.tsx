import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { ServerTablePagination } from "@/components/table/shared/ServerTablePagination";
import i18n from "@/i18n";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

describe("ServerTablePagination", () => {
  const onPageChangeMock = vi.fn();

  test("renders correctly with default item name", () => {
    render(
      <ServerTablePagination
        totalItems={100}
        totalPages={10}
        currentPage={1}
        onPageChange={onPageChangeMock}
      />
    );
    expect(screen.getByText(/Tổng/)).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText(/mục/)).toBeInTheDocument();
    expect(screen.getByText("1 / 10")).toBeInTheDocument();
  });

  test("renders correctly with custom item name", () => {
    render(
      <ServerTablePagination
        totalItems={50}
        totalPages={5}
        currentPage={2}
        onPageChange={onPageChangeMock}
        itemName="nhân viên"
      />
    );
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText(/nhân viên/)).toBeInTheDocument();
    expect(screen.getByText("2 / 5")).toBeInTheDocument();
  });

  test("previous button disabled on first page", () => {
    render(
      <ServerTablePagination
        totalItems={100}
        totalPages={10}
        currentPage={1}
        onPageChange={onPageChangeMock}
      />
    );
    const prevBtn = screen.getByRole("button", { name: "Trước" });
    expect(prevBtn).toBeDisabled();
    const nextBtn = screen.getByRole("button", { name: "Sau" });
    expect(nextBtn).not.toBeDisabled();
  });

  test("next button disabled on last page", () => {
    render(
      <ServerTablePagination
        totalItems={100}
        totalPages={10}
        currentPage={10}
        onPageChange={onPageChangeMock}
      />
    );
    const nextBtn = screen.getByRole("button", { name: "Sau" });
    expect(nextBtn).toBeDisabled();
  });

  test("clicking previous triggers onPageChange", async () => {
    const user = userEvent.setup();
    render(
      <ServerTablePagination
        totalItems={100}
        totalPages={10}
        currentPage={3}
        onPageChange={onPageChangeMock}
      />
    );
    const prevBtn = screen.getByRole("button", { name: "Trước" });
    await user.click(prevBtn);
    expect(onPageChangeMock).toHaveBeenCalledWith(2);
  });

  test("clicking next triggers onPageChange", async () => {
    const user = userEvent.setup();
    render(
      <ServerTablePagination
        totalItems={100}
        totalPages={10}
        currentPage={3}
        onPageChange={onPageChangeMock}
      />
    );
    const nextBtn = screen.getByRole("button", { name: "Sau" });
    await user.click(nextBtn);
    expect(onPageChangeMock).toHaveBeenCalledWith(4);
  });
});
