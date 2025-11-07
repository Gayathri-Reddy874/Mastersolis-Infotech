import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Image } from '@/components/ui/image';
import { ArrowLeft, Search, Filter, ExternalLink, Calendar, Tag } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Projects } from '@/entities';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Projects[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { items } = await BaseCrudService.getAll<Projects>('projects');
        setProjects(items);
        setFilteredProjects(items);
        
        // Extract unique tags
        const tags = new Set<string>();
        items.forEach(project => {
          if (project.tags) {
            project.tags.split(',').forEach(tag => {
              tags.add(tag.trim());
            });
          }
        });
        setAllTags(Array.from(tags));
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected tag
    if (selectedTag) {
      filtered = filtered.filter(project =>
        project.tags?.split(',').some(tag => tag.trim() === selectedTag)
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedTag]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
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
              <Link to="/projects" className="font-paragraph text-sm text-secondary font-medium">
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
                OUR <span className="text-secondary">PORTFOLIO</span>
              </h1>
              <p className="font-paragraph text-xl text-primary-foreground/90 leading-relaxed">
                Explore our successful projects and see how we've helped businesses 
                transform through innovative technology solutions.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-lavendergradientstart to-lavendergradientend rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-heading text-4xl font-bold text-primary mb-2">150+</div>
                  <div className="font-paragraph text-sm text-primary/80">PROJECTS COMPLETED</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-background border-b border-gridline">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-paragraph"
              />
            </div>

            {/* Tag Filter */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-foreground/60" />
                <span className="font-paragraph text-sm text-foreground/80">Filter by tag:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTag === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTag('')}
                  className={selectedTag === '' ? 'bg-secondary text-secondary-foreground' : ''}
                >
                  All
                </Button>
                {allTags.slice(0, 6).map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                    className={selectedTag === tag ? 'bg-secondary text-secondary-foreground' : ''}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedTag) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-6 font-paragraph text-sm text-foreground/60">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-[120rem] mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-gridline">
                  <div className="animate-pulse">
                    <div className="aspect-video bg-gridline"></div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="h-6 bg-gridline rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gridline rounded"></div>
                          <div className="h-4 bg-gridline rounded w-5/6"></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-gridline rounded w-16"></div>
                          <div className="h-6 bg-gridline rounded w-20"></div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-lavendergradientstart to-lavendergradientend rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                No Projects Found
              </h3>
              <p className="font-paragraph text-foreground/80 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button onClick={clearFilters} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Card key={project._id} className="border-gridline hover:border-secondary transition-all duration-300 group hover:shadow-xl overflow-hidden">
                  {/* Project Image */}
                  {project.projectImage && (
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={project.projectImage}
                        alt={project.projectName || 'Project'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        width={400}
                      />
                    </div>
                  )}

                  <CardContent className="p-6">
                    {/* Project Title */}
                    <h3 className="font-heading text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                      {project.projectName}
                    </h3>

                    {/* Client Name */}
                    {project.clientName && (
                      <div className="font-paragraph text-sm text-secondary font-medium mb-3">
                        {project.clientName}
                      </div>
                    )}

                    {/* Description */}
                    <p className="font-paragraph text-foreground/80 mb-4 leading-relaxed line-clamp-3">
                      {project.projectDescription}
                    </p>

                    {/* Tags */}
                    {project.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.split(',').slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-secondary/10 text-secondary rounded-full font-paragraph text-xs"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Completion Date */}
                    {project.completionDate && (
                      <div className="flex items-center text-foreground/60 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-paragraph text-sm">
                          Completed {new Date(project.completionDate).getFullYear()}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <Button asChild variant="outline" size="sm" className="group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:border-secondary">
                        <Link to="/contact">
                          Discuss Similar Project
                        </Link>
                      </Button>

                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center font-paragraph text-sm text-secondary hover:underline"
                        >
                          View Live <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-[120rem] mx-auto px-6 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            READY FOR YOUR PROJECT?
          </h2>
          <p className="font-paragraph text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Let's create something amazing together. Our team is ready to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link to="/contact">START YOUR PROJECT</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/services">EXPLORE SERVICES</Link>
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