import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PixelIcon, type IconName } from "@/components/pixel/PixelIcon";

const NAV_ITEMS: { path: string; label: string; icon: IconName }[] = [
  { path: "/", label: "HOME", icon: "heart" },
  { path: "/targets", label: "TARGET", icon: "star" },
  { path: "/upload", label: "SCAN", icon: "camera" },
  { path: "/history", label: "LOG", icon: "chart" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const hideOn = ["/login", "/register", "/onboarding"];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t-2"
      style={{
        backgroundColor: "var(--pixel-dark)",
        borderColor: "var(--neon-purple)",
      }}
    >
      <div className="mx-auto flex max-w-lg">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-bold transition-colors",
              )}
              style={{
                color: isActive ? "var(--neon-yellow)" : "var(--neon-blue)",
                opacity: isActive ? 1 : 0.6,
              }}
            >
              <PixelIcon name={item.icon} size={2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
