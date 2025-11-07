import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Image } from '@/components/ui/image';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Briefcase, 
  Settings, 
  TrendingUp, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  Download,
  Mail,
  Calendar,
  Star,
  ArrowLeft,
  Sparkles,
  Brain,
  Activity,
  Globe,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Save,
  X,
  Upload,
  ExternalLink
} from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { BlogPosts, JobApplications, Testimonials, Projects, Services, TeamMembers } from '@/entities';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [blogPosts, setBlogPosts] = useState<BlogPosts[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplications[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonials[]>([]);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [services, setServices] = useState<Services[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMembers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: string; name: string } | null>(null);
  
  // Form states for adding/editing items
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formType, setFormType] = useState<'blog' | 'project' | 'service' | 'testimonial' | 'team'>('blog');
  const [formData, setFormData] = useState<any>({});

  // Filtered data based on search and status
  const filteredApplications = jobApplications.filter(app => {
    const matchesSearch = searchTerm === '' || 
      app.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.skills?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.applicationStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          blogData,
          applicationsData,
          testimonialsData,
          projectsData,
          servicesData,
          teamData
        ] = await Promise.all([
          BaseCrudService.getAll<BlogPosts>('blogposts'),
          BaseCrudService.getAll<JobApplications>('jobapplications'),
          BaseCrudService.getAll<Testimonials>('testimonials'),
          BaseCrudService.getAll<Projects>('projects'),
          BaseCrudService.getAll<Services>('services'),
          BaseCrudService.getAll<TeamMembers>('teammembers')
        ]);

        setBlogPosts(blogData.items);
        setJobApplications(applicationsData.items);
        setTestimonials(testimonialsData.items);
        setProjects(projectsData.items);
        setServices(servicesData.items);
        setTeamMembers(teamData.items);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        showError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Utility functions
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const showError = (message: string) => {
    alert(message); // Simple error handling - could be enhanced with toast notifications
  };

  const resetForm = () => {
    setFormData({});
    setEditingItem(null);
    setShowAddDialog(false);
  };

  // CRUD Operations
  const handleDelete = async (id: string, type: string) => {
    setIsSubmitting(true);
    try {
      const collectionMap = {
        'blog': 'blogposts',
        'project': 'projects',
        'service': 'services',
        'testimonial': 'testimonials',
        'team': 'teammembers',
        'application': 'jobapplications'
      };

      await BaseCrudService.delete(collectionMap[type as keyof typeof collectionMap], id);
      
      // Update local state
      switch (type) {
        case 'blog':
          setBlogPosts(prev => prev.filter(item => item._id !== id));
          break;
        case 'project':
          setProjects(prev => prev.filter(item => item._id !== id));
          break;
        case 'service':
          setServices(prev => prev.filter(item => item._id !== id));
          break;
        case 'testimonial':
          setTestimonials(prev => prev.filter(item => item._id !== id));
          break;
        case 'team':
          setTeamMembers(prev => prev.filter(item => item._id !== id));
          break;
        case 'application':
          setJobApplications(prev => prev.filter(item => item._id !== id));
          break;
      }
      
      showSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
    } catch (error) {
      console.error('Error deleting item:', error);
      showError('Failed to delete item');
    } finally {
      setIsSubmitting(false);
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const collectionMap = {
        'blog': 'blogposts',
        'project': 'projects',
        'service': 'services',
        'testimonial': 'testimonials',
        'team': 'teammembers'
      };

      const collection = collectionMap[formType];
      let savedItem;

      if (editingItem) {
        // Update existing item
        savedItem = await BaseCrudService.update(collection, { ...formData, _id: editingItem._id });
      } else {
        // Create new item
        savedItem = await BaseCrudService.create(collection, { ...formData, _id: crypto.randomUUID() });
      }

      // Update local state
      switch (formType) {
        case 'blog':
          if (editingItem) {
            setBlogPosts(prev => prev.map(item => item._id === editingItem._id ? savedItem : item));
          } else {
            setBlogPosts(prev => [...prev, savedItem]);
          }
          break;
        case 'project':
          if (editingItem) {
            setProjects(prev => prev.map(item => item._id === editingItem._id ? savedItem : item));
          } else {
            setProjects(prev => [...prev, savedItem]);
          }
          break;
        case 'service':
          if (editingItem) {
            setServices(prev => prev.map(item => item._id === editingItem._id ? savedItem : item));
          } else {
            setServices(prev => [...prev, savedItem]);
          }
          break;
        case 'testimonial':
          if (editingItem) {
            setTestimonials(prev => prev.map(item => item._id === editingItem._id ? savedItem : item));
          } else {
            setTestimonials(prev => [...prev, savedItem]);
          }
          break;
        case 'team':
          if (editingItem) {
            setTeamMembers(prev => prev.map(item => item._id === editingItem._id ? savedItem : item));
          } else {
            setTeamMembers(prev => [...prev, savedItem]);
          }
          break;
      }

      showSuccess(`${formType.charAt(0).toUpperCase() + formType.slice(1)} ${editingItem ? 'updated' : 'created'} successfully`);
      resetForm();
    } catch (error) {
      console.error('Error saving item:', error);
      showError('Failed to save item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item);
    setFormType(type as any);
    setFormData(item);
    setShowAddDialog(true);
  };

  const handleAdd = (type: string) => {
    setEditingItem(null);
    setFormType(type as any);
    setFormData({});
    setShowAddDialog(true);
  };

  const confirmDelete = (id: string, type: string, name: string) => {
    setItemToDelete({ id, type, name });
    setShowDeleteDialog(true);
  };

  // Export functionality
  const handleExport = (type: string) => {
    try {
      let data: any[] = [];
      let filename = '';

      switch (type) {
        case 'applications':
          data = filteredApplications;
          filename = 'job-applications.csv';
          break;
        case 'analytics':
          data = [
            { metric: 'Page Views', value: '12.5K', change: '+15%' },
            { metric: 'Unique Visitors', value: '3.2K', change: '+8%' },
            { metric: 'Contact Forms', value: '89', change: '+23%' },
            { metric: 'Average Rating', value: '4.2', change: '+0.3' }
          ];
          filename = 'analytics-report.csv';
          break;
        default:
          showError('Export type not supported');
          return;
      }

      if (data.length === 0) {
        showError('No data to export');
        return;
      }

      // Convert to CSV
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => Object.values(item).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;

      // Download file
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);

      showSuccess(`${filename} exported successfully`);
    } catch (error) {
      console.error('Error exporting data:', error);
      showError('Failed to export data');
    }
  };

  // Download resume function
  const downloadResume = (application: JobApplications) => {
    try {
      const currentDate = new Date().toLocaleDateString();
      
      const resumeContent = `
RESUME - ${application.firstName} ${application.lastName}
Downloaded on: ${currentDate}

PERSONAL INFORMATION
Name: ${application.firstName} ${application.lastName}
Email: ${application.email}
Phone: ${application.phoneNumber || 'Not provided'}

EXPERIENCE
Years of Experience: ${application.yearsOfExperience || 'Not specified'}

SKILLS
${application.skills || 'Not specified'}

RESUME CONTENT
${application.resumeFile || 'No resume content available'}

APPLICATION DETAILS
Status: ${application.applicationStatus || 'Pending'}
Submission Date: ${application.submissionDate ? new Date(application.submissionDate).toLocaleDateString() : 'Unknown'}

---
Downloaded from Mastersolis Admin Dashboard
      `.trim();

      const blob = new Blob([resumeContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${application.firstName}_${application.lastName}_Resume.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccess(`Resume downloaded: ${application.firstName} ${application.lastName}`);
    } catch (error) {
      console.error('Error downloading resume:', error);
      showError('Failed to download resume');
    }
  };

  // Application status update
  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    setIsSubmitting(true);
    try {
      const application = jobApplications.find(app => app._id === applicationId);
      if (!application) return;

      const updatedApplication = await BaseCrudService.update('jobapplications', {
        ...application,
        applicationStatus: newStatus
      });

      setJobApplications(prev => 
        prev.map(app => app._id === applicationId ? updatedApplication : app)
      );

      showSuccess(`Application status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating application status:', error);
      showError('Failed to update application status');
    } finally {
      setIsSubmitting(false);
    }
  };

  // AI-powered summary calculations
  const getAISummary = () => {
    const totalContent = blogPosts.length + projects.length + services.length;
    const pendingApplications = jobApplications.filter(app => app.applicationStatus === 'pending').length;
    const avgRating = testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length || 0;
    
    return {
      contentHealth: totalContent > 10 ? 'Excellent' : totalContent > 5 ? 'Good' : 'Needs Attention',
      engagementTrend: avgRating > 4 ? 'Positive' : avgRating > 3 ? 'Stable' : 'Declining',
      actionItems: [
        pendingApplications > 0 && `${pendingApplications} job applications need review`,
        blogPosts.length < 5 && 'Consider adding more blog content',
        testimonials.length < 10 && 'Collect more customer testimonials'
      ].filter(Boolean)
    };
  };

  const aiSummary = getAISummary();

  return (
    <div className="min-h-screen bg-lavender-gradient-soft animate-fade-in">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-right">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{itemToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => itemToDelete && handleDelete(itemToDelete.id, itemToDelete.type)}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit' : 'Add'} {formType.charAt(0).toUpperCase() + formType.slice(1)}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {formType === 'blog' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter blog post title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Enter author name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Enter blog post summary"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter blog post content"
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                    placeholder="Enter image URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publishDate">Publish Date</Label>
                  <Input
                    id="publishDate"
                    type="datetime-local"
                    value={formData.publishDate ? new Date(formData.publishDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                  />
                </div>
              </>
            )}

            {formType === 'project' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                    placeholder="Enter project name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    placeholder="Enter client name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Description *</Label>
                  <Textarea
                    id="projectDescription"
                    value={formData.projectDescription || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectDescription: e.target.value }))}
                    placeholder="Enter project description"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectImage">Project Image URL</Label>
                  <Input
                    id="projectImage"
                    value={formData.projectImage || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectImage: e.target.value }))}
                    placeholder="Enter image URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectUrl">Project URL</Label>
                  <Input
                    id="projectUrl"
                    value={formData.projectUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectUrl: e.target.value }))}
                    placeholder="Enter project URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Enter tags (comma separated)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="completionDate">Completion Date</Label>
                  <Input
                    id="completionDate"
                    type="date"
                    value={formData.completionDate ? new Date(formData.completionDate).toISOString().slice(0, 10) : ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, completionDate: e.target.value }))}
                  />
                </div>
              </>
            )}

            {formType === 'service' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="serviceName">Service Name *</Label>
                  <Input
                    id="serviceName"
                    value={formData.serviceName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceName: e.target.value }))}
                    placeholder="Enter service name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                    placeholder="Enter short description"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullDescription">Full Description</Label>
                  <Textarea
                    id="fullDescription"
                    value={formData.fullDescription || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                    placeholder="Enter full description"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceImage">Service Image URL</Label>
                  <Input
                    id="serviceImage"
                    value={formData.serviceImage || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceImage: e.target.value }))}
                    placeholder="Enter image URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="callToActionUrl">Call to Action URL</Label>
                  <Input
                    id="callToActionUrl"
                    value={formData.callToActionUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, callToActionUrl: e.target.value }))}
                    placeholder="Enter CTA URL"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured || false}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                  />
                  <Label htmlFor="isFeatured">Featured Service</Label>
                </div>
              </>
            )}

            {formType === 'testimonial' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="authorName">Author Name *</Label>
                  <Input
                    id="authorName"
                    value={formData.authorName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                    placeholder="Enter author name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authorTitle">Author Title</Label>
                  <Input
                    id="authorTitle"
                    value={formData.authorTitle || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, authorTitle: e.target.value }))}
                    placeholder="Enter author title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testimonialText">Testimonial Text *</Label>
                  <Textarea
                    id="testimonialText"
                    value={formData.testimonialText || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, testimonialText: e.target.value }))}
                    placeholder="Enter testimonial text"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Select
                    value={formData.rating?.toString() || '5'}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, rating: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Star</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authorPhoto">Author Photo URL</Label>
                  <Input
                    id="authorPhoto"
                    value={formData.authorPhoto || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, authorPhoto: e.target.value }))}
                    placeholder="Enter photo URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="datePublished">Date Published</Label>
                  <Input
                    id="datePublished"
                    type="date"
                    value={formData.datePublished ? new Date(formData.datePublished).toISOString().slice(0, 10) : ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, datePublished: e.target.value }))}
                  />
                </div>
              </>
            )}

            {formType === 'team' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter team member name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={formData.role || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="Enter role/position"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="introduction">Introduction</Label>
                  <Textarea
                    id="introduction"
                    value={formData.introduction || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, introduction: e.target.value }))}
                    placeholder="Enter introduction/bio"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profilePicture">Profile Picture URL</Label>
                  <Input
                    id="profilePicture"
                    value={formData.profilePicture || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, profilePicture: e.target.value }))}
                    placeholder="Enter profile picture URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address</Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    value={formData.emailAddress || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, emailAddress: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinProfile">LinkedIn Profile URL</Label>
                  <Input
                    id="linkedinProfile"
                    value={formData.linkedinProfile || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedinProfile: e.target.value }))}
                    placeholder="Enter LinkedIn URL"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSubmitting}
                className="bg-lavender-gradient text-white"
              >
                {isSubmitting ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingItem ? 'Update' : 'Create'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-lavender-200 shadow-lavender">
        <div className="max-w-[120rem] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm" className="text-foreground hover:bg-lavender-100">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Site
                </Link>
              </Button>
              <div className="h-6 w-px bg-lavender-200"></div>
              <h1 className="font-heading text-xl font-bold text-primary">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-lavender-300 text-lavender-600">
                <Brain className="w-3 h-3 mr-1" />
                AI Enabled
              </Badge>
              <Button variant="outline" size="sm" className="border-lavender-300 text-lavender-600 hover:bg-lavender-50">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-8">
        <div className="max-w-[120rem] mx-auto px-6">
          {/* AI Summary Section */}
          <div className="mb-8 animate-slide-up">
            <Card className="border-lavender-200 bg-lavender-gradient shadow-lavender-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Sparkles className="w-5 h-5 mr-2" />
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Content Health</span>
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold">{aiSummary.contentHealth}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Engagement Trend</span>
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold">{aiSummary.engagementTrend}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Action Items</span>
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold">{aiSummary.actionItems.length}</div>
                  </div>
                </div>
                {aiSummary.actionItems.length > 0 && (
                  <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                    <h4 className="font-medium mb-2">Recommended Actions:</h4>
                    <ul className="space-y-1 text-sm opacity-90">
                      {aiSummary.actionItems.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-lavender-200 rounded-full mr-2"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white/70 backdrop-blur-sm border border-lavender-200">
              <TabsTrigger value="overview" className="data-[state=active]:bg-lavender-gradient data-[state=active]:text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-lavender-gradient data-[state=active]:text-white">
                <FileText className="w-4 h-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="applications" className="data-[state=active]:bg-lavender-gradient data-[state=active]:text-white">
                <Briefcase className="w-4 h-4 mr-2" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="data-[state=active]:bg-lavender-gradient data-[state=active]:text-white">
                <Star className="w-4 h-4 mr-2" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-lavender-gradient data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="team" className="data-[state=active]:bg-lavender-gradient data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                Team
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-lavender-200 hover:shadow-lavender-lg transition-all duration-300 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Blog Posts</p>
                        <p className="text-2xl font-bold text-primary">{blogPosts.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-lavender-gradient rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-lavender-200 hover:shadow-lavender-lg transition-all duration-300 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Job Applications</p>
                        <p className="text-2xl font-bold text-primary">{jobApplications.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-lavender-gradient rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-lavender-200 hover:shadow-lavender-lg transition-all duration-300 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Projects</p>
                        <p className="text-2xl font-bold text-primary">{projects.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-lavender-gradient rounded-xl flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-lavender-200 hover:shadow-lavender-lg transition-all duration-300 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Team Members</p>
                        <p className="text-2xl font-bold text-primary">{teamMembers.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-lavender-gradient rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-lavender-200 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-primary">
                      <Clock className="w-5 h-5 mr-2" />
                      Recent Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {jobApplications.slice(0, 5).map((application) => (
                        <div key={application._id} className="flex items-center justify-between p-3 bg-lavender-50 rounded-lg">
                          <div>
                            <p className="font-medium text-primary">{application.firstName} {application.lastName}</p>
                            <p className="text-sm text-muted-foreground">{application.email}</p>
                          </div>
                          <Badge 
                            variant={application.applicationStatus === 'pending' ? 'outline' : 'default'}
                            className={application.applicationStatus === 'pending' ? 'border-orange-300 text-orange-600' : ''}
                          >
                            {application.applicationStatus || 'pending'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-lavender-200 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-primary">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Latest Testimonials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {testimonials.slice(0, 3).map((testimonial) => (
                        <div key={testimonial._id} className="p-3 bg-lavender-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-primary">{testimonial.authorName}</p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < (testimonial.rating || 5) ? 'text-lavender-400 fill-current' : 'text-lavender-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {testimonial.testimonialText}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Content Management Tab */}
            <TabsContent value="content" className="space-y-6 animate-slide-up">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary">Content Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-lavender-200 focus:border-lavender-400"
                    />
                  </div>
                  <Button 
                    className="bg-lavender-gradient text-white hover:shadow-lavender-lg"
                    onClick={() => handleAdd('blog')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="blog" className="space-y-4">
                <TabsList className="bg-white/70 backdrop-blur-sm border border-lavender-200">
                  <TabsTrigger value="blog">Blog Posts</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                </TabsList>

                <TabsContent value="blog">
                  <Card className="border-lavender-200 bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Published</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {blogPosts.map((post) => (
                            <TableRow key={post._id}>
                              <TableCell className="font-medium">{post.title}</TableCell>
                              <TableCell>{post.author}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="border-green-300 text-green-600">
                                  Published
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {post.publishDate ? new Date(post.publishDate).toLocaleDateString() : 'Not set'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => window.open(`/blog`, '_blank')}
                                    title="View Post"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEdit(post, 'blog')}
                                    title="Edit Post"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => confirmDelete(post._id, 'blog', post.title || 'Blog Post')}
                                    title="Delete Post"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="projects">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-primary">Projects</h3>
                    <Button 
                      className="bg-lavender-gradient text-white"
                      onClick={() => handleAdd('project')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                  <Card className="border-lavender-200 bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                          <Card key={project._id} className="border-lavender-200 hover:shadow-lavender-lg transition-all duration-300">
                            <CardContent className="p-4">
                              {project.projectImage && (
                                <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                                  <Image
                                    src={project.projectImage}
                                    alt={project.projectName || 'Project'}
                                    className="w-full h-full object-cover"
                                    width={300}
                                  />
                                </div>
                              )}
                              <h3 className="font-bold text-primary mb-2">{project.projectName}</h3>
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {project.projectDescription}
                              </p>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="border-lavender-300 text-lavender-600">
                                  {project.clientName}
                                </Badge>
                                <div className="flex items-center space-x-1">
                                  {project.projectUrl && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => window.open(project.projectUrl, '_blank')}
                                      title="View Project"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEdit(project, 'project')}
                                    title="Edit Project"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-600"
                                    onClick={() => confirmDelete(project._id, 'project', project.projectName || 'Project')}
                                    title="Delete Project"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="services">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-primary">Services</h3>
                    <Button 
                      className="bg-lavender-gradient text-white"
                      onClick={() => handleAdd('service')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                  <Card className="border-lavender-200 bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.map((service) => (
                          <Card key={service._id} className="border-lavender-200 hover:shadow-lavender-lg transition-all duration-300">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h3 className="font-bold text-primary mb-2">{service.serviceName}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {service.shortDescription}
                                  </p>
                                </div>
                                {service.isFeatured && (
                                  <Badge className="bg-lavender-gradient text-white">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center justify-end space-x-1">
                                {service.callToActionUrl && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => window.open(service.callToActionUrl, '_blank')}
                                    title="View Service"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEdit(service, 'service')}
                                  title="Edit Service"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600"
                                  onClick={() => confirmDelete(service._id, 'service', service.serviceName || 'Service')}
                                  title="Delete Service"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Job Applications Tab */}
            <TabsContent value="applications" className="space-y-6 animate-slide-up">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary">Job Applications</h2>
                <div className="flex items-center space-x-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48 border-lavender-200">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    className="border-lavender-300 text-lavender-600"
                    onClick={() => handleExport('applications')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <Card className="border-lavender-200 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((application) => (
                        <TableRow key={application._id}>
                          <TableCell className="font-medium">
                            {application.firstName} {application.lastName}
                          </TableCell>
                          <TableCell>{application.email}</TableCell>
                          <TableCell>{application.yearsOfExperience} years</TableCell>
                          <TableCell className="max-w-48">
                            <div className="truncate" title={application.skills}>
                              {application.skills}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={application.applicationStatus || 'pending'}
                              onValueChange={(value) => updateApplicationStatus(application._id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="reviewed">Reviewed</SelectItem>
                                <SelectItem value="accepted">Accepted</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {application.submissionDate 
                              ? new Date(application.submissionDate).toLocaleDateString() 
                              : 'Unknown'
                            }
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  // View application details - could open a modal with full details
                                  alert(`Viewing application from ${application.firstName} ${application.lastName}`);
                                }}
                                title="View Application"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => downloadResume(application)}
                                title="Download Resume"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  // Send email - could open email client or modal
                                  window.open(`mailto:${application.email}?subject=Regarding your job application`, '_blank');
                                }}
                                title="Send Email"
                              >
                                <Mail className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => confirmDelete(application._id, 'application', `${application.firstName} ${application.lastName}'s application`)}
                                className="text-red-600 hover:text-red-700"
                                title="Delete Application"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-6 animate-slide-up">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary">Customer Testimonials</h2>
                <Button 
                  className="bg-lavender-gradient text-white hover:shadow-lavender-lg"
                  onClick={() => handleAdd('testimonial')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial._id} className="border-lavender-200 hover:shadow-lavender-lg transition-all duration-300 bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < (testimonial.rating || 5) ? 'text-lavender-400 fill-current' : 'text-lavender-200'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(testimonial, 'testimonial')}
                            title="Edit Testimonial"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => confirmDelete(testimonial._id, 'testimonial', `${testimonial.authorName}'s testimonial`)}
                            title="Delete Testimonial"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <blockquote className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        "{testimonial.testimonialText}"
                      </blockquote>
                      <div className="flex items-center space-x-3">
                        {testimonial.authorPhoto && (
                          <Image
                            src={testimonial.authorPhoto}
                            alt={testimonial.authorName || 'Author'}
                            className="w-10 h-10 rounded-full object-cover"
                            width={40}
                          />
                        )}
                        <div>
                          <p className="font-medium text-primary text-sm">{testimonial.authorName}</p>
                          <p className="text-xs text-muted-foreground">
                            {testimonial.authorTitle} • {testimonial.companyName}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6 animate-slide-up">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary">Analytics & Insights</h2>
                <div className="flex items-center space-x-4">
                  <Select>
                    <SelectTrigger className="w-48 border-lavender-200">
                      <SelectValue placeholder="Time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    className="border-lavender-300 text-lavender-600"
                    onClick={() => handleExport('analytics')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-lavender-200 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-lavender-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-primary">12.5K</p>
                    <p className="text-sm text-muted-foreground">Page Views</p>
                    <p className="text-xs text-green-600 mt-1">+15% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-lavender-200 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-lavender-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-primary">3.2K</p>
                    <p className="text-sm text-muted-foreground">Unique Visitors</p>
                    <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-lavender-200 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-lavender-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-primary">89</p>
                    <p className="text-sm text-muted-foreground">Contact Forms</p>
                    <p className="text-xs text-green-600 mt-1">+23% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-lavender-200 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-lavender-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-primary">4.2</p>
                    <p className="text-sm text-muted-foreground">Avg. Rating</p>
                    <p className="text-xs text-green-600 mt-1">+0.3 from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-lavender-200 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-primary">Traffic Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-lavender-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-lavender-400 mx-auto mb-2" />
                        <p className="text-muted-foreground">Chart visualization would go here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-lavender-200 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-primary">User Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-lavender-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Activity className="w-12 h-12 text-lavender-400 mx-auto mb-2" />
                        <p className="text-muted-foreground">Engagement metrics would go here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Team Management Tab */}
            <TabsContent value="team" className="space-y-6 animate-slide-up">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary">Team Management</h2>
                <Button 
                  className="bg-lavender-gradient text-white hover:shadow-lavender-lg"
                  onClick={() => handleAdd('team')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team Member
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <Card key={member._id} className="border-lavender-200 hover:shadow-lavender-lg transition-all duration-300 bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        {member.profilePicture ? (
                          <Image
                            src={member.profilePicture}
                            alt={member.name || 'Team Member'}
                            className="w-20 h-20 rounded-full object-cover mx-auto shadow-lavender"
                            width={80}
                          />
                        ) : (
                          <div className="w-20 h-20 bg-lavender-gradient rounded-full flex items-center justify-center mx-auto">
                            <Users className="w-10 h-10 text-white" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-primary mb-2">{member.name}</h3>
                      <p className="text-sm text-secondary font-medium mb-3 bg-lavender-100 px-3 py-1 rounded-full inline-block">
                        {member.role}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {member.introduction}
                      </p>
                      <div className="flex items-center justify-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(member, 'team')}
                          title="Edit Team Member"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(`mailto:${member.emailAddress}`, '_blank')}
                          title="Send Email"
                          disabled={!member.emailAddress}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => confirmDelete(member._id, 'team', member.name || 'Team Member')}
                          title="Remove Team Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}