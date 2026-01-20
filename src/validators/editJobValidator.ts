import * as yup from "yup";

export const editJobSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Job title is required")
    .min(3, "Title must be at least 3 characters"),

  description: yup
    .string()
    .trim()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters"),

    isRemote: yup.boolean(),
    
  location: yup.string().when("isRemote", {
      is: false,
      then: (schema) =>
        schema.required("Location is required for onsite jobs"),
      otherwise: (schema) => schema.notRequired(),
    }),
  


  jobType: yup
    .string()
    .required("Job type is required"),

  experienceLevel: yup
    .string()
    .required("Experience level is required"),

  salaryMin: yup
    .number()
    .typeError("Minimum salary must be a number")
    .required("Minimum salary is required")
    .min(0, "Salary cannot be negative"),

  salaryMax: yup
    .number()
    .typeError("Maximum salary must be a number")
    .required("Maximum salary is required")
    .moreThan(
      yup.ref("salaryMin"),
      "Maximum salary must be greater than minimum salary"
    ),

  requiredSkills: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one skill"),

  company: yup
    .string()
    .required("Company is required"),

  expiresAt: yup
    .date()
    .nullable()
    .min(new Date(), "Expiry date must be in the future"),
});
