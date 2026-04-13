import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto max-w-lg">
        <Outlet />
      </main>
    </div>
  );
}
