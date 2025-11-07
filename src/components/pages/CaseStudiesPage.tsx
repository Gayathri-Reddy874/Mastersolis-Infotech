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
import { ArrowLeft, Search, Filter, Calendar, Building, ExternalLink, Plus, Star, TrendingUp, Users, Award, Target, Edit, Trash2, Download, Eye, MoreVertical } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { CaseStudies } from '@/entities';

interface CaseStudyForm {
  caseStudyTitle: string;
  clientName: string;
  industry: string;
  summary: string;
  thumbnailImage: string;
  fullCaseStudyUrl: string;
  publicationDate: string;
}

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudies[]>([]);
  const [filteredCaseStudies, setFilteredCaseStudies] = useState<CaseStudies[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [industries, setIndustries] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudies | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CaseStudyForm>({
    caseStudyTitle: '',
    clientName: '',
    industry: '',
    summary: '',
    thumbnailImage: '',
    fullCaseStudyUrl: '',
    publicationDate: ''
  });

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const { items } = await BaseCrudService.getAll<CaseStudies>('casestudies');
        setCaseStudies(items);
        setFilteredCaseStudies(items);
        
        // Extract unique industries
        const uniqueIndustries = new Set<string>();
        items.forEach(study => {
          if (study.industry) uniqueIndustries.add(study.industry);
        });
        setIndustries(Array.from(uniqueIndustries));
      } catch (error) {
        console.error('Error fetching case studies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  useEffect(() => {
    let filtered = caseStudies;

    if (searchTerm) {
      filtered = filtered.filter(study =>
        study.caseStudyTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        study.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        study.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIndustry) {
      filtered = filtered.filter(study => study.industry === selectedIndustry);
    }

    setFilteredCaseStudies(filtered);
  }, [caseStudies, searchTerm, selectedIndustry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newCaseStudy = {
        _id: crypto.randomUUID(),
        ...formData,
        publicationDate: formData.publicationDate ? new Date(formData.publicationDate) : new Date()
      };

      await BaseCrudService.create('casestudies', newCaseStudy);
      
      // Refresh the list
      const { items } = await BaseCrudService.getAll<CaseStudies>('casestudies');
      setCaseStudies(items);
      setFilteredCaseStudies(items);
      
      // Reset form
      setFormData({
        caseStudyTitle: '',
        clientName: '',
        industry: '',
        summary: '',
        thumbnailImage: '',
        fullCaseStudyUrl: '',
        publicationDate: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating case study:', error);
      alert('Error creating case study. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAISummary = async () => {
    if (!formData.caseStudyTitle || !formData.clientName) {
      alert('Please enter case study title and client name first.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate AI summary generation
      const aiSummary = `Discover how ${formData.clientName} transformed their business operations through innovative technology solutions. This comprehensive case study showcases the challenges faced, strategic approach implemented, and remarkable results achieved. Learn about the cutting-edge methodologies and best practices that led to significant improvements in efficiency, productivity, and overall business performance.`;
      
      setFormData(prev => ({ ...prev, summary: aiSummary }));
    } catch (error) {
      console.error('Error generating AI summary:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (caseStudy: CaseStudies) => {
    setSelectedCaseStudy(caseStudy);
    setFormData({
      caseStudyTitle: caseStudy.caseStudyTitle || '',
      clientName: caseStudy.clientName || '',
      industry: caseStudy.industry || '',
      summary: caseStudy.summary || '',
      thumbnailImage: caseStudy.thumbnailImage || '',
      fullCaseStudyUrl: caseStudy.fullCaseStudyUrl || '',
      publicationDate: caseStudy.publicationDate ? new Date(caseStudy.publicationDate).toISOString().slice(0, 10) : ''
    });
    setShowEditForm(true);
  };

  const handleDelete = (caseStudy: CaseStudies) => {
    setSelectedCaseStudy(caseStudy);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedCaseStudy) return;
    
    setIsSubmitting(true);
    try {
      await BaseCrudService.delete('casestudies', selectedCaseStudy._id);
      
      // Refresh the list
      const { items } = await BaseCrudService.getAll<CaseStudies>('casestudies');
      setCaseStudies(items);
      setFilteredCaseStudies(items);
      
      setShowDeleteDialog(false);
      setSelectedCaseStudy(null);
    } catch (error) {
      console.error('Error deleting case study:', error);
      alert('Error deleting case study. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseStudy) return;
    
    setIsSubmitting(true);
    try {
      const updatedCaseStudy = {
        ...selectedCaseStudy,
        ...formData,
        publicationDate: formData.publicationDate ? new Date(formData.publicationDate) : selectedCaseStudy.publicationDate
      };

      await BaseCrudService.update('casestudies', updatedCaseStudy);
      
      // Refresh the list
      const { items } = await BaseCrudService.getAll<CaseStudies>('casestudies');
      setCaseStudies(items);
      setFilteredCaseStudies(items);
      
      // Reset form
      setFormData({
        caseStudyTitle: '',
        clientName: '',
        industry: '',
        summary: '',
        thumbnailImage: '',
        fullCaseStudyUrl: '',
        publicationDate: ''
      });
      setShowEditForm(false);
      setSelectedCaseStudy(null);
    } catch (error) {
      console.error('Error updating case study:', error);
      alert('Error updating case study. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportCaseStudies = () => {
    try {
      const csvContent = [
        ['Title', 'Client', 'Industry', 'Summary', 'Publication Date', 'URL'].join(','),
        ...caseStudies.map(cs => [
          `"${cs.caseStudyTitle || ''}"`,
          `"${cs.clientName || ''}"`,
          `"${cs.industry || ''}"`,
          `"${cs.summary?.replace(/"/g, '""') || ''}"`,
          cs.publicationDate ? new Date(cs.publicationDate).toLocaleDateString() : '',
          `"${cs.fullCaseStudyUrl || ''}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `case-studies-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting case studies:', error);
      alert('Error exporting case studies. Please try again.');
    }
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
              <Link to="/services" className="font-paragraph text-sm text-foreground hover:text-secondary transition-colors">
                SERVICES
              </Link>
              <Link to="/projects" className="font-paragraph text-sm text-foreground hover:text-secondary transition-colors">
                PROJECTS
              </Link>
              <Link to="/case-studies" className="font-paragraph text-sm text-secondary font-medium">
                CASE STUDIES
              </Link>
              <Link to="/testimonials" className="font-paragraph text-sm text-foreground hover:text-secondary transition-colors">
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
                SUCCESS <span className="text-secondary">STORIES</span>
              </h1>
              <p className="font-paragraph text-xl text-primary-foreground/90 leading-relaxed mb-8">
                Explore real-world case studies showcasing how we've helped businesses 
                transform their operations and achieve remarkable results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      <Plus className="w-5 h-5 mr-2" />
                      ADD CASE STUDY
                    </Button>
                  </DialogTrigger>
                </Dialog>
                <Button 
                  onClick={exportCaseStudies}
                  variant="outline" 
                  size="lg" 
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  <Download className="w-5 h-5 mr-2" />
                  EXPORT DATA
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Link to="/testimonials">
                    <Users className="w-5 h-5 mr-2" />
                    VIEW TESTIMONIALS
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-lavendergradientstart to-lavendergradientend rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-heading text-4xl font-bold text-primary mb-2">{caseStudies.length}+</div>
                  <div className="font-paragraph text-sm text-primary/80">SUCCESS STORIES</div>
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
                  placeholder="Search case studies by title, client, or summary..."
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
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gridline rounded-md font-paragraph text-sm"
                >
                  <option value="">All Industries</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="mt-4 font-paragraph text-sm text-foreground/60">
            Showing {filteredCaseStudies.length} of {caseStudies.length} case studies
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-[120rem] mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-gridline animate-pulse">
                  <div className="aspect-video bg-gridline"></div>
                  <CardContent className="p-8">
                    <div className="h-6 bg-gridline rounded mb-4"></div>
                    <div className="h-4 bg-gridline rounded mb-2"></div>
                    <div className="h-4 bg-gridline rounded mb-4 w-3/4"></div>
                    <div className="h-20 bg-gridline rounded mb-4"></div>
                    <div className="h-8 bg-gridline rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCaseStudies.length === 0 ? (
            <div className="text-center py-16">
              <Award className="w-16 h-16 text-foreground/40 mx-auto mb-6" />
              <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                No Case Studies Found
              </h3>
              <p className="font-paragraph text-foreground/80 mb-8">
                Try adjusting your search criteria or add a new case study.
              </p>
              <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogTrigger asChild>
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Case Study
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCaseStudies.map((caseStudy, index) => (
                <Card key={caseStudy._id} className="border-gridline hover:border-secondary transition-colors group overflow-hidden">
                  {caseStudy.thumbnailImage && (
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={caseStudy.thumbnailImage}
                        alt={caseStudy.caseStudyTitle || 'Case Study'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        width={400}
                      />
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                        {caseStudy.industry || 'Technology'}
                      </Badge>
                      {caseStudy.publicationDate && (
                        <div className="flex items-center text-foreground/60">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="font-paragraph text-xs">
                            {new Date(caseStudy.publicationDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-heading text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                      {caseStudy.caseStudyTitle}
                    </h3>
                    
                    <div className="flex items-center text-foreground/60 mb-4">
                      <Building className="w-4 h-4 mr-1" />
                      <span className="font-paragraph text-sm font-medium">
                        {caseStudy.clientName}
                      </span>
                    </div>
                    
                    <p className="font-paragraph text-foreground/80 leading-relaxed mb-6 line-clamp-3">
                      {caseStudy.summary}
                    </p>
                    
                    <div className="flex gap-3">
                      {caseStudy.fullCaseStudyUrl && (
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <a href={caseStudy.fullCaseStudyUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Full Study
                          </a>
                        </Button>
                      )}
                      <Button variant="default" size="sm" className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        <Target className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add Case Study Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold text-primary">
              Add New Case Study
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="caseStudyTitle" className="font-paragraph text-sm font-medium">Case Study Title *</Label>
                <Input
                  id="caseStudyTitle"
                  required
                  value={formData.caseStudyTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, caseStudyTitle: e.target.value }))}
                  placeholder="Enter case study title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientName" className="font-paragraph text-sm font-medium">Client Name *</Label>
                <Input
                  id="clientName"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="Enter client name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="industry" className="font-paragraph text-sm font-medium">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="e.g., Healthcare, Finance, Technology"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publicationDate" className="font-paragraph text-sm font-medium">Publication Date</Label>
                <Input
                  id="publicationDate"
                  type="date"
                  value={formData.publicationDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, publicationDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailImage" className="font-paragraph text-sm font-medium">Thumbnail Image URL</Label>
              <Input
                id="thumbnailImage"
                type="url"
                value={formData.thumbnailImage}
                onChange={(e) => setFormData(prev => ({ ...prev, thumbnailImage: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullCaseStudyUrl" className="font-paragraph text-sm font-medium">Full Case Study URL</Label>
              <Input
                id="fullCaseStudyUrl"
                type="url"
                value={formData.fullCaseStudyUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, fullCaseStudyUrl: e.target.value }))}
                placeholder="https://example.com/full-case-study"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="summary" className="font-paragraph text-sm font-medium">Summary *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateAISummary}
                  disabled={isSubmitting}
                  className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Generate AI Summary
                </Button>
              </div>
              <Textarea
                id="summary"
                required
                rows={6}
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Enter case study summary or use AI generation..."
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                {isSubmitting ? 'Creating...' : 'Create Case Study'}
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
            READY TO CREATE YOUR SUCCESS STORY?
          </h2>
          <p className="font-paragraph text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Let's work together to achieve remarkable results for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link to="/contact">
                <TrendingUp className="w-5 h-5 mr-2" />
                START YOUR PROJECT
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/testimonials">
                <Users className="w-5 h-5 mr-2" />
                READ TESTIMONIALS
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
                <Link to="/case-studies" className="block font-paragraph text-sm text-secondary">
                  Case Studies
                </Link>
                <Link to="/testimonials" className="block font-paragraph text-sm text-foreground/80 hover:text-secondary">
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