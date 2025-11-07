import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { BlogDetailModal } from '@/components/ui/blog-detail-modal';
import { ArrowLeft, Search, Calendar, User, Clock, ArrowRight, Filter } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { BlogPosts } from '@/entities';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPosts[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPosts[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPosts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullPost, setShowFullPost] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { items } = await BaseCrudService.getAll<BlogPosts>('blogposts');
        // Sort by publish date, newest first
        const sortedPosts = items.sort((a, b) => {
          const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
          const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
          return dateB - dateA;
        });
        setPosts(sortedPosts);
        setFilteredPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm]);

  const handleReadMore = (post: BlogPosts) => {
    setSelectedPost(post);
    setShowFullPost(true);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string | undefined) => {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  const getExcerpt = (content: string | undefined, length: number = 150) => {
    if (!content) return '';
    return content.length > length ? content.substring(0, length) + '...' : content;
  };

  if (showFullPost && selectedPost) {
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
                <Link to="/careers" className="font-paragraph text-sm text-foreground hover:text-secondary transition-colors">
                  CAREERS
                </Link>
                <Link to="/blog" className="font-paragraph text-sm text-secondary font-medium">
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

        {/* Full Post View */}
        <article className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center mb-8">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFullPost(false)}
                className="text-foreground hover:text-secondary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </div>

            {/* Post Header */}
            <header className="mb-12">
              {selectedPost.featuredImage && (
                <div className="aspect-video mb-8 overflow-hidden rounded-lg">
                  <Image
                    src={selectedPost.featuredImage}
                    alt={selectedPost.title || 'Blog post'}
                    className="w-full h-full object-cover"
                    width={800}
                  />
                </div>
              )}
              
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                {selectedPost.title}
              </h1>
              
              {selectedPost.summary && (
                <p className="font-paragraph text-xl text-foreground/80 leading-relaxed mb-6">
                  {selectedPost.summary}
                </p>
              )}
              
              <div className="flex items-center gap-6 text-foreground/60 border-b border-gridline pb-6">
                {selectedPost.author && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span className="font-paragraph text-sm">{selectedPost.author}</span>
                  </div>
                )}
                {selectedPost.publishDate && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-paragraph text-sm">{formatDate(selectedPost.publishDate)}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-paragraph text-sm">{getReadingTime(selectedPost.content)}</span>
                </div>
              </div>
            </header>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none">
              <div className="font-paragraph text-foreground leading-relaxed whitespace-pre-wrap">
                {selectedPost.content}
              </div>
            </div>

            {/* Post Footer */}
            <footer className="mt-12 pt-8 border-t border-gridline">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="font-paragraph text-sm text-foreground/60">
                    Published on {formatDate(selectedPost.publishDate)}
                  </p>
                  {selectedPost.author && (
                    <p className="font-paragraph text-sm text-foreground/80">
                      By {selectedPost.author}
                    </p>
                  )}
                </div>
                <div className="flex gap-4">
                  <Button asChild variant="outline">
                    <Link to="/contact">Get In Touch</Link>
                  </Button>
                  <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    <Link to="/services">Our Services</Link>
                  </Button>
                </div>
              </div>
            </footer>
          </div>
        </article>

        {/* Related Posts */}
        <section className="py-16 bg-gradient-to-r from-lavendergradientstart to-lavendergradientend">
          <div className="max-w-[120rem] mx-auto px-6">
            <h2 className="font-heading text-3xl font-bold text-primary mb-8 text-center">
              MORE INSIGHTS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.filter(post => post._id !== selectedPost._id).slice(0, 3).map((post) => (
                <Card key={post._id} className="border-gridline bg-background/80 backdrop-blur-sm hover:border-secondary transition-colors group cursor-pointer" onClick={() => handleReadMore(post)}>
                  {post.featuredImage && (
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title || 'Blog post'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        width={400}
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg font-bold text-primary mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="font-paragraph text-sm text-foreground/80 line-clamp-3 mb-4">
                      {post.summary || getExcerpt(post.content)}
                    </p>
                    <div className="flex items-center justify-between text-foreground/60">
                      <span className="font-paragraph text-xs">{formatDate(post.publishDate)}</span>
                      <span className="font-paragraph text-xs">{getReadingTime(post.content)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                  <Link to="/blog" className="block font-paragraph text-sm text-secondary">
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
              <Link to="/careers" className="font-paragraph text-sm text-foreground hover:text-secondary transition-colors">
                CAREERS
              </Link>
              <Link to="/blog" className="font-paragraph text-sm text-secondary font-medium">
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
                TECH <span className="text-secondary">INSIGHTS</span>
              </h1>
              <p className="font-paragraph text-xl text-primary-foreground/90 leading-relaxed">
                Stay ahead of the curve with our latest thoughts on technology trends, 
                industry insights, and innovative solutions.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-lavendergradientstart to-lavendergradientend rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-heading text-4xl font-bold text-primary mb-2">{posts.length}+</div>
                  <div className="font-paragraph text-sm text-primary/80">ARTICLES PUBLISHED</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-background border-b border-gridline">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-paragraph"
              />
            </div>
            <div className="font-paragraph text-sm text-foreground/60">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {filteredPosts.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-lavendergradientstart to-lavendergradientend">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="text-center mb-12">
              <Badge className="bg-secondary text-secondary-foreground mb-4">FEATURED</Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary">
                LATEST INSIGHTS
              </h2>
            </div>
            
            <Card className="border-gridline bg-background/80 backdrop-blur-sm hover:border-secondary transition-colors group cursor-pointer" onClick={() => handleReadMore(filteredPosts[0])}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {filteredPosts[0].featuredImage && (
                  <div className="aspect-video lg:aspect-square overflow-hidden">
                    <Image
                      src={filteredPosts[0].featuredImage}
                      alt={filteredPosts[0].title || 'Featured blog post'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      width={600}
                    />
                  </div>
                )}
                <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-foreground/60 mb-4">
                    {filteredPosts[0].author && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span className="font-paragraph text-sm">{filteredPosts[0].author}</span>
                      </div>
                    )}
                    {filteredPosts[0].publishDate && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="font-paragraph text-sm">{formatDate(filteredPosts[0].publishDate)}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="font-paragraph text-sm">{getReadingTime(filteredPosts[0].content)}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4 group-hover:text-secondary transition-colors">
                    {filteredPosts[0].title}
                  </h3>
                  
                  <p className="font-paragraph text-foreground/80 leading-relaxed mb-6">
                    {filteredPosts[0].summary || getExcerpt(filteredPosts[0].content, 200)}
                  </p>
                  
                  <BlogDetailModal
                    post={filteredPosts[0]}
                    trigger={
                      <Button variant="outline" className="self-start group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:border-secondary">
                        Read Full Article <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    }
                  />
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
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
                        <div className="flex justify-between">
                          <div className="h-4 bg-gridline rounded w-20"></div>
                          <div className="h-4 bg-gridline rounded w-16"></div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-lavendergradientstart to-lavendergradientend rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                No Articles Found
              </h3>
              <p className="font-paragraph text-foreground/80 mb-6">
                Try adjusting your search terms to find what you're looking for.
              </p>
              <Button onClick={() => setSearchTerm('')} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(1).map((post) => (
                <Card key={post._id} className="border-gridline hover:border-secondary transition-colors group">
                  {post.featuredImage && (
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title || 'Blog post'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        width={400}
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-foreground/60 mb-3">
                      {post.author && (
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          <span className="font-paragraph text-xs">{post.author}</span>
                        </div>
                      )}
                      {post.publishDate && (
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span className="font-paragraph text-xs">{formatDate(post.publishDate)}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span className="font-paragraph text-xs">{getReadingTime(post.content)}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-heading text-lg font-bold text-primary mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="font-paragraph text-sm text-foreground/80 line-clamp-3 mb-4 leading-relaxed">
                      {post.summary || getExcerpt(post.content)}
                    </p>
                    
                    <BlogDetailModal
                      post={post}
                      trigger={
                        <Button variant="ghost" size="sm" className="p-0 h-auto font-paragraph text-sm text-secondary hover:text-secondary/80 hover:bg-transparent">
                          Read More <ArrowRight className="ml-1 w-3 h-3" />
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-[120rem] mx-auto px-6 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            STAY UPDATED
          </h2>
          <p className="font-paragraph text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Subscribe to our newsletter and never miss the latest insights on technology and innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-background text-foreground border-gridline"
            />
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 whitespace-nowrap">
              SUBSCRIBE
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
                <Link to="/blog" className="block font-paragraph text-sm text-secondary">
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