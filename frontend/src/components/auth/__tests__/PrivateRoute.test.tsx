import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { PrivateRoute } from "../PrivateRoute";

function renderWithRouter(initialPath = "/protected") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route
            path="/protected"
            element={<div data-testid="protected-content">Protected</div>}
          />
        </Route>
        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("PrivateRoute", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it("shows loading when isLoading is true", () => {
    useAuthStore.setState({ isLoading: true });
    renderWithRouter();
    expect(screen.getByText("LOADING...")).toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", () => {
    useAuthStore.setState({ isAuthenticated: false, isLoading: false });
    renderWithRouter();
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    useAuthStore.setState({
      user: { id: "1", email: "a@b.com", nickname: "test" },
      isAuthenticated: true,
      isLoading: false,
    });
    renderWithRouter();
    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
  });
});
