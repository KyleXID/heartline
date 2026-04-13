import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScoreBadge } from "../score-badge";

describe("ScoreBadge", () => {
  it("renders score number", () => {
    render(<ScoreBadge score={72} />);
    expect(screen.getByText("72")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<ScoreBadge score={50} label="관심도" />);
    expect(screen.getByText("관심도")).toBeInTheDocument();
  });

  it("applies heart color for high score", () => {
    const { container } = render(<ScoreBadge score={80} />);
    const badge = container.querySelector("span");
    expect(badge?.className).toContain("bg-heart");
  });

  it("applies warning color for medium score", () => {
    const { container } = render(<ScoreBadge score={50} />);
    const badge = container.querySelector("span");
    expect(badge?.className).toContain("bg-warning");
  });

  it("applies muted color for low score", () => {
    const { container } = render(<ScoreBadge score={20} />);
    const badge = container.querySelector("span");
    expect(badge?.className).toContain("bg-muted");
  });
});
