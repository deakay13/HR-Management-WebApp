import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { TablePagination } from "@/components/table/shared/TablePagination";
import i18n from "@/i18n";

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

describe("TablePagination", () => {
  const mockTable = {
    getState: vi.fn().mockReturnValue({ pagination: { pageIndex: 0, pageSize: 10 } }),
    setPageSize: vi.fn(),
    getPageCount: vi.fn().mockReturnValue(5),
    setPageIndex: vi.fn(),
    getCanPreviousPage: vi.fn().mockReturnValue(false),
    previousPage: vi.fn(),
    nextPage: vi.fn(),
    getCanNextPage: vi.fn().mockReturnValue(true),
  };

  test("renders correctly", () => {
    render(<TablePagination table={mockTable as any} />);
    expect(screen.getByText("số hàng trên mỗi trang")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Trang 1 trên 5")).toBeInTheDocument();
  });

  test("can change page size", async () => {
    const user = userEvent.setup();
    render(<TablePagination table={mockTable as any} />);
    
    const selectTrigger = screen.getByRole("combobox");
    await user.click(selectTrigger);
    
    const option20 = screen.getByText("20");
    await user.click(option20);
    
    expect(mockTable.setPageSize).toHaveBeenCalledWith(20);
  });

  test("can navigate to next and last page", async () => {
    const user = userEvent.setup();
    render(<TablePagination table={mockTable as any} />);
    
    const buttons = screen.getAllByRole("button").slice(-4);
    const nextBtn = buttons[2]; // The chevron right button
    const lastBtn = buttons[3]; // The chevrons right button
    
    await user.click(nextBtn);
    expect(mockTable.nextPage).toHaveBeenCalled();
    
    await user.click(lastBtn);
    expect(mockTable.setPageIndex).toHaveBeenCalledWith(4);
  });

  test("previous buttons are disabled when on first page", () => {
    render(<TablePagination table={mockTable as any} />);
    const buttons = screen.getAllByRole("button").slice(-4);
    const firstBtn = buttons[0];
    const prevBtn = buttons[1];
    
    expect(firstBtn).toBeDisabled();
    expect(prevBtn).toBeDisabled();
  });

  test("can navigate to previous and first page", async () => {
    const user = userEvent.setup();
    const mockTablePage2 = {
      ...mockTable,
      getState: vi.fn().mockReturnValue({ pagination: { pageIndex: 1, pageSize: 10 } }),
      getCanPreviousPage: vi.fn().mockReturnValue(true),
    };

    render(<TablePagination table={mockTablePage2 as any} />);
    
    const buttons = screen.getAllByRole("button").slice(-4);
    const firstBtn = buttons[0];
    const prevBtn = buttons[1];
    
    expect(firstBtn).not.toBeDisabled();
    expect(prevBtn).not.toBeDisabled();
    
    await user.click(prevBtn);
    expect(mockTablePage2.previousPage).toHaveBeenCalled();
    
    await user.click(firstBtn);
    expect(mockTablePage2.setPageIndex).toHaveBeenCalledWith(0);
  });
});
