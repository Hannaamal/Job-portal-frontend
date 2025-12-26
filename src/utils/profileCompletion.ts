export const calculateProfileCompletion = (profile: any) => {
  if (!profile) return 0;

  const fields = [
    profile.phone,
    profile.location,
    profile.title,
    profile.experienceLevel,
    profile.summary,
    profile.skills?.length,
    profile.education?.length,
    profile.experience?.length,
    profile.resume?.url,
    profile.preferences?.jobType,
  ];

  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
};
