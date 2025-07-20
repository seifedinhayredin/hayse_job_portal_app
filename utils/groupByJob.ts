// utils/groupByJob.ts

export interface ApplicantData {
  jobname: string;
  applicant: {
    firstname: string;
    lastname: string;
    email: string;
    image?: string;
    // add other fields if needed
  };
  // add other top-level fields if needed
}

export const groupByJob = (applications: ApplicantData[]) => {
  const grouped: Record<string, ApplicantData[]> = {};

  applications.forEach((app) => {
    const jobname = app.jobname || 'Unknown Job';
    if (!grouped[jobname]) grouped[jobname] = [];
    grouped[jobname].push(app);
  });

  return grouped;
};
