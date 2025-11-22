"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
  Github,
  CheckCircle,
  Twitter,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// ---------- Signup Form ----------
const SignupForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
  });

  // ---------- Handle URL error parameters from NextAuth ----------
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      switch (error) {
        case "OAuthSignin":
          setSignupError("There was an error with the social signup. Please try again.");
          break;
        case "OAuthCallback":
          setSignupError("Social signup callback failed. Please try again.");
          break;
        case "OAuthCreateAccount":
          setSignupError("Could not create account with social provider.");
          break;
        case "EmailCreateAccount":
          setSignupError("Could not create account with this email.");
          break;
        case "OAuthAccountNotLinked":
          setSignupError("An account with this email already exists. Try signing in instead.");
          break;
        case "AccessDenied":
          setSignupError("Account creation denied. Your domain may not be allowed.");
          break;
        default:
          setSignupError("A signup error occurred. Please try again.");
      }
    }
  }, [searchParams]);

  // ---------- Check if user is already authenticated ----------
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };
    checkSession();
  }, [router]);

  // ---------- Password Strength Checker ----------
  const checkPasswordStrength = (password) => {
    const checks = [
      { test: password.length >= 8, message: "At least 8 characters" },
      { test: /[a-z]/.test(password), message: "One lowercase letter" },
      { test: /[A-Z]/.test(password), message: "One uppercase letter" },
      { test: /\d/.test(password), message: "One number" },
      { test: /[^A-Za-z0-9]/.test(password), message: "One special character" },
    ];

    const passed = checks.filter((check) => check.test).length;
    const feedback = checks.map((check) => ({
      message: check.message,
      passed: check.test,
    }));

    setPasswordStrength({
      score: passed,
      feedback,
    });
  };

  // ---------- Form Validation ----------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (passwordStrength.score < 3) {
      newErrors.password = "Password is too weak. Please follow the requirements below.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- Input Change ----------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") checkPasswordStrength(value);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (signupError) setSignupError("");
  };

  // ---------- Signup Submit ----------
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setSignupError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      });

      let data;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server error - please check your API route");
      }

      if (!response.ok) {
        throw new Error(data.message || `Registration failed with status ${response.status}`);
      }

      // Handle different registration success scenarios
      if (data.emailSent) {
        // Email verification required
        router.push(`/auth/check-email?email=${encodeURIComponent(formData.email)}`);
        return;
      }

      // If no email verification required, try to sign in automatically
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setSignupError("Account created but sign-in failed. Please try signing in manually.");
        router.push("/auth/signin?message=Account created successfully");
      } else if (result?.ok) {
        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Signup error:", error);

      if (error.message.includes("already exists")) {
        setSignupError("An account with this email already exists. Try signing in instead.");
      } else if (error.message.includes("domain")) {
        setSignupError("Your email domain is not allowed. Please contact support.");
      } else if (error.message.includes("API route")) {
        setSignupError("Server configuration error. Please contact support.");
      } else {
        setSignupError(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Social Signup ----------
  const handleSocialSignup = async (provider) => {
    setSocialLoading((prev) => ({ ...prev, [provider]: true }));
    setSignupError("");

    try {
      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
      
      const result = await signIn(provider, {
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setSignupError(`${provider} signup failed. Please try again.`);
      } else if (result?.url) {
        // Redirect to the provider's OAuth page
        window.location.href = result.url;
      }
    } catch (error) {
      setSignupError(`${provider} signup failed. Please try again.`);
      console.error(`${provider} signup error:`, error);
      setSocialLoading((prev) => ({ ...prev, [provider]: false }));
    }
    // Note: Don't set loading to false here if redirect succeeds
  };

  // ---------- Password Strength Helpers ----------
  const getPasswordStrengthColor = () => {
    if (passwordStrength.score < 2) return "bg-red-500";
    if (passwordStrength.score < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score < 2) return "Weak";
    if (passwordStrength.score < 4) return "Medium";
    return "Strong";
  };

  // ---------- Google Icon ----------
  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  // ---------- JSX ----------
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 max-w-md w-full">
      {/* Social Signup Buttons */}
      <div className="space-y-3 mb-8">
        <button
          onClick={() => handleSocialSignup("google")}
          disabled={socialLoading.google || isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-600 rounded-xl hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
        >
          {socialLoading.google ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            <GoogleIcon />
          )}
          <span className="font-medium text-gray-200">Continue with Google</span>
        </button>

        <button
          onClick={() => handleSocialSignup("github")}
          disabled={socialLoading.github || isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-600 rounded-xl hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
        >
          {socialLoading.github ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            <Github className="w-5 h-5 text-gray-200" />
          )}
          <span className="font-medium text-gray-200">Continue with GitHub</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-gray-900/50 text-gray-400 backdrop-blur-sm">Or continue with email</span>
        </div>
      </div>

      {/* Error Message */}
      {signupError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-sm text-red-400 backdrop-blur-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{signupError}</span>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSignup} className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-300">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-xl focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white placeholder-gray-500 backdrop-blur-sm ${
                errors.name
                  ? "border-red-500/50 bg-red-500/5"
                  : "border-gray-600 hover:border-gray-500"
              }`}
              placeholder="Enter your full name"
              disabled={isLoading}
              autoComplete="name"
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-xl focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white placeholder-gray-500 backdrop-blur-sm ${
                errors.email
                  ? "border-red-500/50 bg-red-500/5"
                  : "border-gray-600 hover:border-gray-500"
              }`}
              placeholder="Enter your email"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-300">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border rounded-xl focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white placeholder-gray-500 backdrop-blur-sm ${
                errors.password
                  ? "border-red-500/50 bg-red-500/5"
                  : "border-gray-600 hover:border-gray-500"
              }`}
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-300"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 bg-gray-700/50 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength.score < 2 ? "text-red-400" :
                  passwordStrength.score < 4 ? "text-yellow-400" : "text-green-400"
                }`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                {passwordStrength.feedback.map((requirement, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 ${
                      requirement.passed ? "text-green-400" : "text-gray-500"
                    }`}
                  >
                    <CheckCircle className={`w-3 h-3 ${
                      requirement.passed ? "text-green-400" : "text-gray-600"
                    }`} />
                    {requirement.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-sm text-red-400 flex items-center gap-2 mt-2">
              <AlertCircle className="w-4 h-4" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border rounded-xl focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white placeholder-gray-500 backdrop-blur-sm ${
                errors.confirmPassword
                  ? "border-red-500/50 bg-red-500/5"
                  : "border-gray-600 hover:border-gray-500"
              }`}
              placeholder="Confirm your password"
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-300"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-black py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg group mt-8"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Sign In Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/auth/signin")}
            className="font-medium text-white hover:text-gray-200 transition-colors duration-300"
            disabled={isLoading}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

// ---------- Loading Fallback ----------
const SignupLoading = () => (
  <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700 max-w-md w-full">
    <div className="animate-pulse">
      <div className="space-y-3 mb-8">
        <div className="h-12 bg-gray-700/50 rounded-xl"></div>
        <div className="h-12 bg-gray-700/50 rounded-xl"></div>
      </div>
      <div className="h-px bg-gray-600 mb-8"></div>
      <div className="space-y-6">
        <div className="h-16 bg-gray-700/50 rounded-xl"></div>
        <div className="h-16 bg-gray-700/50 rounded-xl"></div>
        <div className="h-16 bg-gray-700/50 rounded-xl"></div>
        <div className="h-16 bg-gray-700/50 rounded-xl"></div>
        <div className="h-12 bg-gray-700/50 rounded-xl"></div>
      </div>
    </div>
  </div>
);

// ---------- Main Page ----------
const SignupPage = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12">
          <div className="max-w-lg">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Twitter className="w-6 h-6 text-black" />
              </div>
              <span className="text-3xl font-bold text-white">X Scheduler</span>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Join club of
              <span className="block text-gray-400">successful entrepreneurs</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Build your authentic Twitter presence effortlessly while you focus on your business.
            </p>
          </div>
        </div>

        {/* Right side - Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Header for mobile */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <Twitter className="w-5 h-5 text-black" />
                </div>
                <span className="text-2xl font-bold text-white">X Scheduler</span>
              </div>
              <div className="inline-flex items-center justify-center px-4 py-2 bg-gray-900/50 rounded-full border border-gray-700 backdrop-blur-sm mb-4">
                <Sparkles className="w-4 h-4 mr-2 text-white" />
                <span className="text-sm text-gray-300">For Ambitious Entrepreneurs</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
              <p className="text-gray-400">Start automating your Twitter presence today</p>
            </div>

            {/* Signup Form with Suspense */}
            <Suspense fallback={<SignupLoading />}>
              <SignupForm />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-xs text-gray-500 z-10">
        <p>
          By creating an account, you agree to our{" "}
          <button className="text-gray-400 hover:text-white transition-colors duration-300">
            Terms of Service
          </button>{" "}
          and{" "}
          <button className="text-gray-400 hover:text-white transition-colors duration-300">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;