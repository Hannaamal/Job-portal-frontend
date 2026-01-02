export interface JobApplication {
  _id: string;
   job: string | Job;   // ✅ FIX
  applicant: string;
  company: string;
  resume?: string | null;
  status: string;
  createdAt: string;
}

export interface Job {
  _id: string;
  title: string;
  location: string;
  jobType?: string;
  experienceLevel?: string;
  description?: string;
}

export interface Company {
  _id: string;
  name: string;
}

export interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    location: string;
  };
  company: {
    _id: string;
    name: string;
  };
  resume: string;
  experience: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
