import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  subValue?: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function StatsCard({ title, value, subValue, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border/40 shadow-sm glass", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
              {subValue && (
                <span className="text-sm font-medium text-muted-foreground">
                  {subValue}
                </span>
              )}
            </div>
          </div>
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <Icon size={24} />
          </div>
        </div>
        {trend && (
           <div className="mt-4 flex items-center text-xs font-medium">
             <span className={cn(
               "px-2 py-0.5 rounded-full",
               trend === "up" ? "bg-green-500/10 text-green-500" : 
               trend === "down" ? "bg-red-500/10 text-red-500" : 
               "bg-muted text-muted-foreground"
             )}>
               {trend === "up" ? "Improving" : trend === "down" ? "Needs work" : "Steady"}
             </span>
           </div>
        )}
      </CardContent>
    </Card>
  )
}
