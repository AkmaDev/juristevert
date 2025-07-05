import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="apropos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Photo et présentation du fondateur */}
          <div className="space-y-20">
            <div className="relative">
              <Card className="overflow-hidden shadow-2xl py-0">
                <img
                  src="/profilG.JPG"
                  alt="Fondateur Juriste Vert"
                  className="w-full h-[500px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent rounded-b-2xl"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Dr Remy AKPOVI</h3>
                  <p className="text-lg opacity-90">Fondateur & Directeur</p>
                </div>
              </Card>
            </div>

            {/* Informations de contact */}
            <Card className="gradient-forest text-white p-6 ">
              <h4 className="text-xl font-bold mb-4">
                Informations de contact
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <span>Cotonou, République du Bénin</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span>+229 01 97 87 68 45</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span>contact@juristevert.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <span>Lun-Ven : 8h-18h | Sam : 9h-13h</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Contenu textuel */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-forest-800 mb-6">
                Notre Cabinet
              </h2>
              <p className="text-xl text-forest-600 leading-relaxed mb-8">
                <strong>Cabinet « Juriste Vert »</strong>
                est né de la conviction que le droit et l'environnement peuvent
                œuvrer ensemble pour un développement durable et équitable en
                Afrique.
              </p>
            </div>

            {/* Biographie du fondateur */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-forest-800">
                Notre Fondateur
              </h3>
              <div className="prose prose-lg text-forest-700">
                <p className="leading-relaxed">
                  Maître Rémy AKPOVI est Docteur en droit de l’environnement,
                  certifié ISO 14001 et ISO 31000 avec une expertise en gestion
                  des catastrophes et en stratégies et développement des marchés
                  carbones. Ancien Directeur départemental de l’environnement au
                  Bénin et ancien point focal des risques de catastrophes de la
                  mairie de Cotonou, il combine expertise juridique, expérience
                  terrain et engagement humanitaire. Auteur de plusieurs
                  ouvrages de référence, il milite pour une meilleure
                  législation des risques naturels et une justice
                  environnementale accessible à tous.
                </p>
                {/* <p className="leading-relaxed">
                  Auteur de plusieurs ouvrages de référence, il milite pour une
                  meilleure législation des risques naturels et une justice
                  environnementale accessible à tous.
                </p> */}
              </div>
            </div>

            {/* Nos valeurs */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 border-l-4 border-forest-500 hover:shadow-lg transition-shadow">
                <h4 className="font-bold text-forest-800 mb-2">Éthique</h4>
                <p className="text-sm text-forest-600">
                  Intégrité et transparence dans chaque mission
                </p>
              </Card>
              <Card className="p-6 border-l-4 border-gold-500 hover:shadow-lg transition-shadow">
                <h4 className="font-bold text-forest-800 mb-2">Impact</h4>
                <p className="text-sm text-forest-600">
                  Solutions durables pour l'avenir
                </p>
              </Card>
              <Card className="p-6 border-l-4 border-forest-500 hover:shadow-lg transition-shadow">
                <h4 className="font-bold text-forest-800 mb-2">Proximité</h4>
                <p className="text-sm text-forest-600">
                  Accompagnement humain et personnalisé
                </p>
              </Card>
              <Card className="p-6 border-l-4 border-gold-500 hover:shadow-lg transition-shadow">
                <h4 className="font-bold text-forest-800 mb-2">
                  Professionnalisme
                </h4>
                <p className="text-sm text-forest-600">
                  Expertise reconnue et formation continue
                </p>
              </Card>
            </div>

            <Button
              size="lg"
              className="gradient-forest text-white hover:opacity-90 transition-opacity"
            >
              Découvrir notre expertise
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
