import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "gradient";
}

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-medium",
        variant === "gradient"
          ? "gradient-primary border-transparent text-primary-foreground"
          : "border-border bg-card hover:border-primary/20"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p
            className={cn(
              "text-sm font-medium",
              variant === "gradient" ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {description && (
            <p
              className={cn(
                "text-sm",
                variant === "gradient" ? "text-primary-foreground/70" : "text-muted-foreground"
              )}
            >
              {description}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1 text-sm">
              <span
                className={cn(
                  "font-medium",
                  variant === "gradient"
                    ? "text-primary-foreground"
                    : trend.isPositive
                    ? "text-green-600"
                    : "text-destructive"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span
                className={cn(
                  variant === "gradient" ? "text-primary-foreground/70" : "text-muted-foreground"
                )}
              >
                from last month
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110",
            variant === "gradient"
              ? "bg-primary-foreground/20"
              : "bg-primary/10"
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6",
              variant === "gradient" ? "text-primary-foreground" : "text-primary"
            )}
          />
        </div>
      </div>
    </div>
  );
}