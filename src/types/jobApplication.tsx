interface JobApplication {
  _id: string;
  job: string;
  applicant: string;
  company: string;
  resume?: string | null;
  status: string;
  createdAt: string;
}
