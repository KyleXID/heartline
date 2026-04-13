import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Loading } from "../loading";

describe("Loading", () => {
  it("renders default text", () => {
    render(<Loading />);
    expect(screen.getByText("불러오는 중...")).toBeInTheDocument();
  });

  it("renders custom text", () => {
    render(<Loading text="분석 중..." />);
    expect(screen.getByText("분석 중...")).toBeInTheDocument();
  });
});
