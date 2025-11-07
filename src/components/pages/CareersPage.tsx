import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { JobDetailModal } from '@/components/ui/job-detail-modal';
import { ArrowLeft, MapPin, Clock, Calendar, Users, Upload, FileText, Download, Plus, X, CheckCircle } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { JobOpenings, JobApplications } from '@/entities';

interface JobApplication {
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeText: string;
  experience: string;
  skills: string[];
  portfolio: string;
  linkedIn: string;
}

interface GeneralApplication {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumeText: string;
  skills: string[];
  experience: string;
  portfolio: string;
  linkedIn: string;
  coverLetter: string;
}

interface ResumeSection {
  id: string;
  type: 'personal' | 'experience' | 'education' | 'skills' | 'projects';
  title: string;
  content: any;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobOpenings[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobOpenings[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobOpenings | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showGeneralApplicationForm, setShowGeneralApplicationForm] = useState(false);
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  const [showMyApplications, setShowMyApplications] = useState(false);
  const [myApplications, setMyApplications] = useState<JobApplications[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [applicationData, setApplicationData] = useState<JobApplication>({
    jobId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    coverLetter: '',
    resumeText: '',
    experience: '',
    skills: [],
    portfolio: '',
    linkedIn: ''
  });
  const [generalApplicationData, setGeneralApplicationData] = useState<GeneralApplication>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    resumeText: '',
    skills: [],
    experience: '',
    portfolio: '',
    linkedIn: '',
    coverLetter: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [resumeSections, setResumeSections] = useState<ResumeSection[]>([
    {
      id: '1',
      type: 'personal',
      title: 'Personal Information',
      content: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
      }
    }
  ]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { items } = await BaseCrudService.getAll<JobOpenings>('jobopenings');
        const activeJobs = items.filter(job => job.isActive);
        setJobs(activeJobs);
        setFilteredJobs(activeJobs);
        
        // Extract unique departments and locations
        const depts = new Set<string>();
        const locs = new Set<string>();
        activeJobs.forEach(job => {
          if (job.department) depts.add(job.department);
          if (job.location) locs.add(job.location);
        });
        setDepartments(Array.from(depts));
        setLocations(Array.from(locs));
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter(job => job.department === selectedDepartment);
    }

    if (selectedLocation) {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedDepartment, selectedLocation]);

  const handleApplyClick = (job: JobOpenings) => {
    setSelectedJob(job);
    setApplicationData(prev => ({ ...prev, jobId: job._id }));
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Generate a formatted resume file
      const resumeContent = generateFormattedResume(applicationData);
      
      await BaseCrudService.create('jobapplications', {
        _id: crypto.randomUUID(),
        firstName: applicationData.firstName,
        lastName: applicationData.lastName,
        email: applicationData.email,
        phoneNumber: applicationData.phone,
        resumeFile: resumeContent, // Store formatted resume content
        skills: applicationData.skills.join(', '),
        yearsOfExperience: parseInt(applicationData.experience) || 0,
        applicationStatus: 'submitted',
        submissionDate: new Date()
      });
      
      setShowSuccessMessage(true);
      setShowApplicationForm(false);
      setApplicationData({
        jobId: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        coverLetter: '',
        resumeText: '',
        experience: '',
        skills: [],
        portfolio: '',
        linkedIn: ''
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneralApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Generate a formatted resume file
      const resumeContent = generateFormattedResume(generalApplicationData);
      
      await BaseCrudService.create('jobapplications', {
        _id: crypto.randomUUID(),
        firstName: generalApplicationData.firstName,
        lastName: generalApplicationData.lastName,
        email: generalApplicationData.email,
        phoneNumber: generalApplicationData.phone,
        resumeFile: resumeContent, // Store formatted resume content
        skills: generalApplicationData.skills.join(', '),
        yearsOfExperience: parseInt(generalApplicationData.experience) || 0,
        applicationStatus: 'general_submission',
        submissionDate: new Date()
      });
      
      setShowSuccessMessage(true);
      setShowGeneralApplicationForm(false);
      setGeneralApplicationData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        resumeText: '',
        skills: [],
        experience: '',
        portfolio: '',
        linkedIn: '',
        coverLetter: ''
      });
    } catch (error) {
      console.error('Error submitting general application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !applicationData.skills.includes(newSkill.trim())) {
      setApplicationData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const addGeneralSkill = () => {
    if (newSkill.trim() && !generalApplicationData.skills.includes(newSkill.trim())) {
      setGeneralApplicationData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setApplicationData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const removeGeneralSkill = (skillToRemove: string) => {
    setGeneralApplicationData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addResumeSection = (type: ResumeSection['type']) => {
    const newSection: ResumeSection = {
      id: Date.now().toString(),
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      content: type === 'experience' ? { company: '', position: '', duration: '', description: '' } :
               type === 'education' ? { institution: '', degree: '', year: '', gpa: '' } :
               type === 'skills' ? { categories: [] } :
               type === 'projects' ? { name: '', description: '', technologies: '', link: '' } :
               {}
    };
    setResumeSections(prev => [...prev, newSection]);
  };

  const updateResumeSection = (id: string, content: any) => {
    setResumeSections(prev => prev.map(section => 
      section.id === id ? { ...section, content } : section
    ));
  };

  const removeResumeSection = (id: string) => {
    setResumeSections(prev => prev.filter(section => section.id !== id));
  };

  const generateResumeText = () => {
    let resumeText = '';
    resumeSections.forEach(section => {
      resumeText += `\n${section.title.toUpperCase()}\n`;
      if (section.type === 'personal') {
        resumeText += `${section.content.fullName}\n${section.content.email} | ${section.content.phone}\n${section.content.location}\n\n${section.content.summary}\n`;
      } else if (section.type === 'experience') {
        resumeText += `${section.content.position} at ${section.content.company}\n${section.content.duration}\n${section.content.description}\n`;
      } else if (section.type === 'education') {
        resumeText += `${section.content.degree} - ${section.content.institution}\n${section.content.year}${section.content.gpa ? ` | GPA: ${section.content.gpa}` : ''}\n`;
      } else if (section.type === 'projects') {
        resumeText += `${section.content.name}\n${section.content.description}\nTechnologies: ${section.content.technologies}\n${section.content.link ? `Link: ${section.content.link}` : ''}\n`;
      }
      resumeText += '\n';
    });
    
    if (showApplicationForm) {
      setApplicationData(prev => ({ ...prev, resumeText }));
    } else if (showGeneralApplicationForm) {
      setGeneralApplicationData(prev => ({ ...prev, resumeText }));
    }
    setShowResumeBuilder(false);
  };

  // Generate formatted resume for download
  const generateFormattedResume = (data: JobApplication | GeneralApplication) => {
    const currentDate = new Date().toLocaleDateString();
    
    return `
RESUME
Generated on: ${currentDate}

PERSONAL INFORMATION
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
${data.portfolio ? `Portfolio: ${data.portfolio}` : ''}
${data.linkedIn ? `LinkedIn: ${data.linkedIn}` : ''}

EXPERIENCE
Years of Experience: ${data.experience || 'Not specified'}

SKILLS
${data.skills.length > 0 ? data.skills.join(', ') : 'Not specified'}

RESUME CONTENT
${data.resumeText || 'No resume content provided'}

${'coverLetter' in data && data.coverLetter ? `
COVER LETTER
${data.coverLetter}
` : ''}

---
Application submitted via Mastersolis Careers Portal
Submission Date: ${currentDate}
    `.trim();
  };

  // Fetch user's applications
  const fetchMyApplications = async (email: string) => {
    try {
      const { items } = await BaseCrudService.getAll<JobApplications>('jobapplications');
      const userApps = items.filter(app => app.email === email);
      setMyApplications(userApps);
    } catch (error) {
      console.error('Error fetching user applications:', error);
    }
  };

  // Download user's own resume
  const downloadMyResume = (application: JobApplications) => {
    try {
      const resumeContent = generateFormattedResume({
        firstName: application.firstName || '',
        lastName: application.lastName || '',
        email: application.email || '',
        phone: application.phoneNumber || '',
        experience: application.yearsOfExperience?.toString() || '',
        skills: application.skills ? application.skills.split(', ') : [],
        resumeText: application.resumeFile || '',
        portfolio: '',
        linkedIn: '',
        coverLetter: ''
      });

      const blob = new Blob([resumeContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `My_Resume_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Error downloading resume. Please try again.');
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
              <Link to="/careers" className="font-paragraph text-sm text-secondary font-medium">
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
                JOIN OUR <span className="text-secondary">TEAM</span>
              </h1>
              <p className="font-paragraph text-xl text-primary-foreground/90 leading-relaxed">
                Build the future of technology with us. Explore exciting opportunities 
                to grow your career and make a meaningful impact.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-lavendergradientstart to-lavendergradientend rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-heading text-4xl font-bold text-primary mb-2">{jobs.length}+</div>
                  <div className="font-paragraph text-sm text-primary/80">OPEN POSITIONS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-background border-b border-gridline">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="Search jobs by title, description, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="font-paragraph"
              />
            </div>
            <div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gridline rounded-md font-paragraph text-sm"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gridline rounded-md font-paragraph text-sm"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 font-paragraph text-sm text-foreground/60">
            Showing {filteredJobs.length} of {jobs.length} positions
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-24 bg-background">
        <div className="max-w-[120rem] mx-auto px-6">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-gridline">
                  <CardContent className="p-8">
                    <div className="animate-pulse space-y-4">
                      <div className="h-6 bg-gridline rounded w-1/3"></div>
                      <div className="h-4 bg-gridline rounded w-1/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gridline rounded"></div>
                        <div className="h-4 bg-gridline rounded w-5/6"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gridline rounded w-20"></div>
                        <div className="h-6 bg-gridline rounded w-16"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-foreground/40 mx-auto mb-6" />
              <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                No Positions Found
              </h3>
              <p className="font-paragraph text-foreground/80">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <Card key={job._id} className="border-gridline hover:border-secondary transition-colors group">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-heading text-2xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                              {job.jobTitle}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-foreground/60 mb-4">
                              {job.department && (
                                <div className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  <span className="font-paragraph text-sm">{job.department}</span>
                                </div>
                              )}
                              {job.location && (
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  <span className="font-paragraph text-sm">{job.location}</span>
                                </div>
                              )}
                              {job.employmentType && (
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  <span className="font-paragraph text-sm">{job.employmentType}</span>
                                </div>
                              )}
                              {job.datePosted && (
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  <span className="font-paragraph text-sm">
                                    Posted {new Date(job.datePosted).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                              {job.employmentType || 'Full-time'}
                            </Badge>
                            {job.applicationDeadline && new Date(job.applicationDeadline) > new Date() && (
                              <Badge variant="outline" className="border-secondary text-secondary">
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="font-paragraph text-foreground/80 leading-relaxed mb-6 line-clamp-3">
                          {job.jobDescription}
                        </p>
                        
                        {job.applicationDeadline && (
                          <p className="font-paragraph text-sm text-foreground/60 mb-4">
                            Application deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48">
                        <Button 
                          onClick={() => handleApplyClick(job)}
                          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        >
                          Apply Now
                        </Button>
                        <JobDetailModal
                          job={job}
                          onApply={handleApplyClick}
                          trigger={
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application Form Dialog */}
      <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold text-primary">
              Apply for {selectedJob?.jobTitle}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleApplicationSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-paragraph text-sm font-medium">First Name *</Label>
                <Input
                  id="firstName"
                  required
                  value={applicationData.firstName}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="font-paragraph text-sm font-medium">Last Name *</Label>
                <Input
                  id="lastName"
                  required
                  value={applicationData.lastName}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-paragraph text-sm font-medium">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={applicationData.email}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-paragraph text-sm font-medium">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={applicationData.phone}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="font-paragraph text-sm font-medium">Years of Experience</Label>
              <Input
                id="experience"
                value={applicationData.experience}
                onChange={(e) => setApplicationData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="e.g., 3-5 years"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-paragraph text-sm font-medium">Skills</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {applicationData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-secondary/10 text-secondary">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="portfolio" className="font-paragraph text-sm font-medium">Portfolio URL</Label>
                <Input
                  id="portfolio"
                  type="url"
                  value={applicationData.portfolio}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, portfolio: e.target.value }))}
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedIn" className="font-paragraph text-sm font-medium">LinkedIn Profile</Label>
                <Input
                  id="linkedIn"
                  type="url"
                  value={applicationData.linkedIn}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, linkedIn: e.target.value }))}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="resumeText" className="font-paragraph text-sm font-medium">Resume/CV *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResumeBuilder(true)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Build Resume
                </Button>
              </div>
              <Textarea
                id="resumeText"
                required
                rows={8}
                value={applicationData.resumeText}
                onChange={(e) => setApplicationData(prev => ({ ...prev, resumeText: e.target.value }))}
                placeholder="Paste your resume content here or use the resume builder..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverLetter" className="font-paragraph text-sm font-medium">Cover Letter *</Label>
              <Textarea
                id="coverLetter"
                required
                rows={6}
                value={applicationData.coverLetter}
                onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowApplicationForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Resume Builder Dialog */}
      <Dialog open={showResumeBuilder} onOpenChange={setShowResumeBuilder}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold text-primary">
              Resume Builder
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Builder Section */}
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                <Button type="button" size="sm" onClick={() => addResumeSection('experience')}>
                  + Experience
                </Button>
                <Button type="button" size="sm" onClick={() => addResumeSection('education')}>
                  + Education
                </Button>
                <Button type="button" size="sm" onClick={() => addResumeSection('skills')}>
                  + Skills
                </Button>
                <Button type="button" size="sm" onClick={() => addResumeSection('projects')}>
                  + Projects
                </Button>
              </div>

              <div className="space-y-4">
                {resumeSections.map((section) => (
                  <Card key={section.id} className="border-gridline">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-heading text-lg font-bold text-primary">{section.title}</h4>
                        {section.type !== 'personal' && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeResumeSection(section.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      {section.type === 'personal' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Full Name"
                            value={section.content.fullName}
                            onChange={(e) => updateResumeSection(section.id, { ...section.content, fullName: e.target.value })}
                          />
                          <Input
                            placeholder="Email"
                            value={section.content.email}
                            onChange={(e) => updateResumeSection(section.id, { ...section.content, email: e.target.value })}
                          />
                          <Input
                            placeholder="Phone"
                            value={section.content.phone}
                            onChange={(e) => updateResumeSection(section.id, { ...section.content, phone: e.target.value })}
                          />
                          <Input
                            placeholder="Location"
                            value={section.content.location}
                            onChange={(e) => updateResumeSection(section.id, { ...section.content, location: e.target.value })}
                          />
                          <div className="md:col-span-2">
                            <Textarea
                              placeholder="Professional Summary"
                              value={section.content.summary}
                              onChange={(e) => updateResumeSection(section.id, { ...section.content, summary: e.target.value })}
                            />
                          </div>
                        </div>
                      )}

                      {section.type === 'experience' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              placeholder="Company"
                              value={section.content.company}
                              onChange={(e) => updateResumeSection(section.id, { ...section.content, company: e.target.value })}
                            />
                            <Input
                              placeholder="Position"
                              value={section.content.position}
                              onChange={(e) => updateResumeSection(section.id, { ...section.content, position: e.target.value })}
                            />
                          </div>
                          <Input
                            placeholder="Duration (e.g., Jan 2020 - Present)"
                            value={section.content.duration}
                            onChange={(e) => updateResumeSection(section.id, { ...section.content, duration: e.target.value })}
                          />
                          <Textarea
                            placeholder="Job Description"
                            value={section.content.description}
                            onChange={(e) => updateResumeSection(section.id, { ...section.content, description: e.target.value })}
                          />
                        </div>
                      )}

                      {section.type === 'education' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Institution"
                            value={section.content.institution}
                            onChange={(e) => updateResumeSection(section.id, { ...section.content, institution: e.target.value })}
                          />
                          <Input
                            placeholder="Degree"
                            value={section.content.degree}
                            onChange={(e) => updateResumeSection(section.id, { ...section.content, degree: e.target.value })}
                          />
                          <Input
                            placeholder="Year"
                            value={section.content.year}
                            onChange={(e) => updateResumeSection(section.id, { ...section.content, year: e.target.value })}
                          />
                          <Input
                            placeholder="GPA (optional)"
                            value={section.content.gpa}
                            onChange={(e) => updateResumeSection(section.id, { ...section.content, gpa: e.target.value })}
                          />
                        </div>
                      )}

                      {section.type === 'projects' && (
                        <div className="space-y-4">
                          <Input
                            placeholder="Project Name"
                            value={section.content.name}
                            onChange={(e) => updateResumeSection(section.id, { ...section.content, name: e.target.value })}
                          />
                          <Textarea
                            placeholder="Project Description"
                            value={section.content.description}
                            onChange={(e) => updateResumeSection(section.id, { ...section.content, description: e.target.value })}
                          />
                          <Input
                            placeholder="Technologies Used"
                            value={section.content.technologies}
                            onChange={(e) => updateResumeSection(section.id, { ...section.content, technologies: e.target.value })}
                          />
                          <Input
                            placeholder="Project Link (optional)"
                            value={section.content.link}
                            onChange={(e) => updateResumeSection(section.id, { ...section.content, link: e.target.value })}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-background border border-gridline rounded-lg p-6">
              <h4 className="font-heading text-lg font-bold text-primary mb-4">Preview</h4>
              <div className="space-y-4 font-paragraph text-sm">
                {resumeSections.map((section) => (
                  <div key={section.id}>
                    <h5 className="font-bold text-primary uppercase mb-2">{section.title}</h5>
                    {section.type === 'personal' && (
                      <div>
                        <div className="font-bold">{section.content.fullName}</div>
                        <div>{section.content.email} | {section.content.phone}</div>
                        <div>{section.content.location}</div>
                        <div className="mt-2">{section.content.summary}</div>
                      </div>
                    )}
                    {section.type === 'experience' && (
                      <div>
                        <div className="font-bold">{section.content.position} at {section.content.company}</div>
                        <div className="text-foreground/60">{section.content.duration}</div>
                        <div className="mt-1">{section.content.description}</div>
                      </div>
                    )}
                    {section.type === 'education' && (
                      <div>
                        <div className="font-bold">{section.content.degree} - {section.content.institution}</div>
                        <div className="text-foreground/60">{section.content.year}{section.content.gpa && ` | GPA: ${section.content.gpa}`}</div>
                      </div>
                    )}
                    {section.type === 'projects' && (
                      <div>
                        <div className="font-bold">{section.content.name}</div>
                        <div>{section.content.description}</div>
                        <div className="text-foreground/60">Technologies: {section.content.technologies}</div>
                        {section.content.link && <div className="text-secondary">{section.content.link}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button onClick={generateResumeText} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Use This Resume
            </Button>
            <Button variant="outline" onClick={() => setShowResumeBuilder(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* General Application Form Dialog */}
      <Dialog open={showGeneralApplicationForm} onOpenChange={setShowGeneralApplicationForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold text-primary">
              Submit Your Resume
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleGeneralApplicationSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="generalFirstName" className="font-paragraph text-sm font-medium">First Name *</Label>
                <Input
                  id="generalFirstName"
                  required
                  value={generalApplicationData.firstName}
                  onChange={(e) => setGeneralApplicationData(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="generalLastName" className="font-paragraph text-sm font-medium">Last Name *</Label>
                <Input
                  id="generalLastName"
                  required
                  value={generalApplicationData.lastName}
                  onChange={(e) => setGeneralApplicationData(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="generalEmail" className="font-paragraph text-sm font-medium">Email *</Label>
                <Input
                  id="generalEmail"
                  type="email"
                  required
                  value={generalApplicationData.email}
                  onChange={(e) => setGeneralApplicationData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="generalPhone" className="font-paragraph text-sm font-medium">Phone</Label>
                <Input
                  id="generalPhone"
                  type="tel"
                  value={generalApplicationData.phone}
                  onChange={(e) => setGeneralApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="generalExperience" className="font-paragraph text-sm font-medium">Years of Experience</Label>
              <Input
                id="generalExperience"
                value={generalApplicationData.experience}
                onChange={(e) => setGeneralApplicationData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="e.g., 3-5 years"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-paragraph text-sm font-medium">Skills</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGeneralSkill())}
                />
                <Button type="button" onClick={addGeneralSkill} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {generalApplicationData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-secondary/10 text-secondary">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeGeneralSkill(skill)}
                      className="ml-2 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="generalPortfolio" className="font-paragraph text-sm font-medium">Portfolio URL</Label>
                <Input
                  id="generalPortfolio"
                  type="url"
                  value={generalApplicationData.portfolio}
                  onChange={(e) => setGeneralApplicationData(prev => ({ ...prev, portfolio: e.target.value }))}
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="generalLinkedIn" className="font-paragraph text-sm font-medium">LinkedIn Profile</Label>
                <Input
                  id="generalLinkedIn"
                  type="url"
                  value={generalApplicationData.linkedIn}
                  onChange={(e) => setGeneralApplicationData(prev => ({ ...prev, linkedIn: e.target.value }))}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="generalResumeText" className="font-paragraph text-sm font-medium">Resume/CV *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResumeBuilder(true)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Build Resume
                </Button>
              </div>
              <Textarea
                id="generalResumeText"
                required
                rows={8}
                value={generalApplicationData.resumeText}
                onChange={(e) => setGeneralApplicationData(prev => ({ ...prev, resumeText: e.target.value }))}
                placeholder="Paste your resume content here or use the resume builder..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="generalCoverLetter" className="font-paragraph text-sm font-medium">Cover Letter</Label>
              <Textarea
                id="generalCoverLetter"
                rows={6}
                value={generalApplicationData.coverLetter}
                onChange={(e) => setGeneralApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                placeholder="Tell us about your background and what type of opportunities interest you..."
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Resume'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowGeneralApplicationForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Message Dialog */}
      <Dialog open={showSuccessMessage} onOpenChange={setShowSuccessMessage}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold text-primary flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              Success!
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="font-paragraph text-foreground/80">
              Thank you for your submission! We've received your application and will review it carefully.
            </p>
            <p className="font-paragraph text-sm text-foreground/60">
              Our team will contact you within 5-7 business days if your profile matches our current openings.
            </p>
            
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={() => setShowSuccessMessage(false)}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                Continue Browsing
              </Button>
              <Button asChild variant="outline">
                <Link to="/about">Learn About Us</Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* My Applications Dialog */}
      <Dialog open={showMyApplications} onOpenChange={setShowMyApplications}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold text-primary">
              My Applications ({userEmail})
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {myApplications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-foreground/40 mx-auto mb-4" />
                <p className="font-paragraph text-foreground/80">
                  No applications found for this email address.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myApplications.map((application) => (
                  <Card key={application._id} className="border-gridline">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-heading text-lg font-bold text-primary mb-2">
                            Application #{application._id.slice(-8)}
                          </h3>
                          <div className="space-y-1 text-sm text-foreground/80">
                            <p><strong>Name:</strong> {application.firstName} {application.lastName}</p>
                            <p><strong>Email:</strong> {application.email}</p>
                            <p><strong>Phone:</strong> {application.phoneNumber || 'Not provided'}</p>
                            <p><strong>Experience:</strong> {application.yearsOfExperience} years</p>
                            <p><strong>Skills:</strong> {application.skills || 'Not specified'}</p>
                            <p><strong>Submitted:</strong> {application.submissionDate ? new Date(application.submissionDate).toLocaleDateString() : 'Unknown'}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge 
                            variant={application.applicationStatus === 'submitted' ? 'outline' : 'default'}
                            className={
                              application.applicationStatus === 'submitted' 
                                ? 'border-blue-300 text-blue-600' 
                                : application.applicationStatus === 'accepted'
                                ? 'bg-green-100 text-green-700'
                                : application.applicationStatus === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }
                          >
                            {application.applicationStatus || 'pending'}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadMyResume(application)}
                            className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Resume
                          </Button>
                        </div>
                      </div>
                      
                      {application.resumeFile && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-primary mb-2">Resume Preview:</h4>
                          <div className="text-sm text-foreground/80 max-h-32 overflow-y-auto">
                            <pre className="whitespace-pre-wrap font-paragraph">
                              {application.resumeFile.slice(0, 300)}
                              {application.resumeFile.length > 300 && '...'}
                            </pre>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setShowMyApplications(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Company Culture Section */}
      <section className="py-24 bg-gradient-to-r from-lavendergradientstart to-lavendergradientend">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
              WHY WORK WITH US?
            </h2>
            <p className="font-paragraph text-lg text-foreground/80 max-w-3xl mx-auto">
              Join a team that values innovation, growth, and making a real impact in the tech industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation First",
                description: "Work with cutting-edge technologies and contribute to groundbreaking projects that shape the future."
              },
              {
                title: "Growth Opportunities",
                description: "Continuous learning, mentorship programs, and clear career advancement paths for all team members."
              },
              {
                title: "Work-Life Balance",
                description: "Flexible schedules, remote work options, and comprehensive benefits to support your well-being."
              },
              {
                title: "Collaborative Culture",
                description: "Open communication, cross-functional teams, and an environment where every voice is heard."
              },
              {
                title: "Competitive Benefits",
                description: "Health insurance, retirement plans, stock options, and performance-based bonuses."
              },
              {
                title: "Global Impact",
                description: "Work on projects that serve clients worldwide and make a meaningful difference in their success."
              }
            ].map((benefit, index) => (
              <Card key={index} className="border-gridline bg-background/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <h3 className="font-heading text-lg font-bold text-primary mb-3">
                    {benefit.title}
                  </h3>
                  <p className="font-paragraph text-foreground/80 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-[120rem] mx-auto px-6 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            READY TO START YOUR JOURNEY?
          </h2>
          <p className="font-paragraph text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Don't see the perfect role? Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowGeneralApplicationForm(true)}
              size="lg" 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              SEND YOUR RESUME
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/about">LEARN ABOUT US</Link>
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
                <Link to="/careers" className="block font-paragraph text-sm text-secondary">
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