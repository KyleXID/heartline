import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TrendPoint {
  date: string;
  score: number;
  nickname: string;
}

interface InterestTrendChartProps {
  data: TrendPoint[];
  className?: string;
}

export function InterestTrendChart({ data, className }: InterestTrendChartProps) {
  if (data.length < 2) return null;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.922 0 0)" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="oklch(0.556 0 0)" />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="oklch(0.556 0 0)" />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0].payload;
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <p className="text-xs">{item.date}</p>
                  <p className="text-sm font-bold text-primary">{item.score}점</p>
                  <p className="text-xs text-muted-foreground">{item.nickname}</p>
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="oklch(0.65 0.25 15)"
            strokeWidth={2}
            dot={{ r: 4, fill: "oklch(0.65 0.25 15)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
