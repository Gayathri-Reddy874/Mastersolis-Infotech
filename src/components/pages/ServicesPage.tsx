import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { ServiceDetailModal } from '@/components/ui/service-detail-modal';
import { ArrowLeft, ArrowRight, Code, Cpu, Globe, Shield, Zap, Brain, Cloud, Smartphone, ExternalLink } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Services } from '@/entities';

export default function ServicesPage() {
  const [services, setServices] = useState<Services[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { items } = await BaseCrudService.getAll<Services>('services');
        setServices(items);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getServiceIcon = (index: number) => {
    const icons = [Brain, Cloud, Smartphone, Code, Cpu, Globe, Shield, Zap];
    return icons[index % icons.length];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-gridline">
        <div className="max-w-[120rem] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="font-heading text-xl font-bold text-primary">
              MASTERSOLIS
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/about" className="font-paragraph text-sm text-foreground hover:text-secondary transition-colors">
                ABOUT
              </Link>
              <Link to="/services" className="font-paragraph text-sm text-secondary font-medium">
                SERVICES
              </Link>
              <Link to="/projects" className="font-paragraph text-sm text-foreground hover:text-secondary transition-colors">
                PROJECTS
              </Link>
              <Link to="/careers" className="font-paragraph text-sm text-foreground hover:text-secondary transition-colors">
                CAREERS
              </Link>
              <Link to="/blog" className="font-paragraph text-sm text-foreground hover:text-secondary transition-colors">
                BLOG
              </Link>
              <Link to="/contact" className="font-paragraph text-sm text-foreground hover:text-secondary transition-colors">
                CONTACT
              </Link>
            </div>
            <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link to="/contact">GET STARTED</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-primary text-primary-foreground">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="flex items-center mb-8">
            <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-heading text-5xl md:text-6xl font-black uppercase mb-6">
                OUR <span className="text-secondary">SERVICES</span>
              </h1>
              <p className="font-paragraph text-xl text-primary-foreground/90 leading-relaxed mb-8">
                Comprehensive technology solutions designed to transform your business 
                and accelerate your digital journey with cutting-edge innovation.
              </p>
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link to="/contact">DISCUSS YOUR PROJECT</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-lavendergradientstart to-lavendergradientend rounded-2xl p-8 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Cloud className="w-8 h-8 text-primary" />
                  </div>
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Code className="w-8 h-8 text-primary" />
                  </div>
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-[120rem] mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-gridline">
                  <CardContent className="p-8">
                    <div className="animate-pulse space-y-4">
                      <div className="w-16 h-16 bg-gridline rounded"></div>
                      <div className="h-6 bg-gridline rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gridline rounded"></div>
                        <div className="h-4 bg-gridline rounded w-5/6"></div>
                        <div className="h-4 bg-gridline rounded w-4/5"></div>
                      </div>
                      <div className="h-10 bg-gridline rounded w-1/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = getServiceIcon(index);
                
                return (
                  <Card key={service._id} className="border-gridline hover:border-secondary transition-all duration-300 group hover:shadow-xl">
                    <CardContent className="p-8">
                      {/* Service Image */}
                      {service.serviceImage && (
                        <div className="mb-6 aspect-video overflow-hidden rounded-lg">
                          <Image
                            src={service.serviceImage}
                            alt={service.serviceName || 'Service'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            width={400}
                          />
                        </div>
                      )}
                      
                      {/* Icon */}
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                          <IconComponent className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform" />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="font-heading text-xl font-bold text-primary mb-4 group-hover:text-secondary transition-colors">
                        {service.serviceName}
                      </h3>
                      
                      <p className="font-paragraph text-foreground/80 mb-4 leading-relaxed">
                        {service.shortDescription}
                      </p>
                      
                      {service.fullDescription && (
                        <p className="font-paragraph text-sm text-foreground/60 mb-6 leading-relaxed">
                          {service.fullDescription}
                        </p>
                      )}

                      {/* CTA */}
                      <div className="flex items-center justify-between">
                        <ServiceDetailModal
                          service={service}
                          trigger={
                            <Button 
                              variant="outline" 
                              className="group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:border-secondary transition-all"
                            >
                              Learn More <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          }
                        />
                        
                        {service.callToActionUrl && (
                          <a
                            href={service.callToActionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-paragraph text-sm text-secondary hover:underline flex items-center"
                          >
                            External Details <ExternalLink className="ml-1 w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* Featured Badge */}
                      {service.isFeatured && (
                        <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                          <span className="font-paragraph text-xs font-medium">FEATURED</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gradient-to-r from-lavendergradientstart to-lavendergradientend">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              OUR PROCESS
            </h2>
            <p className="font-paragraph text-lg text-foreground/80 max-w-3xl mx-auto">
              A proven methodology that ensures successful project delivery and exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "DISCOVERY",
                description: "Understanding your business needs, challenges, and objectives through comprehensive analysis."
              },
              {
                step: "02",
                title: "STRATEGY",
                description: "Developing tailored solutions and roadmaps aligned with your business goals."
              },
              {
                step: "03",
                title: "EXECUTION",
                description: "Implementing solutions with agile methodologies and continuous collaboration."
              },
              {
                step: "04",
                title: "OPTIMIZATION",
                description: "Monitoring, refining, and scaling solutions for maximum impact and ROI."
              }
            ].map((process, index) => (
              <Card key={index} className="border-gridline bg-background/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-heading text-xl font-bold">
                    {process.step}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-primary mb-3">
                    {process.title}
                  </h3>
                  <p className="font-paragraph text-sm text-foreground/80 leading-relaxed">
                    {process.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-24 bg-background">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              TECHNOLOGIES WE USE
            </h2>
            <p className="font-paragraph text-lg text-foreground/80 max-w-3xl mx-auto">
              Leveraging the latest and most reliable technologies to build robust, scalable solutions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              "React", "Node.js", "Python", "AWS", "Docker", "Kubernetes",
              "TensorFlow", "MongoDB", "PostgreSQL", "Redis", "GraphQL", "TypeScript"
            ].map((tech, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-lavendergradientstart to-lavendergradientend rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Code className="w-8 h-8 text-primary" />
                </div>
                <div className="font-paragraph text-sm text-foreground/80 group-hover:text-secondary transition-colors">
                  {tech}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-[120rem] mx-auto px-6 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            READY TO GET STARTED?
          </h2>
          <p className="font-paragraph text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Let's discuss how our services can transform your business and drive growth
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link to="/contact">START YOUR PROJECT</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/projects">VIEW OUR WORK</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-gridline py-16">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-primary">MASTERSOLIS</h3>
              <p className="font-paragraph text-sm text-foreground/80">
                Next-generation technology solutions for modern businesses
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-heading text-sm font-bold text-primary">SERVICES</h4>
              <div className="space-y-2">
                <Link to="/services" className="block font-paragraph text-sm text-secondary">
                  AI Solutions
                </Link>
                <Link to="/services" className="block font-paragraph text-sm text-foreground/80 hover:text-secondary">
                  Cloud Computing
                </Link>
                <Link to="/services" className="block font-paragraph text-sm text-foreground/80 hover:text-secondary">
                  Mobile Development
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-heading text-sm font-bold text-primary">COMPANY</h4>
              <div className="space-y-2">
                <Link to="/about" className="block font-paragraph text-sm text-foreground/80 hover:text-secondary">
                  About Us
                </Link>
                <Link to="/careers" className="block font-paragraph text-sm text-foreground/80 hover:text-secondary">
                  Careers
                </Link>
                <Link to="/blog" className="block font-paragraph text-sm text-foreground/80 hover:text-secondary">
                  Blog
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-heading text-sm font-bold text-primary">CONNECT</h4>
              <div className="space-y-2">
                <Link to="/contact" className="block font-paragraph text-sm text-foreground/80 hover:text-secondary">
                  Contact Us
                </Link>
                <a href="mailto:info@mastersolis.com" className="block font-paragraph text-sm text-foreground/80 hover:text-secondary">
                  info@mastersolis.com
                </a>
                <a href="tel:+1234567890" className="block font-paragraph text-sm text-foreground/80 hover:text-secondary">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gridline mt-12 pt-8 text-center">
            <p className="font-paragraph text-sm text-foreground/60">
              © 2024 Mastersolis Infotech. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}