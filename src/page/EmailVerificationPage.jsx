import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Shield, CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { verifyEmail, resendVerificationEmail } from "../api/auth.api.js";
import Button from "../component/Button.jsx";

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | failed | expired
  const token = searchParams.get("verify_token");

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!token) {
        setStatus("failed");
        return;
      }

      try {
        // ✅ Bearer token header diye verify call
        const res = await verifyEmail(token);
        // console.log("Token for verification:", token);
        // console.log("Response from verifyEmail API", res);
        if (res?.status === 200) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        if (error?.response?.status === 410) {
          setStatus("expired");
        } else {
          setStatus("failed");
        }
      }
    };

    verifyUserEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      <main className="flex min-h-screen items-center justify-center px-4 py-24 sm:px-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="relative w-full max-w-md">
          {status === "verifying" && <VerifyingState />}
          {status === "success" && <SuccessState />}
          {(status === "failed" || status === "expired") && (
            <FailedState isExpired={status === "expired"} token={token} />
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------------- Verifying State ---------------- */
function VerifyingState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-8 backdrop-blur-xl shadow-2xl shadow-black/20"
    >
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-500/20 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10">
            <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
          </div>
        </div>
      </div>

      <h2 className="mb-3 text-center text-2xl font-semibold text-white">
        Verifying Your Email
      </h2>

      <p className="mb-6 text-center text-gray-400">
        Please wait while we securely verify your email address...
      </p>

      <div className="flex items-center justify-center gap-2">
        <Shield className="h-4 w-4 text-cyan-400" />
        <span className="text-sm text-cyan-300">
          Secure verification in progress
        </span>
      </div>
    </motion.div>
  );
}

/* ---------------- Success State ---------------- */
function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-8 backdrop-blur-xl shadow-2xl shadow-black/20"
    >
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-500/20 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
            <CheckCircle2 className="h-10 w-10 text-green-400" />
          </div>
        </div>
      </div>

      <h2 className="mb-3 text-center text-2xl font-semibold text-white">
        Email Verified Successfully
      </h2>

      <p className="mb-8 text-center text-gray-400">
        Your email has been securely verified.
      </p>

      <div className="mb-6 space-y-3 ">
        <Link to="/login">
          <button className="w-full mb-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-medium text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40">
            Continue to Login
          </button>
        </Link>
        <Link to="/">
          <button className="w-full rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10">
            Return to Homepage
          </button>
        </Link>
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-white/5 pt-6">
        <Shield className="h-4 w-4 text-green-400" />
        <span className="text-sm text-gray-400">
          Verification completed with end-to-end encryption
        </span>
      </div>
    </motion.div>
  );
}

/* ---------------- Failed / Expired State ---------------- */
function FailedState({ isExpired, token }) {
  const [resendStatus, setResendStatus] = useState("idle");

  const handleResend = async () => {
    try {
      setResendStatus("sending");

      // ✅ Bearer token diye resend call
      await resendVerificationEmail(token);

      setResendStatus("sent");
    } catch (error) {
      setResendStatus("idle");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-8 backdrop-blur-xl shadow-2xl shadow-black/20"
    >
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
            <XCircle className="h-10 w-10 text-red-400" />
          </div>
        </div>
      </div>

      <h2 className="mb-3 text-center text-2xl font-semibold text-white">
        {isExpired ? "Verification Link Expired" : "Verification Failed"}
      </h2>

      <p className="mb-8 text-center text-gray-400">
        {isExpired
          ? "This verification link has expired. Please request a new verification email."
          : "We were unable to verify your email. The link may be invalid."}
      </p>

      <div className="mb-6 space-y-3">
        {resendStatus === "sent" && (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-6 py-3">
            <Mail className="h-5 w-5 text-green-400" />
            <span className="font-medium text-green-300">
              Verification email sent successfully
            </span>
          </div>
        )}

        <Link to="/">
          <Button variant="frosted">Return to Homepage</Button>
        </Link>
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-white/5 pt-6">
        <Shield className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-400">
          Security verification required for account access
        </span>
      </div>
    </motion.div>
  );
}
