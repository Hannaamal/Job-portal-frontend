import type { Metadata } from "next";
import JobById from "@/components/job/JobById";

type PageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/${params.id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return {
      title: "Job not found",
    };
  }

  const job = await res.json();

  const companyName =
    typeof job.company === "object" ? job.company.name : job.company;

  const jobUrl = `https://yourdomain.com/jobs/${params.id}`;

  return {
    title: `${job.title} at ${companyName}`,
    description: `${job.location} • Apply now`,
    openGraph: {
      title: `${job.title} at ${companyName}`,
      description: job.description?.slice(0, 150),
      url: jobUrl,
      siteName: "Your Job Portal",
      images: [
        {
          url:
            job.company?.logo
              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${job.company.logo}`
              : "https://yourdomain.com/job-og.png",
          width: 1200,
          height: 630,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.title} at ${companyName}`,
      description: job.description?.slice(0, 150),
      images: [
        job.company?.logo
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${job.company.logo}`
          : "https://yourdomain.com/job-og.png",
      ],
    },
  };
}

export default function JobPage() {
  return <JobById />;
}
