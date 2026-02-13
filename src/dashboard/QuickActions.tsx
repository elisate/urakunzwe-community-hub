import { Plus, FileText, Users, Mail } from "lucide-react";
import { Button } from "@/dashboard/ui/button";

const actions = [
  {
    label: "Add Program",
    icon: Plus,
    variant: "gradient" as const,
  },
  {
    label: "Create Report",
    icon: FileText,
    variant: "outline" as const,
  },
  {
    label: "Invite Member",
    icon: Users,
    variant: "outline" as const,
  },
  {
    label: "Send Update",
    icon: Mail,
    variant: "outline" as const,
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant === "gradient" ? "default" : "outline"}
            className={
              action.variant === "gradient"
                ? "gradient-primary border-0 text-primary-foreground hover:opacity-90"
                : ""
            }
          >
            <action.icon className="mr-2 h-4 w-4" />
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
