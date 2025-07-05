import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Globe, Award } from "lucide-react";

const TrustSection = () => {
  const trustPoints = [
    {
      icon: Shield,
      title: "Éthique",
      description:
        "Intégrité et transparence dans chaque mission, respect strict du secret professionnel.",
      stat: "100%",
      statLabel: "Confidentialité",
    },
    {
      icon: Globe,
      title: "Impact",
      description:
        "Solutions durables qui protègent l'environnement tout en respectant le cadre juridique.",
      stat: "50+",
      statLabel: "Projets durables",
    },
    {
      icon: Heart,
      title: "Proximité",
      description:
        "Accompagnement humain et personnalisé, disponible en présentiel et en ligne.",
      stat: "24h",
      statLabel: "Temps de réponse",
    },
    {
      icon: Award,
      title: "Professionnalisme",
      description:
        "Expertise reconnue en droit environnemental et formation continue de notre équipe.",
      stat: "5+",
      statLabel: "Années d'expertise",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-forest-50 to-gold-50">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-forest-800 mb-6">
            Pourquoi nous faire confiance ?
          </h2>
          <p className="text-xl text-forest-600 max-w-3xl mx-auto">
            Notre cabinet s'appuie sur des valeurs fortes et une expertise
            reconnue pour vous offrir un service d'excellence.
          </p>
        </div>

        {/* Grille des valeurs */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPoints.map((point, index) => (
            <Card
              key={index}
              className="group text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white"
            >
              <CardContent className="p-8">
                {/* Icône et statistique */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 gradient-forest rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <point.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 gradient-gold text-white px-3 py-1 rounded-full text-sm font-bold">
                    {point.stat}
                  </div>
                </div>

                {/* Contenu */}
                <h3 className="text-xl font-bold text-forest-800 mb-3 group-hover:text-forest-600 transition-colors">
                  {point.title}
                </h3>
                <p className="text-forest-600 leading-relaxed mb-4">
                  {point.description}
                </p>
                <div className="text-sm font-medium text-gold-600">
                  {point.statLabel}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Témoignage en vedette */}
        <div className="mt-24 px-4">
          <Card className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl border border-forest-100">
            <CardContent className="p-10 lg:p-14">
              <div className="relative">
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center bg-gradient-to-br from-gold-400 to-gold-600 text-white text-4xl rounded-full shadow-lg">
                  “
                </div>
                <blockquote className="text-center text-forest-700 italic text-xl leading-relaxed mt-10">
                  Grâce à{" "}
                  <strong className="text-forest-800">Juriste Vert</strong>,
                  notre entreprise a pu naviguer sereinement dans la
                  réglementation environnementale tout en développant nos
                  activités de manière durable. Un accompagnement professionnel
                  et humain exceptionnel.
                </blockquote>

                <div className="mt-10 flex items-center justify-center gap-4">
                  <img
                    src="/seniorwoman.jpg" // si tu as une vraie photo
                    alt="Marie Koffi"
                    className="w-14 h-14 rounded-full object-cover border-2 border-forest-200 shadow-sm"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-forest-800">
                      Marie Koffi
                    </div>
                    <div className="text-sm text-forest-600">
                      Directrice, EcoTech Bénin
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
