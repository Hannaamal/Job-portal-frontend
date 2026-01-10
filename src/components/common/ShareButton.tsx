"use client";

import {
  WhatsappShareButton,
  TelegramShareButton,
  LinkedinShareButton,
} from "react-share";
import {
  WhatsappIcon,
  TelegramIcon,
  LinkedinIcon,
} from "react-share";

type Props = {
  jobId: string;
};

export default function JobShareButtons({ jobId }: Props) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/jobs/${jobId}`
      : "";

  return (
    <div className="flex items-center gap-3">
      <WhatsappShareButton url={url}>
        <WhatsappIcon size={40} round />
      </WhatsappShareButton>

      <TelegramShareButton url={url}>
        <TelegramIcon size={40} round />
      </TelegramShareButton>

      <LinkedinShareButton url={url}>
        <LinkedinIcon size={40} round />
      </LinkedinShareButton>
    </div>
  );
}
