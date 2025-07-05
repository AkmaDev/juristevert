import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AppointmentDialog from "./ApointmentDialog";

const HeroSection = () => {
  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center bg-gradient-to-br from-forest-50 to-white hero-pattern"
    >
      <div className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu principal */}
          <div className="space-y-8 animate-fade-in pt-6">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-forest-800 leading-tight">
                <span className="text-gradient block">
                  Agir pour l'environnement <br />
                  et le climat
                </span>
              </h1>
              <p className="text-xl text-forest-600 leading-relaxed max-w-2xl">
                Cabinet spécialisé en conseil juridique et évaluation
                environnementale pour entreprises et particuliers au Bénin et en
                Afrique francophone.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <AppointmentDialog>
                <Button
                  size="lg"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-forest-600 to-forest-700 px-8 py-5 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:brightness-110 hover:scale-105"
                >
                  <svg
                    className="mr-3 h-5 w-5 text-white transition-transform group-hover:rotate-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10m-3 6h.01M6 21h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
                    />
                  </svg>
                  Prendre rendez-vous
                </Button>
              </AppointmentDialog>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-forest-700">5+</div>
                <div className="text-sm text-forest-500">
                  Années d'expérience
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-forest-700">100+</div>
                <div className="text-sm text-forest-500">
                  Clients satisfaits
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-forest-700">24h</div>
                <div className="text-sm text-forest-500">Délai de réponse</div>
              </div>
            </div>
          </div>

          {/* Image hero */}
          <div className="relative lg:ml-8">
            <Card className="overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300 py-0">
              <img
                src="/hero.jpg"
                alt="Nature et justice - Juriste Vert"
                className="w-full h-96 lg:h-[500px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-lg font-medium">Protection juridique</p>
                <p className="text-sm opacity-90">pour un avenir durable</p>
              </div>
            </Card>

            {/* Badge flottant */}
            <div className="absolute -top-4 -right-4 gradient-gold text-white px-6 py-3 rounded-full font-semibold shadow-lg animate-pulse">
              ✓ Expert certifié
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
