'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProgressChartProps {
  data: { date: string; reps: number }[]
}

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <Card className="col-span-1 md:col-span-3 border-border/40 glass shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Lernfortschritt (Reps over time)</CardTitle>
      </CardHeader>
      <CardContent className="px-2 md:px-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/0.5)" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px"
                }}
                itemStyle={{ color: "hsl(var(--primary))" }}
              />
              <Line 
                type="monotone" 
                dataKey="reps" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
