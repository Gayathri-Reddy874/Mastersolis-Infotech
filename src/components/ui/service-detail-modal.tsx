import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { ArrowRight, ExternalLink, X } from 'lucide-react';
import { Services } from '@/entities';

interface ServiceDetailModalProps {
  service: Services;
  trigger: React.ReactNode;
}

export function ServiceDetailModal({ service, trigger }: ServiceDetailModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-lavender-300">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-heading text-2xl font-bold text-primary">
              {service.serviceName}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Image */}
          {service.serviceImage && (
            <div className="aspect-video w-full overflow-hidden rounded-lg border border-lavender-200">
              <Image
                src={service.serviceImage}
                alt={service.serviceName || 'Service'}
                className="w-full h-full object-cover"
                width={800}
              />
            </div>
          )}

          {/* Short Description */}
          {service.shortDescription && (
            <div className="bg-lavender-gradient-soft p-6 rounded-lg border border-lavender-200">
              <h3 className="font-heading text-lg font-bold text-primary mb-3">Overview</h3>
              <p className="font-paragraph text-foreground/90 leading-relaxed">
                {service.shortDescription}
              </p>
            </div>
          )}

          {/* Full Description */}
          {service.fullDescription && (
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-primary">Detailed Information</h3>
              <div className="prose prose-lavender max-w-none">
                <p className="font-paragraph text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {service.fullDescription}
                </p>
              </div>
            </div>
          )}

          {/* Key Features (if we can extract from description) */}
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-lavender-200">
            <h3 className="font-heading text-lg font-bold text-primary mb-4">Why Choose This Service?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-lavender-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-paragraph font-semibold text-foreground mb-1">Expert Implementation</h4>
                  <p className="font-paragraph text-sm text-muted-foreground">Professional delivery by certified experts</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-lavender-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-paragraph font-semibold text-foreground mb-1">Scalable Solutions</h4>
                  <p className="font-paragraph text-sm text-muted-foreground">Built to grow with your business needs</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-lavender-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-paragraph font-semibold text-foreground mb-1">24/7 Support</h4>
                  <p className="font-paragraph text-sm text-muted-foreground">Round-the-clock assistance when you need it</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-lavender-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-paragraph font-semibold text-foreground mb-1">Proven Results</h4>
                  <p className="font-paragraph text-sm text-muted-foreground">Track record of successful implementations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-lavender-200">
            <Button 
              asChild 
              className="bg-lavender-gradient-vibrant text-white hover:shadow-glow-lavender transition-all duration-300 hover:scale-105 border-0 font-bold flex-1"
            >
              <a href="/contact">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            
            {service.callToActionUrl && (
              <Button 
                asChild 
                variant="outline" 
                className="border-lavender-400 text-lavender-700 hover:bg-lavender-gradient-vibrant hover:text-white hover:border-lavender-600 transition-all duration-300 font-medium flex-1"
              >
                <a 
                  href={service.callToActionUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View External Details <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
            )}
            
            <Button 
              asChild 
              variant="outline" 
              className="border-lavender-400 text-lavender-700 hover:bg-lavender-50 transition-all duration-300 font-medium"
            >
              <a href="/services">
                View All Services
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}