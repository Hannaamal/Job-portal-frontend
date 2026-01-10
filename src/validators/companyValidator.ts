import * as Yup from "yup";

// Add Company Validation
 export const addCompanySchema = Yup.object({
  name: Yup.string()
    .required("Company name is required")
    .min(2, "Name must be at least 2 characters"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  website: Yup.string()
    .required("Website is required"),

  location: Yup.string()
    .required("Location is required"),

  logo: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "Logo must be less than 2MB",
      (value: any) => !value || value.size <= 2 * 1024 * 1024
    )
    .test(
      "fileType",
      "Only JPG, PNG, WEBP allowed",
      (value: any) =>
        !value ||
        ["image/jpeg", "image/png", "image/webp"].includes(value.type)
    ),
  

});

// Update Company Validation
export const updateCompanySchema = Yup.object({
  name: Yup.string()
    .required("Company name is required")
    .min(2, "Name must be at least 2 characters"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  website: Yup.string()
    .url("Invalid website URL")
    .required("Website is required"),

  location: Yup.string()
    .required("Location is required"),
  description: Yup.string()
  .min(10, "Description must be at least 10 characters")
  .required("Description is required"),

});
