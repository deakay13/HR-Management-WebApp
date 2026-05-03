import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { TableColumnFilter } from "@/components/table/shared/TableColumnFilter";
import i18n from "@/i18n";


vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

describe("TableColumnFilter", () => {
  const mockTable = {
    getAllColumns: vi.fn().mockReturnValue([
      {
        id: "col1",
        accessorFn: () => {},
        getCanHide: () => true,
        getIsVisible: () => true,
        toggleVisibility: vi.fn(),
      },
      {
        id: "col2",
        accessorFn: () => {},
        getCanHide: () => true,
        getIsVisible: () => true,
        toggleVisibility: vi.fn(),
      },
      {
        id: "col3",
        accessorFn: () => {},
        getCanHide: () => true,
        getIsVisible: () => true,
        toggleVisibility: vi.fn(),
      },
      {
        id: "col4",
        accessorFn: () => {},
        getCanHide: () => true,
        getIsVisible: () => true,
        toggleVisibility: vi.fn(),
      },
    ]),
  };

  test("renders correctly", () => {
    render(<TableColumnFilter table={mockTable as any} />);
    expect(screen.getByText("Lọc")).toBeInTheDocument();
  });

  test("shows dropdown menu with columns on click", async () => {
    const user = userEvent.setup();
    render(<TableColumnFilter table={mockTable as any} />);
    
    const trigger = screen.getByRole("button", { name: /lọc/i });
    await user.click(trigger);
    
    expect(screen.getByRole("menu")).toBeInTheDocument();
    const items = screen.getAllByRole("menuitemcheckbox");
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent("col1"); // Assuming no mapped label for col1
  });

  test("toggles column visibility", async () => {
    const user = userEvent.setup();
    render(<TableColumnFilter table={mockTable as any} />);
    
    const trigger = screen.getByRole("button", { name: /lọc/i });
    await user.click(trigger);
    
    const items = screen.getAllByRole("menuitemcheckbox");
    await user.click(items[0]);
    
    const columns = mockTable.getAllColumns();
    expect(columns[0].toggleVisibility).toHaveBeenCalledWith(false);
  });

  test("prevents hiding if less than 3 columns are visible", async () => {
    const user = userEvent.setup();
    
    const mockTableLimited = {
      getAllColumns: vi.fn().mockReturnValue([
        {
          id: "col1",
          accessorFn: () => {},
          getCanHide: () => true,
          getIsVisible: () => true,
          toggleVisibility: vi.fn(),
        },
        {
          id: "col2",
          accessorFn: () => {},
          getCanHide: () => true,
          getIsVisible: () => true,
          toggleVisibility: vi.fn(),
        },
        {
          id: "col3",
          accessorFn: () => {},
          getCanHide: () => true,
          getIsVisible: () => false,
          toggleVisibility: vi.fn(),
        },
      ]),
    };

    render(<TableColumnFilter table={mockTableLimited as any} />);
    
    const trigger = screen.getByRole("button", { name: /lọc/i });
    await user.click(trigger);
    
    const items = screen.getAllByRole("menuitemcheckbox");
    // Click on col1 to hide it, but visible length is 2, so it shouldn't hide
    await user.click(items[0]);
    
    const columns = mockTableLimited.getAllColumns();
    expect(columns[0].toggleVisibility).not.toHaveBeenCalled();
  });
});
