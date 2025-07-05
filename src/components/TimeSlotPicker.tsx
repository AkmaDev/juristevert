import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeSlotPickerProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
}

const TimeSlotPicker = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: TimeSlotPickerProps) => {
  // Créneaux disponibles par défaut (9h-17h, du lundi au vendredi)
  const defaultTimeSlots: TimeSlot[] = [
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
  ];

  // Dates non disponibles (weekends et jours fériés)
  const isDateDisabled = (date: Date) => {
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Désactiver les weekends et les dates passées
    return day === 0 || day === 6 || date < today;
  };

  // Obtenir les créneaux pour une date donnée
  const getTimeSlotsForDate = (date: Date): TimeSlot[] => {
    // Simuler quelques créneaux occupés de manière aléatoire
    const slots = [...defaultTimeSlots];
    const dateStr = format(date, "yyyy-MM-dd");

    // Créneaux occupés pour certaines dates (simulation)
    const busySlots: { [key: string]: string[] } = {
      [format(addDays(new Date(), 1), "yyyy-MM-dd")]: ["10:00", "15:00"],
      [format(addDays(new Date(), 2), "yyyy-MM-dd")]: ["09:00", "14:00"],
      [format(addDays(new Date(), 3), "yyyy-MM-dd")]: ["11:00", "16:00"],
    };

    if (busySlots[dateStr]) {
      busySlots[dateStr].forEach((busyTime) => {
        const slot = slots.find((s) => s.time === busyTime);
        if (slot) slot.available = false;
      });
    }

    return slots;
  };

  const timeSlots = selectedDate ? getTimeSlotsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-forest-800 mb-3">
          Choisissez une date
        </h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          disabled={isDateDisabled}
          locale={fr}
          className="rounded-md border"
        />
      </div>

      {selectedDate && (
        <div>
          <h3 className="text-lg font-medium text-forest-800 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Créneaux disponibles pour le{" "}
            {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => (
              <Button
                key={slot.time}
                variant={selectedTime === slot.time ? "default" : "outline"}
                disabled={!slot.available}
                onClick={() => onTimeSelect(slot.time)}
                className={`h-10 ${
                  selectedTime === slot.time
                    ? "gradient-forest text-white"
                    : slot.available
                    ? "hover:bg-forest-50 border-forest-200"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {slot.time}
              </Button>
            ))}
          </div>
          {timeSlots.every((slot) => !slot.available) && (
            <p className="text-sm text-forest-500 mt-2">
              Aucun créneau disponible pour cette date. Veuillez choisir une
              autre date.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
