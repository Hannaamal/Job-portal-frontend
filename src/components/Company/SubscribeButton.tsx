import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Props {
  companyId: string;
  initialSubscribed: boolean;
}

export default function SubscribeButton({ companyId, initialSubscribed }: Props) {
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
  const [loading, setLoading] = useState(false);

  // ✅ IMPORTANT FIX
  useEffect(() => {
    setIsSubscribed(initialSubscribed);
  }, [initialSubscribed]);

  const handleClick = async () => {
    if (!companyId) return;
    setLoading(true);

    try {
      if (isSubscribed) {
        const res = await api.delete(
          `/api/company-subscriptions/${companyId}/unsubscribe`
        );
        if (res.status === 200) setIsSubscribed(false);
      } else {
        const res = await api.post(
          `/api/company-subscriptions/${companyId}/subscribe`
        );
        if (res.status === 201) setIsSubscribed(true);
      }
    } catch (err: any) {
      console.error("Subscription error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-1 rounded mt-3 ${
        isSubscribed ? "bg-red-100 text-red-600" : "bg-blue-600 text-white"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? "Processing..." : isSubscribed ? "Unsubscribe" : "Subscribe"}
    </button>
  );
}
