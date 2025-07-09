import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Video, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import TimeSlotPicker from "./TimeSlotPicker";
import { supabase } from "@/integrations/supabase/client";

interface AppointmentDialogProps {
  children: React.ReactNode;
}

const AppointmentDialog = ({ children }: AppointmentDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!selectedDate || !selectedTime) {
  //     toast({
  //       title: "Informations manquantes",
  //       description: "Veuillez sélectionner une date et un créneau horaire.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     const appointmentData = {
  //       name: formData.name,
  //       email: formData.email,
  //       phone: formData.phone,
  //       service: formData.subject, // <-- ici : rename subject en service
  //       message: formData.subject, // si tu veux envoyer aussi un message, sinon ""
  //       date: format(selectedDate, "yyyy-MM-dd"),
  //       time: selectedTime,
  //       datetime:
  //         format(selectedDate, "dd MMMM yyyy", { locale: fr }) +
  //         " à " +
  //         selectedTime,
  //     };

  //     console.log("Envoi de la demande de rendez-vous:", appointmentData);

  //     const { data, error } = await supabase.functions.invoke(
  //       "send-appointment-request",
  //       {
  //         body: appointmentData,
  //       }
  //     );

  //     if (error) {
  //       throw error;
  //     }

  //     toast({
  //       title: "Demande de rendez-vous envoyée !",
  //       description: `Votre demande pour le ${appointmentData.datetime} a été envoyée. Nous vous contacterons pour confirmer et vous envoyer le lien Google Meet.`,
  //     });

  //     // Reset form
  //     setFormData({
  //       name: "",
  //       email: "",
  //       phone: "",
  //       subject: "",
  //       message: "",
  //     });
  //     setSelectedDate(undefined);
  //     setSelectedTime("");
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error("Erreur lors de l'envoi:", error.message);
  //     } else {
  //       console.error("Erreur inconnue lors de l'envoi:", error);
  //     }

  //     toast({
  //       title: "Erreur",
  //       description:
  //         "Une erreur s'est produite lors de l'envoi de votre demande. Veuillez réessayer.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted!");
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez sélectionner une date et un créneau horaire.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const appointmentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.subject, // ici subject correspond au service
        message: formData.message || "",
        _date: format(selectedDate, "yyyy-MM-dd"),
        _time: selectedTime,
        datetime:
          format(selectedDate, "dd MMMM yyyy", { locale: fr }) +
          " à " +
          selectedTime,
      };

      console.log("Envoi de la demande de rendez-vous:", appointmentData);

      const { data, error } = await supabase.functions.invoke(
        "send-appointment-request", // nom de ta fonction backend
        {
          body: JSON.stringify(appointmentData), // stringify important !
        }
      );

      if (error) {
        throw error;
      }

      toast({
        title: "Demande de rendez-vous envoyée !",
        description: `Votre demande pour le ${appointmentData.datetime} a été envoyée. Nous vous contacterons pour confirmer et vous envoyer le lien Google Meet.`,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setSelectedDate(undefined);
      setSelectedTime("");
    } catch (error: unknown) {
      console.error("Erreur lors de l'envoi:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur s'est produite lors de l'envoi de votre demande. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-forest-800">
            <Video className="w-5 h-5" />
            Planifier un rendez-vous Google Meet
          </DialogTitle>
          <DialogDescription>
            Choisissez un créneau disponible pour votre consultation en ligne
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-forest-800">
              Informations personnelles
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+229 XX XX XX XX"
              />
            </div>

            <div>
              <Label htmlFor="subject">Objet de la consultation *</Label>
              <Textarea
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="Décrivez brièvement l'objet de votre consultation..."
                className="min-h-20"
              />
            </div>
            <div>
              <Label htmlFor="message">Message (optionnel)</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Détails supplémentaires (facultatif)"
                className="min-h-20"
              />
            </div>
          </div>

          {/* Sélection de créneaux */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-forest-800 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Planification du rendez-vous
            </h3>
            <TimeSlotPicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateSelect={setSelectedDate}
              onTimeSelect={setSelectedTime}
            />
          </div>

          {/* Résumé de la sélection */}
          {selectedDate && selectedTime && (
            <div className="bg-forest-50 p-4 rounded-lg">
              <h4 className="font-medium text-forest-800 mb-2">
                Résumé de votre rendez-vous :
              </h4>
              <p className="text-forest-700">
                📅 {format(selectedDate, "EEEE dd MMMM yyyy", { locale: fr })} à{" "}
                {selectedTime}
              </p>
              <div className="text-sm text-forest-600 mt-2 space-y-1">
                <p>• Confirmation dans les 24h</p>
                <p>• Lien Google Meet envoyé par email</p>
                <p>• Rappel 1h avant le rendez-vous</p>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !selectedDate || !selectedTime}
            className="w-full gradient-forest text-white"
          >
            {isSubmitting ? "Envoi en cours..." : "Confirmer le rendez-vous"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
