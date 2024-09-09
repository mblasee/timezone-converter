import React from "react"
import { DateTime } from "luxon"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { timezones } from "@/lib/timezones"

interface TimezoneCardProps {
  timezone: {
    zone: string;
    time: DateTime;
    manualTime: string;
  };
  index: number;
  useManualTime: boolean;
  onTimezoneChange: (index: number, newZone: string) => void;
  onManualTimeChange: (index: number, newTime: string) => void;
  onDelete: (index: number) => void;
  showDelete: boolean;
}

export default function TimezoneCard({
  timezone,
  index,
  useManualTime,
  onTimezoneChange,
  onManualTimeChange,
  onDelete,
  showDelete
}: TimezoneCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Select onValueChange={(value) => onTimezoneChange(index, value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={timezone.zone} />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((zone) => (
                <SelectItem key={zone} value={zone}>
                  {zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
        {showDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(index)}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {useManualTime ? (
          <div className="flex items-center justify-center">
            <Input
              type="time"
              value={timezone.manualTime}
              onChange={(e) => onManualTimeChange(index, e.target.value)}
              className="text-center text-2xl font-mono w-32"
            />
          </div>
        ) : (
          <p className="text-3xl font-mono text-center">
            {timezone.time.toFormat("HH:mm:ss")}
          </p>
        )}
        <p className="text-sm text-muted-foreground text-center mt-2">
          {timezone.time.toFormat("EEEE, MMMM d, yyyy")}
        </p>
      </CardContent>
    </Card>
  )
}