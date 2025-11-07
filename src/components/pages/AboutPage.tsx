import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { ArrowLeft, Target, Eye, Heart, Calendar, Users, Award, Sparkles, TrendingUp, Globe } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { TeamMembers, CompanyMilestones } from '@/entities';

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMembers[]>([]);
  const [milestones, setMilestones] = useState<CompanyMilestones[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, milestonesData] = await Promise.all([
          BaseCrudService.getAll<TeamMembers>('teammembers'),
          BaseCrudService.getAll<CompanyMilestones>('companymilestones')
        ]);

        setTeamMembers(teamData.items);
        setMilestones(milestonesData.items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-lavender-gradient-soft animate-fade-in">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-lavender-200 shadow-lavender">
        <div className="max-w-[120rem] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="font-heading text-xl font-bold text-primary animate-pulse-soft">
              MASTERSOLIS
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/about" className="font-paragraph text-sm text-secondary font-medium relative">
                ABOUT
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-lavender-gradient rounded-full"></div>
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
            <Button asChild className="bg-lavender-gradient text-white hover:shadow-lavender-lg transition-all duration-300 hover:scale-105 border-0">
              <Link to="/contact">GET STARTED</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-lavender-gradient relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/5 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-[120rem] mx-auto px-6 relative z-10">
          <div className="flex items-center mb-8 animate-slide-in-left">
            <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10 backdrop-blur-sm">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h1 className="font-heading text-5xl md:text-6xl font-black uppercase mb-6 text-white">
                ABOUT <span className="text-lavender-100 animate-pulse-soft">MASTERSOLIS</span>
              </h1>
              <p className="font-paragraph text-xl text-white/90 leading-relaxed mb-8">
                Pioneering the future of technology through innovative solutions, 
                strategic partnerships, and unwavering commitment to excellence.
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-lavender-100" />
                  <span className="font-paragraph text-sm text-white/80">Innovation Driven</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-lavender-100" />
                  <span className="font-paragraph text-sm text-white/80">Global Impact</span>
                </div>
              </div>
            </div>
            <div className="relative animate-slide-in-right">
              <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-3xl p-8 flex items-center justify-center border border-white/20 shadow-lavender-xl">
                <div className="text-center">
                  <div className="font-heading text-4xl font-bold text-white mb-2 animate-scale-in">2020</div>
                  <div className="font-paragraph text-sm text-white/80">FOUNDED</div>
                  <div className="mt-4 w-16 h-1 bg-lavender-100 rounded-full mx-auto"></div>
                </div>
              </div>
              {/* Floating accent elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-lavender-100 rounded-full animate-pulse-soft"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-white/30 rounded-full animate-float"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-24 bg-background relative">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              OUR <span className="text-transparent bg-clip-text bg-lavender-gradient">FOUNDATION</span>
            </h2>
            <p className="font-paragraph text-lg text-muted-foreground max-w-3xl mx-auto">
              The core principles that guide our journey and define our commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mission */}
            <Card className="border-lavender-200 hover:border-lavender-400 transition-all duration-300 hover:shadow-lavender-lg group animate-slide-up bg-white/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-lavender-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lavender">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-4">MISSION</h3>
                <p className="font-paragraph text-foreground/80 leading-relaxed">
                  To empower businesses worldwide with cutting-edge technology solutions that drive 
                  innovation, enhance efficiency, and create sustainable competitive advantages in 
                  the digital landscape.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="border-lavender-200 hover:border-lavender-400 transition-all duration-300 hover:shadow-lavender-lg group animate-slide-up bg-white/50 backdrop-blur-sm" style={{animationDelay: '0.2s'}}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-lavender-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lavender">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-4">VISION</h3>
                <p className="font-paragraph text-foreground/80 leading-relaxed">
                  To become the global leader in transformative technology consulting, 
                  recognized for our innovative approach, exceptional client outcomes, 
                  and positive impact on the digital transformation ecosystem.
                </p>
              </CardContent>
            </Card>

            {/* Values */}
            <Card className="border-lavender-200 hover:border-lavender-400 transition-all duration-300 hover:shadow-lavender-lg group animate-slide-up bg-white/50 backdrop-blur-sm" style={{animationDelay: '0.4s'}}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-lavender-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lavender">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-4">VALUES</h3>
                <p className="font-paragraph text-foreground/80 leading-relaxed">
                  Innovation, integrity, collaboration, and excellence guide everything we do. 
                  We believe in building lasting partnerships through transparency, 
                  continuous learning, and unwavering commitment to client success.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-24 bg-lavender-gradient relative overflow-hidden">
        {/* Animated mesh background */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-30 animate-gradient-shift" style={{backgroundSize: '400% 400%'}}></div>
        
        <div className="max-w-[120rem] mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              BY THE <span className="text-lavender-100">NUMBERS</span>
            </h2>
            <p className="font-paragraph text-lg text-white/90 max-w-3xl mx-auto">
              Our growth story reflected in key achievements and milestones
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group animate-scale-in">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lavender">
                <div className="font-heading text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-lavender-100 transition-colors">150+</div>
                <div className="font-paragraph text-sm text-white/80">PROJECTS DELIVERED</div>
                <TrendingUp className="w-6 h-6 text-lavender-100 mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="text-center group animate-scale-in" style={{animationDelay: '0.1s'}}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lavender">
                <div className="font-heading text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-lavender-100 transition-colors">50+</div>
                <div className="font-paragraph text-sm text-white/80">GLOBAL CLIENTS</div>
                <Globe className="w-6 h-6 text-lavender-100 mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="text-center group animate-scale-in" style={{animationDelay: '0.2s'}}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lavender">
                <div className="font-heading text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-lavender-100 transition-colors">25+</div>
                <div className="font-paragraph text-sm text-white/80">TEAM EXPERTS</div>
                <Users className="w-6 h-6 text-lavender-100 mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="text-center group animate-scale-in" style={{animationDelay: '0.3s'}}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lavender">
                <div className="font-heading text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-lavender-100 transition-colors">99%</div>
                <div className="font-paragraph text-sm text-white/80">CLIENT SATISFACTION</div>
                <Award className="w-6 h-6 text-lavender-100 mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-lavender-gradient-soft relative">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              OUR <span className="text-transparent bg-clip-text bg-lavender-gradient">TEAM</span>
            </h2>
            <p className="font-paragraph text-lg text-muted-foreground max-w-3xl mx-auto">
              Meet the visionaries and experts driving innovation at Mastersolis
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-lavender-200 bg-white/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="w-24 h-24 bg-lavender-200 rounded-full mx-auto"></div>
                      <div className="h-6 bg-lavender-200 rounded w-3/4 mx-auto"></div>
                      <div className="h-4 bg-lavender-200 rounded w-1/2 mx-auto"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-lavender-200 rounded"></div>
                        <div className="h-3 bg-lavender-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={member._id} className="border-lavender-200 hover:border-lavender-400 transition-all duration-300 hover:shadow-lavender-lg group bg-white/70 backdrop-blur-sm animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-6 text-center">
                    <div className="mb-6 relative">
                      {member.profilePicture ? (
                        <div className="relative">
                          <Image
                            src={member.profilePicture}
                            alt={member.name || 'Team Member'}
                            className="w-24 h-24 rounded-full object-cover mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lavender"
                            width={96}
                          />
                          <div className="absolute inset-0 rounded-full bg-lavender-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-lavender-gradient rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lavender">
                          <Users className="w-12 h-12 text-white" />
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-lavender-300 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-primary mb-2 group-hover:text-lavender-600 transition-colors">
                      {member.name}
                    </h3>
                    <p className="font-paragraph text-sm text-secondary font-medium mb-4 bg-lavender-100 px-3 py-1 rounded-full inline-block">
                      {member.role}
                    </p>
                    <p className="font-paragraph text-sm text-foreground/80 leading-relaxed">
                      {member.introduction}
                    </p>
                    {member.linkedinProfile && (
                      <div className="mt-4">
                        <a
                          href={member.linkedinProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-paragraph text-xs text-lavender-600 hover:text-lavender-800 hover:underline transition-colors inline-flex items-center space-x-1"
                        >
                          <span>LinkedIn Profile</span>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                          </svg>
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Company Milestones */}
      <section className="py-24 bg-lavender-gradient-dark relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-lavender-600/20 to-lavender-800/20"></div>
          <div className="absolute top-20 left-10 w-40 h-40 bg-white/5 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-[120rem] mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-white">
              OUR <span className="text-lavender-200">JOURNEY</span>
            </h2>
            <p className="font-paragraph text-lg text-white/90 max-w-3xl mx-auto">
              Key milestones that have shaped our growth and success story
            </p>
          </div>

          <div className="space-y-16">
            {milestones.map((milestone, index) => (
              <div key={milestone._id} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} animate-slide-up`} style={{animationDelay: `${index * 0.2}s`}}>
                <div className="lg:w-1/2 group">
                  {milestone.milestoneImage ? (
                    <div className="relative overflow-hidden rounded-2xl shadow-lavender-xl">
                      <Image
                        src={milestone.milestoneImage}
                        alt={milestone.milestoneTitle || 'Milestone'}
                        className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                        width={600}
                      />
                      <div className="absolute inset-0 bg-lavender-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300 shadow-lavender-xl">
                      <Award className="w-16 h-16 text-lavender-200 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}
                </div>
                <div className="lg:w-1/2 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-lavender-200 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-lavender-800" />
                    </div>
                    <span className="font-paragraph text-lg text-lavender-200 font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                      {milestone.milestoneDate ? new Date(milestone.milestoneDate).getFullYear() : 'TBD'}
                    </span>
                  </div>
                  <h3 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight">
                    {milestone.milestoneTitle}
                  </h3>
                  <p className="font-paragraph text-white/90 leading-relaxed text-lg">
                    {milestone.description}
                  </p>
                  {milestone.isAchieved && (
                    <div className="inline-flex items-center space-x-3 bg-lavender-200/20 px-4 py-2 rounded-full backdrop-blur-sm border border-lavender-200/30">
                      <Award className="w-5 h-5 text-lavender-200" />
                      <span className="font-paragraph text-sm text-lavender-200 font-medium">ACHIEVED</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-lavender-gradient opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-lavender-gradient opacity-10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-[120rem] mx-auto px-6 text-center relative z-10">
          <div className="animate-slide-up">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              JOIN OUR <span className="text-transparent bg-clip-text bg-lavender-gradient">MISSION</span>
            </h2>
            <p className="font-paragraph text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Ready to be part of something extraordinary? Explore opportunities to grow with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Button asChild size="lg" className="bg-lavender-gradient text-white hover:shadow-lavender-lg transition-all duration-300 hover:scale-105 border-0">
                <Link to="/careers">
                  <Users className="w-5 h-5 mr-2" />
                  VIEW CAREERS
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-lavender-300 text-lavender-600 hover:bg-lavender-50 hover:border-lavender-400 transition-all duration-300 hover:scale-105">
                <Link to="/contact">
                  <Sparkles className="w-5 h-5 mr-2" />
                  GET IN TOUCH
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-lavender-gradient-soft border-t border-lavender-200 py-16 relative">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 animate-slide-in-left">
              <h3 className="font-heading text-lg font-bold text-primary">MASTERSOLIS</h3>
              <p className="font-paragraph text-sm text-muted-foreground">
                Next-generation technology solutions for modern businesses
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-lavender-400 rounded-full animate-pulse-soft"></div>
                <span className="font-paragraph text-xs text-lavender-600">Innovating since 2020</span>
              </div>
            </div>
            <div className="space-y-4 animate-slide-up" style={{animationDelay: '0.1s'}}>
              <h4 className="font-heading text-sm font-bold text-primary">SERVICES</h4>
              <div className="space-y-2">
                <Link to="/services" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-600 transition-colors">
                  AI Solutions
                </Link>
                <Link to="/services" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-600 transition-colors">
                  Cloud Computing
                </Link>
                <Link to="/services" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-600 transition-colors">
                  Mobile Development
                </Link>
              </div>
            </div>
            <div className="space-y-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <h4 className="font-heading text-sm font-bold text-primary">COMPANY</h4>
              <div className="space-y-2">
                <Link to="/about" className="block font-paragraph text-sm text-secondary font-medium">
                  About Us
                </Link>
                <Link to="/careers" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-600 transition-colors">
                  Careers
                </Link>
                <Link to="/blog" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-600 transition-colors">
                  Blog
                </Link>
              </div>
            </div>
            <div className="space-y-4 animate-slide-in-right">
              <h4 className="font-heading text-sm font-bold text-primary">CONNECT</h4>
              <div className="space-y-2">
                <Link to="/contact" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-600 transition-colors">
                  Contact Us
                </Link>
                <a href="mailto:info@mastersolis.com" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-600 transition-colors">
                  info@mastersolis.com
                </a>
                <a href="tel:+1234567890" className="block font-paragraph text-sm text-muted-foreground hover:text-lavender-600 transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-lavender-200 mt-12 pt-8 text-center animate-fade-in">
            <p className="font-paragraph text-sm text-muted-foreground">
              © 2024 Mastersolis Infotech. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}