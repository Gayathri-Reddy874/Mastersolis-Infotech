/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: blogposts
 * Interface for BlogPosts
 */
export interface BlogPosts {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  content?: string;
  /** @wixFieldType text */
  summary?: string;
  /** @wixFieldType text */
  author?: string;
  /** @wixFieldType datetime */
  publishDate?: Date | string;
  /** @wixFieldType image */
  featuredImage?: string;
  /** @wixFieldType text */
  seoTitle?: string;
  /** @wixFieldType text */
  seoDescription?: string;
  /** @wixFieldType text */
  slug?: string;
}


/**
 * Collection ID: casestudies
 * Interface for CaseStudies
 */
export interface CaseStudies {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  caseStudyTitle?: string;
  /** @wixFieldType text */
  clientName?: string;
  /** @wixFieldType text */
  industry?: string;
  /** @wixFieldType text */
  summary?: string;
  /** @wixFieldType image */
  thumbnailImage?: string;
  /** @wixFieldType url */
  fullCaseStudyUrl?: string;
  /** @wixFieldType date */
  publicationDate?: Date | string;
}


/**
 * Collection ID: companymilestones
 * Interface for CompanyMilestones
 */
export interface CompanyMilestones {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  milestoneTitle?: string;
  /** @wixFieldType date */
  milestoneDate?: Date | string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType image */
  milestoneImage?: string;
  /** @wixFieldType number */
  displayOrder?: number;
  /** @wixFieldType boolean */
  isAchieved?: boolean;
}


/**
 * Collection ID: jobapplications
 * Interface for JobApplications
 */
export interface JobApplications {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  firstName?: string;
  /** @wixFieldType text */
  lastName?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  phoneNumber?: string;
  /** @wixFieldType url */
  resumeFile?: string;
  /** @wixFieldType text */
  skills?: string;
  /** @wixFieldType number */
  yearsOfExperience?: number;
  /** @wixFieldType text */
  applicationStatus?: string;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
}


/**
 * Collection ID: jobopenings
 * Interface for JobOpenings
 */
export interface JobOpenings {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType url */
  applicationUrl?: string;
  /** @wixFieldType text */
  jobTitle?: string;
  /** @wixFieldType text */
  department?: string;
  /** @wixFieldType text */
  location?: string;
  /** @wixFieldType text */
  employmentType?: string;
  /** @wixFieldType text */
  jobDescription?: string;
  /** @wixFieldType date */
  datePosted?: Date | string;
  /** @wixFieldType date */
  applicationDeadline?: Date | string;
  /** @wixFieldType boolean */
  isActive?: boolean;
}


/**
 * Collection ID: projects
 * Interface for Projects
 */
export interface Projects {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  projectName?: string;
  /** @wixFieldType text */
  projectDescription?: string;
  /** @wixFieldType image */
  projectImage?: string;
  /** @wixFieldType text */
  tags?: string;
  /** @wixFieldType text */
  clientName?: string;
  /** @wixFieldType date */
  completionDate?: Date | string;
  /** @wixFieldType url */
  projectUrl?: string;
}


/**
 * Collection ID: services
 * Interface for Services
 */
export interface Services {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  serviceName?: string;
  /** @wixFieldType text */
  shortDescription?: string;
  /** @wixFieldType text */
  fullDescription?: string;
  /** @wixFieldType image */
  serviceImage?: string;
  /** @wixFieldType url */
  callToActionUrl?: string;
  /** @wixFieldType boolean */
  isFeatured?: boolean;
}


/**
 * Collection ID: teammembers
 * Interface for TeamMembers
 */
export interface TeamMembers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  name?: string;
  /** @wixFieldType text */
  role?: string;
  /** @wixFieldType image */
  profilePicture?: string;
  /** @wixFieldType text */
  introduction?: string;
  /** @wixFieldType url */
  linkedinProfile?: string;
  /** @wixFieldType text */
  emailAddress?: string;
}


/**
 * Collection ID: testimonials
 * Interface for Testimonials
 */
export interface Testimonials {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  testimonialText?: string;
  /** @wixFieldType text */
  authorName?: string;
  /** @wixFieldType text */
  authorTitle?: string;
  /** @wixFieldType text */
  companyName?: string;
  /** @wixFieldType image */
  authorPhoto?: string;
  /** @wixFieldType number */
  rating?: number;
  /** @wixFieldType date */
  datePublished?: Date | string;
}
