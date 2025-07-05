import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="gradient-forest text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <img
                  src="/logovert.png"
                  alt="Nature et justice - Juriste Vert"
                  className=""
                />
              </div>
              <div>
                <h3 className="font-bold text-xl">Juriste Vert</h3>
                <p className="text-sm opacity-90">
                  Cabinet Conseil et d'Assistance Juridique
                </p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed max-w-md">
              Votre partenaire de confiance pour tous vos besoins en conseil
              juridique et évaluation environnementale au Bénin et en Afrique
              francophone.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Cotonou, République du Bénin</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+229 01 97 87 68 45</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@juristevert.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-4">Nos Services</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#services"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Conseil juridique
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Évaluation environnementale
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Formations
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Consultation gratuite
                </a>
              </li>
            </ul>
          </div>

          {/* Informations légales */}
          <div>
            <h4 className="font-bold text-lg mb-4">Informations</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#apropos"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  À propos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Mentions légales
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Conditions générales
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Horaires d'ouverture */}
        <Card className="mt-12 bg-white/10 border-white/20 backdrop-blur-sm">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-5 h-5" />
              <h4 className="font-bold">Horaires d'ouverture</h4>
            </div>
            <p className="text-white/90">
              Lundi - Vendredi : 8h00 - 18h00 | Samedi : 9h00 - 13h00
            </p>
            <p className="text-sm text-white/70 mt-1">
              Consultations sur rendez-vous uniquement
            </p>
          </div>
        </Card>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/70">
            © 2024 Cabinet Conseil et d'Assistance Juridique « Juriste Vert ».
            Tous droits réservés.
          </p>
          <p className="text-sm text-white/60 mt-2">
            Conçu pour un avenir juridique et environnemental durable au Bénin
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
