import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export default function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <main className="mx-auto w-full max-w-lg flex-1 pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
