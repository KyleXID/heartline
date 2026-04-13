import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export default function RootLayout() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto max-w-lg pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
