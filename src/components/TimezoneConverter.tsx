"use client"

import React, { useState, useEffect } from "react"
import { DateTime } from "luxon"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import TimezoneCard from "./TimezoneCard"

interface TimezoneInfo {
  zone: string;
  time: DateTime;
  manualTime: string;
}

export default function TimezoneConverter() {
  const [selectedTimezones, setSelectedTimezones] = useState<TimezoneInfo[]>([
    { zone: "America/New_York", time: DateTime.local().setZone("America/New_York"), manualTime: "" },
    { zone: "Europe/London", time: DateTime.local().setZone("Europe/London"), manualTime: "" },
  ])
  const [useManualTime, setUseManualTime] = useState(false)
  const [referenceZone, setReferenceZone] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedTimezones((prevTimezones) =>
        prevTimezones.map((tz) => ({
          ...tz,
          time: DateTime.local().setZone(tz.zone),
          manualTime: useManualTime ? tz.manualTime : DateTime.local().setZone(tz.zone).toFormat("HH:mm"),
        }))
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [useManualTime])

  const handleAddTimezone = () => {
    const newZone = "UTC"
    const newTime = DateTime.local().setZone(newZone)
    let newManualTime = newTime.toFormat("HH:mm")
  
    if (useManualTime && referenceZone) {
      const referenceTimezone = selectedTimezones.find(tz => tz.zone === referenceZone)
      if (referenceTimezone) {
        const [hours, minutes] = referenceTimezone.manualTime.split(':').map(Number)
        newManualTime = newTime.set({ hour: hours, minute: minutes }).toFormat("HH:mm")
      }
    }
  
    setSelectedTimezones([
      ...selectedTimezones,
      { zone: newZone, time: newTime, manualTime: newManualTime },
    ])
  } 

  const handleDeleteTimezone = (index: number) => {
    if (selectedTimezones.length > 1) {
      setSelectedTimezones(selectedTimezones.filter((_, i) => i !== index))
    }
  }

  const handleTimezoneChange = (index: number, newZone: string) => {
    const newTime = DateTime.local().setZone(newZone)
    setSelectedTimezones((prevTimezones) =>
      prevTimezones.map((tz, i) =>
        i === index
          ? {
              ...tz,
              zone: newZone,
              time: newTime,
              manualTime: useManualTime ? newTime.toFormat("HH:mm") : "",
            }
          : tz
      )
    )
  }

  const handleManualTimeChange = (index: number, newTime: string) => {
    const updatedTimezones = selectedTimezones.map((tz, i) => {
      if (i === index) {
        return { ...tz, manualTime: newTime }
      }
      return tz
    })
    setSelectedTimezones(updatedTimezones)
    setReferenceZone(selectedTimezones[index].zone)
    updateAllTimezones(updatedTimezones[index].zone, newTime)
  }

  const updateAllTimezones = (referenceZone: string, referenceTime: string) => {
    if (!referenceTime) return

    const [hours, minutes] = referenceTime.split(':').map(Number)
    const referenceDateTime = DateTime.local().setZone(referenceZone).set({ hour: hours, minute: minutes })

    setSelectedTimezones((prevTimezones) =>
      prevTimezones.map((tz) => ({
        ...tz,
        time: referenceDateTime.setZone(tz.zone),
        manualTime: tz.zone === referenceZone ? referenceTime : referenceDateTime.setZone(tz.zone).toFormat('HH:mm'),
      }))
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Timezone Converter</h1>
      <div className="flex justify-center items-center mb-4 gap-2">
        <Switch
          className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
          checked={useManualTime}
          onCheckedChange={setUseManualTime}
          id="use-manual-time"
        />
        <label htmlFor="use-manual-time" className="text-sm font-medium">
          {useManualTime ? "Manual Time" : "Current Time"}
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedTimezones.map((tz, index) => (
          <TimezoneCard
            key={index}
            timezone={tz}
            index={index}
            useManualTime={useManualTime}
            onTimezoneChange={handleTimezoneChange}
            onManualTimeChange={handleManualTimeChange}
            onDelete={handleDeleteTimezone}
            showDelete={selectedTimezones.length > 1}
          />
        ))}
      </div>
      <div className="mt-6 text-center">
        <Button onClick={handleAddTimezone} className="gap-2">
          <Plus className="h-4 w-4" /> Add Timezone
        </Button>
      </div>
    </div>
  )
}