import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/", label: "홈", icon: "🫀" },
  { path: "/targets", label: "상대", icon: "💕" },
  { path: "/upload", label: "분석", icon: "📸" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const hideOn = ["/login", "/register"];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-lg">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
