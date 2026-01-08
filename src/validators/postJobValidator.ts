import * as yup from "yup";

export const postJobSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "Job title must be at least 3 characters")
    .required("Job title is required"),

  description: yup
    .string()
    .trim()
    .min(20, "Job description must be at least 20 characters")
    .required("Job description is required"),

  
  isRemote: yup.boolean(),

location: yup
    .string()
    .trim()
    .when("isRemote", (isRemote: any, schema: yup.StringSchema) => {
      // Yup passes undefined sometimes, so use 'any'
      return isRemote ? schema.nullable() : schema.required("Location is required for non-remote jobs");
    }),



  jobType: yup
    .string()
    .required("Job type is required"),

  experienceLevel: yup
    .string()
    .oneOf(["Fresher", "1-3", "3-5", "5+"], "Invalid experience level")
    .required("Experience level is required"),

  salaryMin: yup
    .number()
    .typeError("Minimum salary must be a number")
    .min(0, "Salary cannot be negative")
    .nullable(),

  salaryMax: yup
    .number()
    .typeError("Maximum salary must be a number")
    .moreThan(
      yup.ref("salaryMin"),
      "Maximum salary must be greater than minimum salary"
    )
    .nullable(),

  requiredSkills: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one skill")
    .required(),

  company: yup
    .string()
    .required("Company is required"),

  expiresAt: yup
    .date()
    .nullable()
    .min(new Date(), "Expiry date must be in the future"),
});
