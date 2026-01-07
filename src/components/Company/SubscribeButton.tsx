import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";

interface Props {
  companyId: string;
  initialSubscribed: boolean;
  onUnsubscribe?: () => void; // ✅ callback for parent
}

export default function SubscribeButton({ companyId, initialSubscribed, onUnsubscribe }: Props) {
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Keep button state synced with props
  useEffect(() => {
    setIsSubscribed(initialSubscribed);
  }, [initialSubscribed]);

  const handleClick = async () => {
    if (!isAuthenticated) {
      router.push(`/authentication?redirect=/companies/${companyId}`);
      return;
    }

    if (loading) return;
    if (!companyId) return;

    setLoading(true);

    try {
      if (isSubscribed) {
        const res = await api.delete(`/api/company-subscriptions/${companyId}/unsubscribe`);
        if (res.status === 200) {
          setIsSubscribed(false);

          // ✅ call parent callback to remove card immediately
          if (onUnsubscribe) onUnsubscribe();
        }
      } else {
        const res = await api.post(`/api/company-subscriptions/${companyId}/subscribe`);
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
      className={`px-4 py-1 rounded mt-3 transition-colors ${
        isSubscribed
          ? "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
          : "bg-blue-600 text-white hover:bg-blue-700"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? "Processing..." : isSubscribed ? "Unsubscribe" : "Subscribe"}
    </button>
  );
}
