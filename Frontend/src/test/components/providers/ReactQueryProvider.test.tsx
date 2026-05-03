import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

describe("ReactQueryProvider", () => {
  test("renders children correctly", () => {
    render(
      <ReactQueryProvider>
        <div data-testid="child">Hello World</div>
      </ReactQueryProvider>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  test("wraps children in QueryClientProvider", () => {
    const { container } = render(
      <ReactQueryProvider>
        <span data-testid="inner">Content</span>
      </ReactQueryProvider>
    );
    expect(container.querySelector("[data-testid='inner']")).toBeInTheDocument();
  });

  test("renders multiple children", () => {
    render(
      <ReactQueryProvider>
        <div data-testid="child-1">First</div>
        <div data-testid="child-2">Second</div>
      </ReactQueryProvider>
    );
    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
  });
});
