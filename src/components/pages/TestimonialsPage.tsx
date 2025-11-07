import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Image } from '@/components/ui/image';
import { ArrowLeft, Search, Filter, Star, Plus, Users, Quote, MessageSquare, ThumbsUp, Award, Sparkles } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Testimonials } from '@/entities';

interface TestimonialForm {
  testimonialText: string;
  authorName: string;
  authorTitle: string;
  companyName: string;
  authorPhoto: string;
  rating: number;
  datePublished: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonials[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonials[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TestimonialForm>({
    testimonialText: '',
    authorName: '',
    authorTitle: '',
    companyName: '',
    authorPhoto: '',
    rating: 5,
    datePublished: ''
  });

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { items } = await BaseCrudService.getAll<Testimonials>('testimonials');
        setTestimonials(items);
        setFilteredTestimonials(items);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    let filtered = testimonials;

    if (searchTerm) {
      filtered = filtered.filter(testimonial =>
        testimonial.testimonialText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRating) {
      filtered = filtered.filter(testimonial => 
        testimonial.rating === parseInt(selectedRating)
      );
    }

    setFilteredTestimonials(filtered);
  }, [testimonials, searchTerm, selectedRating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newTestimonial = {
        _id: crypto.randomUUID(),
        ...formData,
        datePublished: formData.datePublished ? new Date(formData.datePublished) : new Date()
      };

      await BaseCrudService.create('testimonials', newTestimonial);
      
      // Refresh the list
      const { items } = await BaseCrudService.getAll<Testimonials>('testimonials');
      setTestimonials(items);
      setFilteredTestimonials(items);
      
      // Reset form
      setFormData({
        testimonialText: '',
        authorName: '',
        authorTitle: '',
        companyName: '',
        authorPhoto: '',
        rating: 5,
        datePublished: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating testimonial:', error);
      alert('Error creating testimonial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAITestimonial = async () => {
    if (!formData.authorName || !formData.companyName) {
      alert('Please enter author name and company name first.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate AI testimonial generation
      const aiTestimonials = [
        `Working with Mastersolis has been a game-changer for our business. Their innovative approach and technical expertise helped us streamline our operations and achieve remarkable growth. The team's dedication and professionalism exceeded our expectations at every step.`,
        `The solutions provided by Mastersolis transformed how we operate. Their cutting-edge technology and strategic insights delivered measurable results that significantly improved our efficiency and customer satisfaction. Highly recommended for any business looking to innovate.`,
        `Mastersolis delivered exceptional results that surpassed our goals. Their team's deep understanding of our industry challenges and their ability to provide tailored solutions made all the difference. The ROI we've seen has been outstanding.`,
        `From concept to implementation, Mastersolis demonstrated unparalleled expertise and commitment. Their innovative solutions not only solved our immediate challenges but also positioned us for long-term success. A truly remarkable partnership.`
      ];
      
      const randomTestimonial = aiTestimonials[Math.floor(Math.random() * aiTestimonials.length)];
      setFormData(prev => ({ ...prev, testimonialText: randomTestimonial }));
    } catch (error) {
      console.error('Error generating AI testimonial:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = testimonials.length > 0 
    ? testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length 
    : 5;

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
              <Link to="/services" className="font-paragraph text-sm text-foreground hover:text-secondary transition-colors">
                SERVICES
              </Link>
              <Link to="/projects" className="font-paragraph text-sm text-foreground hover:text-secondary transition-colors">
                PROJECTS
              </Link>
              <Link to="/case-studies" className="font-paragraph text-sm text-foreground hover:text-secondary transition-colors">
                CASE STUDIES
              </Link>
              <Link to="/testimonials" className="font-paragraph text-sm text-secondary font-medium">
                TESTIMONIALS
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
                CLIENT <span className="text-secondary">TESTIMONIALS</span>
              </h1>
              <p className="font-paragraph text-xl text-primary-foreground/90 leading-relaxed mb-8">
                Discover what our clients say about their experience working with us. 
                Real feedback from real businesses that have transformed with our solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      <Plus className="w-5 h-5 mr-2" />
                      ADD TESTIMONIAL
                    </Button>
                  </DialogTrigger>
                </Dialog>
                <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Link to="/case-studies">
                    <Award className="w-5 h-5 mr-2" />
                    VIEW CASE STUDIES
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-lavendergradientstart to-lavendergradientend rounded-2xl p-8 flex flex-col items-center justify-center">
                <div className="text-center mb-4">
                  <div className="font-heading text-4xl font-bold text-primary mb-2">{testimonials.length}+</div>
                  <div className="font-paragraph text-sm text-primary/80">HAPPY CLIENTS</div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-primary/40'
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-heading text-lg font-bold text-primary">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-background border-b border-gridline">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search testimonials by content, author, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-paragraph"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gridline rounded-md font-paragraph text-sm"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-4 font-paragraph text-sm text-foreground/60">
            Showing {filteredTestimonials.length} of {testimonials.length} testimonials
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-[120rem] mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-gridline animate-pulse">
                  <CardContent className="p-8">
                    <div className="h-4 bg-gridline rounded mb-4"></div>
                    <div className="h-20 bg-gridline rounded mb-6"></div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gridline rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gridline rounded w-24"></div>
                        <div className="h-3 bg-gridline rounded w-32"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 text-foreground/40 mx-auto mb-6" />
              <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                No Testimonials Found
              </h3>
              <p className="font-paragraph text-foreground/80 mb-8">
                Try adjusting your search criteria or add a new testimonial.
              </p>
              <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogTrigger asChild>
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Testimonial
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTestimonials.map((testimonial, index) => (
                <Card key={testimonial._id} className="border-gridline hover:border-secondary transition-colors group">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < (testimonial.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gridline'
                          }`}
                        />
                      ))}
                      {testimonial.datePublished && (
                        <span className="ml-auto font-paragraph text-xs text-foreground/60">
                          {new Date(testimonial.datePublished).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="relative mb-6">
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-secondary/20" />
                      <blockquote className="font-paragraph text-foreground/90 leading-relaxed pl-6">
                        "{testimonial.testimonialText}"
                      </blockquote>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {testimonial.authorPhoto ? (
                        <Image
                          src={testimonial.authorPhoto}
                          alt={testimonial.authorName || 'Client'}
                          className="w-12 h-12 rounded-full object-cover"
                          width={48}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div>
                        <div className="font-heading text-sm font-bold text-primary">
                          {testimonial.authorName}
                        </div>
                        <div className="font-paragraph text-xs text-foreground/60">
                          {testimonial.authorTitle}
                        </div>
                        <div className="font-paragraph text-xs text-secondary font-medium">
                          {testimonial.companyName}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add Testimonial Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold text-primary">
              Add New Testimonial
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="authorName" className="font-paragraph text-sm font-medium">Author Name *</Label>
                <Input
                  id="authorName"
                  required
                  value={formData.authorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                  placeholder="Enter author name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName" className="font-paragraph text-sm font-medium">Company Name *</Label>
                <Input
                  id="companyName"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Enter company name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="authorTitle" className="font-paragraph text-sm font-medium">Author Title</Label>
                <Input
                  id="authorTitle"
                  value={formData.authorTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorTitle: e.target.value }))}
                  placeholder="e.g., CEO, CTO, Marketing Director"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating" className="font-paragraph text-sm font-medium">Rating</Label>
                <select
                  id="rating"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gridline rounded-md font-paragraph text-sm"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="authorPhoto" className="font-paragraph text-sm font-medium">Author Photo URL</Label>
                <Input
                  id="authorPhoto"
                  type="url"
                  value={formData.authorPhoto}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorPhoto: e.target.value }))}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="datePublished" className="font-paragraph text-sm font-medium">Date Published</Label>
                <Input
                  id="datePublished"
                  type="date"
                  value={formData.datePublished}
                  onChange={(e) => setFormData(prev => ({ ...prev, datePublished: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="testimonialText" className="font-paragraph text-sm font-medium">Testimonial Text *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateAITestimonial}
                  disabled={isSubmitting}
                  className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate AI Testimonial
                </Button>
              </div>
              <Textarea
                id="testimonialText"
                required
                rows={6}
                value={formData.testimonialText}
                onChange={(e) => setFormData(prev => ({ ...prev, testimonialText: e.target.value }))}
                placeholder="Enter testimonial text or use AI generation..."
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                {isSubmitting ? 'Creating...' : 'Create Testimonial'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-[120rem] mx-auto px-6 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            READY TO JOIN OUR SUCCESS STORIES?
          </h2>
          <p className="font-paragraph text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Experience the same exceptional results our clients rave about.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link to="/contact">
                <ThumbsUp className="w-5 h-5 mr-2" />
                START YOUR PROJECT
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/case-studies">
                <Award className="w-5 h-5 mr-2" />
                VIEW CASE STUDIES
              </Link>
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
                <Link to="/services" className="block font-paragraph text-sm text-foreground/80 hover:text-secondary">
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
                <Link to="/case-studies" className="block font-paragraph text-sm text-foreground/80 hover:text-secondary">
                  Case Studies
                </Link>
                <Link to="/testimonials" className="block font-paragraph text-sm text-secondary">
                  Testimonials
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