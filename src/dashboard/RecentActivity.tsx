import { Heart, Users, Newspaper, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "donation",
    title: "New donation received",
    description: "$500 from Anonymous Donor",
    time: "2 minutes ago",
    icon: DollarSign,
  },
  {
    id: 2,
    type: "team",
    title: "New team member joined",
    description: "Sarah Johnson - Program Manager",
    time: "1 hour ago",
    icon: Users,
  },
  {
    id: 3,
    type: "news",
    title: "News article published",
    description: "Community Outreach Program Success",
    time: "3 hours ago",
    icon: Newspaper,
  },
  {
    id: 4,
    type: "impact",
    title: "Impact milestone reached",
    description: "10,000 lives impacted this quarter",
    time: "5 hours ago",
    icon: Heart,
  },
  {
    id: 5,
    type: "donation",
    title: "Monthly goal achieved",
    description: "Raised $25,000 for clean water initiative",
    time: "1 day ago",
    icon: DollarSign,
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-6 text-lg font-semibold">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={cn(
              "flex items-start gap-4 pb-4",
              index !== activities.length - 1 && "border-b border-border"
            )}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
              <activity.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
