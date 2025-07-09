import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, Leaf, BookOpen } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Scale,
      title: "Conseil Juridique",
      description:
        "Accompagnement juridique personnalisé pour entreprises et particuliers dans tous vos projets et litiges.",
      features: [
        "Droit de l'environnement",
        "Veille réglementaire",
        "Charte environnementale",
        "Clause environnementale",
      ],
      image: "/conseiljuridique.jpg",
    },
    {
      icon: Leaf,
      title: "Étude",
      description:
        "Études d'impact environnemental et social pour vos projets de développement durable.",
      features: [
        "Élaboration de documents de stratégies",
        "Réalisation d'études",
        "Rédaction de projets",
      ],
      image: "/etudeimpact.png",
    },
    {
      icon: BookOpen,
      title: "Formations",
      description: "Programmes de formation sur mesure.",
      features: [
        "Formation en entreprise",
        "Séminaires spécialisés",
        "Formation en ligne",
      ],
      image: "/formations.jpg",
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-forest-800 mb-6">
            Nos Services d'Excellence
          </h2>
          <p className="text-xl text-forest-600 max-w-3xl mx-auto leading-relaxed">
            Des solutions adaptées à vos besoins, avec l'expertise d'un cabinet
            spécialisé en Afrique francophone.
          </p>
        </div>

        {/* Grille des services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 to-transparent"></div>
                <div className="absolute top-4 right-4 w-12 h-12 gradient-gold rounded-full flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-forest-800 group-hover:text-forest-600 transition-colors">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-forest-600 leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-forest-700"
                    >
                      <div className="w-2 h-2 gradient-forest rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant="outline"
                  className="w-full border-forest-600 text-forest-700 hover:bg-forest-50 group-hover:border-gold-500 group-hover:text-gold-600 transition-colors"
                >
                  <a href="#contact">En savoir plus</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center">
          <Card className="gradient-forest text-white p-8 inline-block">
            <h3 className="text-2xl font-bold mb-4">
              Besoin d'un accompagnement personnalisé ?
            </h3>
            <p className="mb-6 opacity-90">
              Contactez-nous pour une consultation gratuite et découvrez comment
              nous pouvons vous aider.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-forest-700 hover:bg-gold-50 hover:text-gold-700 transition-colors"
            >
              <a href="#contact">Consultation gratuite</a>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
