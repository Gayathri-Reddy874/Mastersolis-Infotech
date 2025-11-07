import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { ArrowRight, Calendar, User, X, Share2, BookOpen } from 'lucide-react';
import { BlogPosts } from '@/entities';
import { format } from 'date-fns';

interface BlogDetailModalProps {
  post: BlogPosts;
  trigger: React.ReactNode;
}

export function BlogDetailModal({ post, trigger }: BlogDetailModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Unknown date';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'MMMM dd, yyyy');
    } catch {
      return 'Unknown date';
    }
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
              {post.title}
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
          {/* Post Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-lavender-200 pb-4">
            {post.author && (
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="font-paragraph font-medium">{post.author}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="font-paragraph">{formatDate(post.publishDate)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span className="font-paragraph">Article</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="aspect-video w-full overflow-hidden rounded-lg border border-lavender-200">
              <Image
                src={post.featuredImage}
                alt={post.title || 'Blog post'}
                className="w-full h-full object-cover"
                width={800}
              />
            </div>
          )}

          {/* Summary */}
          {post.summary && (
            <div className="bg-lavender-gradient-soft p-6 rounded-lg border border-lavender-200">
              <h3 className="font-heading text-lg font-bold text-primary mb-3">Summary</h3>
              <p className="font-paragraph text-foreground/90 leading-relaxed">
                {post.summary}
              </p>
            </div>
          )}

          {/* Content */}
          {post.content && (
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-primary">Full Article</h3>
              <div className="prose prose-lavender max-w-none">
                <div className="font-paragraph text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>
            </div>
          )}

          {/* Tags/Categories (if we can extract from content) */}
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-lavender-200">
            <h3 className="font-heading text-lg font-bold text-primary mb-4">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {['Technology', 'Innovation', 'Business', 'Digital Transformation'].map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-lavender-100 text-lavender-700 rounded-full text-sm font-paragraph font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-lavender-200">
            <Button 
              asChild 
              className="bg-lavender-gradient-vibrant text-white hover:shadow-glow-lavender transition-all duration-300 hover:scale-105 border-0 font-bold flex-1"
            >
              <a href="/contact">
                Discuss This Topic <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            
            <Button 
              variant="outline" 
              className="border-lavender-400 text-lavender-700 hover:bg-lavender-50 transition-all duration-300 font-medium"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.summary,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Article
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="border-lavender-400 text-lavender-700 hover:bg-lavender-50 transition-all duration-300 font-medium"
            >
              <a href="/blog">
                View All Posts
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}