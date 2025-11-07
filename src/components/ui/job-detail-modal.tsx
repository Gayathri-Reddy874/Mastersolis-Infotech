import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, MapPin, Clock, Users, X, ExternalLink, Building } from 'lucide-react';
import { JobOpenings } from '@/entities';
import { format } from 'date-fns';

interface JobDetailModalProps {
  job: JobOpenings;
  trigger: React.ReactNode;
  onApply?: (job: JobOpenings) => void;
}

export function JobDetailModal({ job, trigger, onApply }: JobDetailModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Not specified';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'MMMM dd, yyyy');
    } catch {
      return 'Not specified';
    }
  };

  const handleApplyClick = () => {
    if (onApply) {
      onApply(job);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-lavender-300">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-heading text-2xl font-bold text-primary pr-8">
              {job.jobTitle}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {job.department && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Building className="w-4 h-4" />
                <span className="font-paragraph font-medium">{job.department}</span>
              </div>
            )}
            {job.location && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="font-paragraph">{job.location}</span>
              </div>
            )}
            {job.employmentType && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="font-paragraph">{job.employmentType}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="font-paragraph">Posted {formatDate(job.datePosted)}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge 
              variant={job.isActive ? "default" : "secondary"}
              className={job.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
            >
              {job.isActive ? "Active" : "Closed"}
            </Badge>
            {job.applicationDeadline && (
              <Badge variant="outline" className="border-orange-200 text-orange-700">
                Deadline: {formatDate(job.applicationDeadline)}
              </Badge>
            )}
          </div>

          {/* Job Description */}
          {job.jobDescription && (
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-primary">Job Description</h3>
              <div className="bg-lavender-gradient-soft p-6 rounded-lg border border-lavender-200">
                <div className="prose prose-lavender max-w-none">
                  <p className="font-paragraph text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {job.jobDescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Key Responsibilities */}
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-lavender-200">
            <h3 className="font-heading text-lg font-bold text-primary mb-4">What You'll Do</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-lavender-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-paragraph font-semibold text-foreground mb-1">Lead Innovation</h4>
                  <p className="font-paragraph text-sm text-muted-foreground">Drive cutting-edge solutions and technical excellence</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-lavender-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-paragraph font-semibold text-foreground mb-1">Collaborate</h4>
                  <p className="font-paragraph text-sm text-muted-foreground">Work with cross-functional teams on impactful projects</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-lavender-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-paragraph font-semibold text-foreground mb-1">Grow & Learn</h4>
                  <p className="font-paragraph text-sm text-muted-foreground">Continuous learning and professional development</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-lavender-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-paragraph font-semibold text-foreground mb-1">Make Impact</h4>
                  <p className="font-paragraph text-sm text-muted-foreground">Contribute to products used by millions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits & Perks */}
          <div className="bg-lavender-gradient-soft p-6 rounded-lg border border-lavender-200">
            <h3 className="font-heading text-lg font-bold text-primary mb-4">Why Join Us?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-lavender-gradient-vibrant rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-paragraph font-semibold text-foreground mb-1">Great Team</h4>
                <p className="font-paragraph text-sm text-muted-foreground">Work with talented professionals</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-lavender-gradient-vibrant rounded-full flex items-center justify-center mx-auto mb-2">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-paragraph font-semibold text-foreground mb-1">Modern Office</h4>
                <p className="font-paragraph text-sm text-muted-foreground">State-of-the-art facilities</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-lavender-gradient-vibrant rounded-full flex items-center justify-center mx-auto mb-2">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-paragraph font-semibold text-foreground mb-1">Growth</h4>
                <p className="font-paragraph text-sm text-muted-foreground">Career advancement opportunities</p>
              </div>
            </div>
          </div>

          {/* Application Information */}
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-lavender-200">
            <h3 className="font-heading text-lg font-bold text-primary mb-3">Application Process</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-paragraph">• Submit your application with resume and cover letter</p>
              <p className="font-paragraph">• Initial screening and phone interview</p>
              <p className="font-paragraph">• Technical assessment (if applicable)</p>
              <p className="font-paragraph">• Final interview with team leads</p>
              <p className="font-paragraph">• Reference check and offer</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-lavender-200">
            {job.isActive && (
              <Button 
                onClick={handleApplyClick}
                className="bg-lavender-gradient-vibrant text-white hover:shadow-glow-lavender transition-all duration-300 hover:scale-105 border-0 font-bold flex-1"
              >
                Apply for This Position <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
            
            {job.applicationUrl && (
              <Button 
                asChild 
                variant="outline" 
                className="border-lavender-400 text-lavender-700 hover:bg-lavender-gradient-vibrant hover:text-white hover:border-lavender-600 transition-all duration-300 font-medium flex-1"
              >
                <a 
                  href={job.applicationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  External Application <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
            )}
            
            <Button 
              asChild 
              variant="outline" 
              className="border-lavender-400 text-lavender-700 hover:bg-lavender-50 transition-all duration-300 font-medium"
            >
              <a href="/careers">
                View All Positions
              </a>
            </Button>
          </div>

          {/* Contact Information */}
          <div className="text-center pt-4 border-t border-lavender-200">
            <p className="font-paragraph text-sm text-muted-foreground mb-2">
              Questions about this position?
            </p>
            <Button 
              asChild 
              variant="ghost" 
              size="sm"
              className="text-lavender-700 hover:text-lavender-800 hover:bg-lavender-50"
            >
              <a href="/contact">
                Contact our HR team
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}