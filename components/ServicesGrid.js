export default function ServicesGrid() {
  const services = [
    {
      title: 'Track Your Supplements',
      description:
        'Keep detailed logs of your daily vitamin and supplement intake. Never miss a dose with our smart reminder system.',
    },
    {
      title: 'Personalized Dashboard',
      description:
        'View your supplement history, track nutrient levels, and monitor your progress with our intuitive dashboard.',
    },
    {
      title: 'Health Insights',
      description:
        'Get detailed insights about your supplement routine and potential nutrient interactions.',
    },
    {
      title: 'Supplement Database',
      description:
        'Access our comprehensive database of vitamins and supplements, complete with dosage guidelines and health benefits.',
    },
    {
      title: 'Progress Analytics',
      description:
        'Visualize your supplement intake patterns and track your health goals with detailed analytics.',
    },
    {
      title: 'Simple to Use',
      description:
        'Designed for all ages with an easy-to-use interface. Track your supplements with just a few clicks.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-8">
        <h2 className="text-4xl font-bold text-center mb-16">
          Track Your Health Journey
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
