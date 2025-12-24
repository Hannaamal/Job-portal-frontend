export interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  
  experienceLevel: string;
  salaryRange?: {
    min: number;
    max: number;
  };
  company: {
    _id: string;
    name: string;
  };
  requiredSkills: {
    _id: string;
    name: string;
  }[];
}
