import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EmotionPoint } from "@/services/analysis";

interface InterestChartProps {
  emotionTimeline: EmotionPoint[];
  className?: string;
}

export function InterestChart({ emotionTimeline, className }: InterestChartProps) {
  const data = emotionTimeline.map((point) => ({
    name: point.phase,
    intensity: point.intensity * 10,
    emotion: point.emotion,
  }));

  if (data.length === 0) return null;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.546 0.245 262.881)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.546 0.245 262.881)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.922 0 0)" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            stroke="oklch(0.556 0 0)"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            stroke="oklch(0.556 0 0)"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0].payload;
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <p className="text-xs font-medium">{item.name}</p>
                  <p className="text-sm text-primary">{item.emotion}</p>
                  <p className="text-xs text-muted-foreground">
                    강도: {item.intensity}%
                  </p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="intensity"
            stroke="oklch(0.546 0.245 262.881)"
            strokeWidth={2}
            fill="url(#colorIntensity)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
