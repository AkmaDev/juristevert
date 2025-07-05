import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
    consent: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Envoi de la demande de consultation:", formData);

      // Appeler la fonction edge Supabase
      const { data, error } = await supabase.functions.invoke(
        "send-consultation-request",
        {
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service: formData.service,
            message: formData.message,
          }),
        }
      );

      if (error) {
        console.error("Erreur lors de l'envoi:", error);
        throw error;
      }

      console.log("Réponse de la fonction:", data);

      setIsSubmitting(false);
      toast({
        title: "Message envoyé !",
        description:
          "Votre demande a été transmise avec succès. Nous vous recontacterons dans les 24h.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
        consent: false,
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setIsSubmitting(false);
      toast({
        title: "Erreur",
        description:
          "Une erreur s'est produite lors de l'envoi. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-forest-50 to-white"
    >
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-forest-800 mb-6">
            Contactez-nous
          </h2>
          <p className="text-xl text-forest-600 max-w-3xl mx-auto">
            Prêt à démarrer votre projet ? Notre équipe est là pour vous
            accompagner avec des solutions sur mesure.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Informations de contact */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="gradient-forest text-white">
              <CardHeader>
                <CardTitle className="text-xl">Nos coordonnées</CardTitle>
                <CardDescription className="text-white/80">
                  Plusieurs moyens pour nous joindre
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-sm opacity-90">
                      Cotonou, République du Bénin
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-sm opacity-90">+229 0197 87 68 45</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm opacity-90">
                      contact@juristevert.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Horaires</p>
                    <p className="text-sm opacity-90">Lun-Ven : 8h-18h</p>
                    <p className="text-sm opacity-90">Sam : 9h-13h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engagement de réponse */}
            <Card className="border-gold-200 bg-gold-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-forest-800 mb-2">
                  Réponse garantie
                </h3>
                <p className="text-sm text-forest-600">
                  Nous nous engageons à vous répondre dans les{" "}
                  <strong>24 heures</strong>
                  pour toute demande de consultation.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-forest-800">
                  Demande de consultation
                </CardTitle>
                <CardDescription>
                  Remplissez ce formulaire pour une première consultation
                  gratuite
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-forest-700 mb-2 block">
                        Nom complet *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Votre nom et prénom"
                        className="border-forest-200 focus:border-forest-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-forest-700 mb-2 block">
                        Email *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="votre@email.com"
                        className="border-forest-200 focus:border-forest-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-forest-700 mb-2 block">
                        Téléphone
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+229 XX XX XX XX"
                        className="border-forest-200 focus:border-forest-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-forest-700 mb-2 block">
                        Type de service *
                      </label>
                      <Select
                        required
                        value={formData.service}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, service: value }))
                        }
                      >
                        <SelectTrigger className="border-forest-200 focus:border-forest-500">
                          <SelectValue placeholder="Choisir un service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conseil">
                            Conseil juridique
                          </SelectItem>
                          <SelectItem value="evaluation">
                            Évaluation environnementale
                          </SelectItem>
                          <SelectItem value="formation">Formation</SelectItem>
                          <SelectItem value="autre">Autre demande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-forest-700 mb-2 block">
                      Décrivez votre projet ou besoin *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Décrivez brièvement votre projet, vos attentes et le contexte de votre demande..."
                      className="min-h-32 border-forest-200 focus:border-forest-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleInputChange}
                      required
                      className="w-4 h-4 text-forest-600 border-forest-300 rounded focus:ring-forest-500"
                    />
                    <label
                      htmlFor="consent"
                      className="text-sm text-forest-600"
                    >
                      J'accepte d'être contacté par Juriste Vert concernant ma
                      demande *
                    </label>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full gradient-forest text-white hover:opacity-90 transition-opacity"
                  >
                    {isSubmitting ? (
                      "Envoi en cours..."
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Envoyer ma demande
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
