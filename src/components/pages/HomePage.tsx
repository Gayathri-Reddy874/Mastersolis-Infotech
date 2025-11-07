import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { ServiceDetailModal } from '@/components/ui/service-detail-modal';
import { ArrowRight, Code, Cpu, Globe, Shield, Zap, Star, Sparkles, TrendingUp, Users } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Services, Testimonials, Projects, CaseStudies } from '@/entities';

export default function HomePage() {
  const [services, setServices] = useState<Services[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonials[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Projects[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudies[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, testimonialsData, projectsData, caseStudiesData] = await Promise.all([
          BaseCrudService.getAll<Services>('services'),
          BaseCrudService.getAll<Testimonials>('testimonials'),
          BaseCrudService.getAll<Projects>('projects'),
          BaseCrudService.getAll<CaseStudies>('casestudies')
        ]);

        setServices(servicesData.items.filter(service => service.isFeatured).slice(0, 3));
        setTestimonials(testimonialsData.items.slice(0, 3));
        setFeaturedProjects(projectsData.items.slice(0, 3));
        setCaseStudies(caseStudiesData.items.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-hero-gradient animate-fade-in">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-lavender-300 shadow-lavender-lg">
        <div className="max-w-[120rem] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="font-heading text-xl font-bold bg-lavender-gradient-dark bg-clip-text text-transparent animate-pulse-soft">
              MASTERSOLIS
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/about" className="font-paragraph text-sm text-foreground hover:text-secondary transition-all duration-300 hover:scale-105">
                ABOUT
              </Link>
              <Link to="/services" className="font-paragraph text-sm text-foreground hover:text-secondary transition-all duration-300 hover:scale-105">
                SERVICES
              </Link>
              <Link to="/projects" className="font-paragraph text-sm text-foreground hover:text-secondary transition-all duration-300 hover:scale-105">
                PROJECTS
              </Link>
              <Link to="/careers" className="font-paragraph text-sm text-foreground hover:text-secondary transition-all duration-300 hover:scale-105">
                CAREERS
              </Link>
              <Link to="/blog" className="font-paragraph text-sm text-foreground hover:text-secondary transition-all duration-300 hover:scale-105">
                BLOG
              </Link>
              <Link to="/contact" className="font-paragraph text-sm text-foreground hover:text-secondary transition-all duration-300 hover:scale-105">
                CONTACT
              </Link>
              <Link to="/admin" className="font-paragraph text-sm text-white hover:text-lavender-100 transition-all duration-300 hover:scale-105 bg-lavender-gradient-dark px-4 py-2 rounded-full shadow-lavender">
                ADMIN
              </Link>
            </div>
            <Button asChild className="bg-lavender-gradient-vibrant text-white hover:shadow-glow-lavender transition-all duration-300 hover:scale-105 border-0">
              <Link to="/contact">GET STARTED</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Inspired by the layout structure */}
      <section className="relative w-full min-h-screen bg-lavender-gradient-vibrant overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full animate-float shadow-glow-lavender"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/15 rounded-full animate-float shadow-lavender-lg" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/20 rounded-full animate-pulse-soft shadow-lavender"></div>
        </div>
        
        <div className="max-w-[120rem] mx-auto px-6 pt-24 pb-16 h-screen flex flex-col justify-center relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-center">
            {/* Main Headline - Large Typography Treatment */}
            <div className="lg:col-span-8 space-y-6 animate-slide-in-left">
              <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-none tracking-wider text-white">
                NEXT-GEN
                <br />
                <span className="text-lavender-100 animate-pulse-soft">INFOTECH</span>
              </h1>
              
              {/* Tagline positioned similar to inspiration */}
              <div className="max-w-2xl">
                <p className="font-paragraph text-lg md:text-xl text-white/90 leading-relaxed">
                  TRANSFORMING BUSINESSES THROUGH
                  <br />
                  INTELLIGENT TECHNOLOGY SOLUTIONS
                </p>
              </div>

              {/* Feature highlights */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-lavender-100" />
                  <span className="font-paragraph text-sm text-white/80">AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-lavender-100" />
                  <span className="font-paragraph text-sm text-white/80">Global Scale</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-lavender-100" />
                  <span className="font-paragraph text-sm text-white/80">Enterprise Security</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Button asChild size="lg" className="bg-white text-lavender-700 hover:bg-lavender-50 hover:shadow-glow-lavender transition-all duration-300 hover:scale-105 border-0 font-bold">
                  <Link to="/services">
                    <Zap className="w-5 h-5 mr-2" />
                    EXPLORE SERVICES
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-lavender-700 transition-all duration-300 hover:scale-105 font-bold">
                  <Link to="/projects">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    VIEW PROJECTS
                  </Link>
                </Button>
              </div>
            </div>

            {/* Company Info - Positioned like event details in inspiration */}
            <div className="lg:col-span-4 flex flex-col justify-end h-full pb-16 animate-slide-in-right">
              <div className="space-y-6 text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lavender-lg">
                  <div className="font-paragraph text-sm text-white/95 mb-2 font-bold">
                    ESTABLISHED 2020
                  </div>
                  <div className="font-paragraph text-xs text-white/80">
                    GLOBAL REACH • 50+ COUNTRIES
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lavender-lg">
                  <div className="font-paragraph text-xs text-white/80 leading-relaxed font-medium">
                    AI • BLOCKCHAIN • CLOUD
                    <br />
                    MOBILE • WEB • CONSULTING
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gradient Geometric Element - Enhanced with lavender theme */}
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-lavender-radial opacity-80 blur-3xl -translate-x-1/2 translate-y-1/2 animate-pulse-soft"></div>
          <div className="absolute top-1/4 right-0 w-64 h-64 bg-lavender-gradient-dark opacity-60 rounded-full blur-2xl translate-x-1/2 animate-float shadow-glow-lavender"></div>
        </div>
      </section>

      {/* Services Highlights */}
      <section className="py-24 bg-lavender-gradient-soft relative">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              OUR <span className="text-transparent bg-clip-text bg-lavender-gradient-dark">EXPERTISE</span>
            </h2>
            <p className="font-paragraph text-lg text-muted-foreground max-w-3xl mx-auto">
              Cutting-edge technology solutions designed to accelerate your digital transformation journey
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-lavender-200 bg-white/50 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="animate-pulse space-y-4">
                      <div className="w-12 h-12 bg-lavender-200 rounded"></div>
                      <div className="h-6 bg-lavender-200 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-lavender-200 rounded"></div>
                        <div className="h-4 bg-lavender-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const icons = [Code, Cpu, Globe, Shield, Zap];
                const IconComponent = icons[index % icons.length];
                
                return (
                  <Card key={service._id} className="border-lavender-300 hover:border-lavender-500 transition-all duration-300 hover:shadow-glow-lavender group bg-white/80 backdrop-blur-sm animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                    <CardContent className="p-8">
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-lavender-gradient-vibrant rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lavender-lg">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h3 className="font-heading text-xl font-bold text-primary mb-4 group-hover:text-lavender-700 transition-colors">
                        {service.serviceName}
                      </h3>
                      <p className="font-paragraph text-foreground/80 mb-6 leading-relaxed">
                        {service.shortDescription}
                      </p>
                      <ServiceDetailModal
                        service={service}
                        trigger={
                          <Button variant="outline" className="border-lavender-400 text-lavender-700 hover:bg-lavender-gradient-vibrant hover:text-white hover:border-lavender-600 transition-all duration-300 font-medium">
                            Learn More <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        }
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-lavender-gradient-vibrant relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full animate-float shadow-lavender-lg"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/10 rounded-full animate-float shadow-lavender" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-[120rem] mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              FEATURED <span className="text-lavender-100">WORK</span>
            </h2>
            <p className="font-paragraph text-lg text-white/90 max-w-3xl mx-auto">
              Showcasing our latest innovations and successful client partnerships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <Card key={project._id} className="overflow-hidden border-white/30 hover:shadow-glow-lavender transition-all duration-300 group bg-white/15 backdrop-blur-sm animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                {project.projectImage && (
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={project.projectImage}
                      alt={project.projectName || 'Project'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      width={400}
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="font-heading text-xl font-bold text-white mb-3 group-hover:text-lavender-100 transition-colors">
                    {project.projectName}
                  </h3>
                  <p className="font-paragraph text-white/85 mb-4 line-clamp-3">
                    {project.projectDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-paragraph text-sm text-lavender-200 font-medium bg-white/15 px-3 py-1 rounded-full border border-white/20">
                      {project.clientName}
                    </span>
                    <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/15 font-medium">
                      <Link to="/projects">
                        View Details <ArrowRight className="ml-1 w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <Button asChild size="lg" className="bg-white text-lavender-700 hover:bg-lavender-50 hover:shadow-glow-lavender transition-all duration-300 hover:scale-105 border-0 font-bold">
              <Link to="/projects">
                <TrendingUp className="w-5 h-5 mr-2" />
                VIEW ALL PROJECTS
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-24 bg-background relative">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              SUCCESS <span className="text-transparent bg-clip-text bg-lavender-gradient-dark">STORIES</span>
            </h2>
            <p className="font-paragraph text-lg text-muted-foreground max-w-3xl mx-auto">
              Real results from real clients - discover how we've transformed businesses across industries
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-lavender-300 animate-pulse">
                  <CardContent className="p-8">
                    <div className="h-6 bg-lavender-200 rounded mb-4"></div>
                    <div className="h-4 bg-lavender-100 rounded mb-2"></div>
                    <div className="h-4 bg-lavender-100 rounded mb-4 w-3/4"></div>
                    <div className="h-20 bg-lavender-100 rounded mb-4"></div>
                    <div className="h-8 bg-lavender-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((caseStudy, index) => (
                <Card key={caseStudy._id} className="border-lavender-300 hover:border-lavender-500 transition-all duration-300 hover:shadow-glow-lavender group bg-white/80 backdrop-blur-sm animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  {caseStudy.thumbnailImage && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <Image
                        src={caseStudy.thumbnailImage}
                        alt={caseStudy.caseStudyTitle || 'Case Study'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        width={400}
                      />
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="mb-4">
                      <span className="inline-block bg-lavender-gradient-vibrant text-white text-xs font-bold px-3 py-1 rounded-full">
                        {caseStudy.industry || 'Technology'}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-primary mb-3 group-hover:text-lavender-700 transition-colors">
                      {caseStudy.caseStudyTitle}
                    </h3>
                    <p className="font-paragraph text-sm text-muted-foreground mb-2">
                      Client: <span className="font-medium text-foreground">{caseStudy.clientName}</span>
                    </p>
                    <p className="font-paragraph text-foreground/80 mb-6 leading-relaxed line-clamp-3">
                      {caseStudy.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-paragraph text-xs text-muted-foreground">
                        {caseStudy.publicationDate && new Date(caseStudy.publicationDate).toLocaleDateString()}
                      </span>
                      <Button variant="outline" size="sm" className="border-lavender-400 text-lavender-700 hover:bg-lavender-gradient-vibrant hover:text-white hover:border-lavender-600 transition-all duration-300">
                        Read More <ArrowRight className="ml-1 w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <Button asChild size="lg" className="bg-lavender-gradient-vibrant text-white hover:bg-lavender-gradient-dark hover:shadow-glow-lavender transition-all duration-300 hover:scale-105 border-0 font-bold">
              <Link to="/case-studies">
                <Star className="w-5 h-5 mr-2" />
                VIEW ALL CASE STUDIES
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background relative">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              CLIENT <span className="text-transparent bg-clip-text bg-lavender-gradient-dark">SUCCESS</span>
            </h2>
            <p className="font-paragraph text-lg text-muted-foreground max-w-3xl mx-auto">
              Trusted by industry leaders worldwide for delivering exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <Card key={i} className="border-lavender-300 animate-pulse">
                  <CardContent className="p-8">
                    <div className="h-4 bg-lavender-200 rounded mb-4"></div>
                    <div className="h-20 bg-lavender-100 rounded mb-6"></div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-lavender-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-lavender-100 rounded w-24"></div>
                        <div className="h-3 bg-lavender-100 rounded w-32"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              testimonials.map((testimonial, index) => (
                <Card key={testimonial._id} className="border-lavender-300 hover:border-lavender-500 transition-all duration-300 hover:shadow-glow-lavender bg-white/80 backdrop-blur-sm animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < (testimonial.rating || 5) ? 'text-lavender-500 fill-current' : 'text-lavender-200'
                          }`}
                        />
                      ))}
                    </div>
                    <blockquote className="font-paragraph text-foreground/90 mb-6 leading-relaxed">
                      "{testimonial.testimonialText}"
                    </blockquote>
                    <div className="flex items-center space-x-4">
                      {testimonial.authorPhoto ? (
                        <Image
                          src={testimonial.authorPhoto}
                          alt={testimonial.authorName || 'Client'}
                          className="w-12 h-12 rounded-full object-cover shadow-lavender-lg"
                          width={48}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-lavender-gradient-vibrant rounded-full flex items-center justify-center shadow-lavender">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div>
                        <div className="font-heading text-sm font-bold text-primary">
                          {testimonial.authorName}
                        </div>
                        <div className="font-paragraph text-xs text-muted-foreground">
                          {testimonial.authorTitle} • {testimonial.companyName}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="text-center mt-12 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <Button asChild size="lg" className="bg-lavender-gradient-vibrant text-white hover:bg-lavender-gradient-dark hover:shadow-glow-lavender transition-all duration-300 hover:scale-105 border-0 font-bold">
              <Link to="/testimonials">
                <Users className="w-5 h-5 mr-2" />
                VIEW ALL TESTIMONIALS
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-lavender-gradient-dark relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl shadow-glow-lavender"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl shadow-lavender-lg"></div>
        </div>
        
        <div className="max-w-[120rem] mx-auto px-6 text-center relative z-10">
          <div className="animate-slide-up">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-white">
              READY TO <span className="text-lavender-200">TRANSFORM?</span>
            </h2>
            <p className="font-paragraph text-xl text-white/95 mb-8 max-w-3xl mx-auto">
              Let's discuss how our innovative solutions can accelerate your business growth
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Button asChild size="lg" className="bg-white text-lavender-700 hover:bg-lavender-50 hover:shadow-glow-lavender transition-all duration-300 hover:scale-105 border-0 font-bold">
                <Link to="/contact">
                  <Sparkles className="w-5 h-5 mr-2" />
                  START YOUR PROJECT
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-lavender-700 transition-all duration-300 hover:scale-105 font-bold">
                <Link to="/about">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  LEARN MORE
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-lavender-gradient-soft border-t border-lavender-300 py-16 relative">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 animate-slide-in-left">
              <h3 className="font-heading text-lg font-bold text-primary">MASTERSOLIS</h3>
              <p className="font-paragraph text-sm text-muted-foreground">
                Next-generation technology solutions for modern businesses
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-lavender-500 rounded-full animate-pulse-soft shadow-lavender"></div>
                <span className="font-paragraph text-xs text-lavender-700 font-medium">Innovating since 2020</span>
              </div>
            </div>
            <div className="space-y-4 animate-slide-up" style={{animationDelay: '0.1s'}}>
              <h4 className="font-heading text-sm font-bold text-primary">SERVICES</h4>
              <div className="space-y-2">
                <Link to="/services" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-700 transition-colors font-medium">
                  AI Solutions
                </Link>
                <Link to="/services" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-700 transition-colors font-medium">
                  Cloud Computing
                </Link>
                <Link to="/services" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-700 transition-colors font-medium">
                  Mobile Development
                </Link>
              </div>
            </div>
            <div className="space-y-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <h4 className="font-heading text-sm font-bold text-primary">COMPANY</h4>
              <div className="space-y-2">
                <Link to="/about" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-700 transition-colors font-medium">
                  About Us
                </Link>
                <Link to="/careers" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-700 transition-colors font-medium">
                  Careers
                </Link>
                <Link to="/blog" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-700 transition-colors font-medium">
                  Blog
                </Link>
              </div>
            </div>
            <div className="space-y-4 animate-slide-in-right">
              <h4 className="font-heading text-sm font-bold text-primary">CONNECT</h4>
              <div className="space-y-2">
                <Link to="/contact" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-700 transition-colors font-medium">
                  Contact Us
                </Link>
                <a href="mailto:info@mastersolis.com" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-700 transition-colors font-medium">
                  info@mastersolis.com
                </a>
                <a href="tel:+1234567890" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-700 transition-colors font-medium">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-lavender-300 mt-12 pt-8 text-center animate-fade-in">
            <p className="font-paragraph text-sm text-muted-foreground">
              © 2024 Mastersolis Infotech. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}