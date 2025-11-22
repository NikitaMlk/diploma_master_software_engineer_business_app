"use client"

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  Github,
  Twitter,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// Separate component that uses useSearchParams
const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Handle URL error parameters
  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");
    
    if (message) {
      setLoginError("");
    }
    
    if (error) {
      switch (error) {
        case "CredentialsSignin":
          setLoginError("Invalid email or password. Please try again.");
          break;
        case "OAuthSignin":
          setLoginError("There was an error with the social login. Please try again.");
          break;
        case "OAuthCallback":
          setLoginError("Social login callback failed. Please try again.");
          break;
        case "OAuthCreateAccount":
          setLoginError("Could not create account with social provider.");
          break;
        case "EmailCreateAccount":
          setLoginError("Could not create account with this email.");
          break;
        case "Callback":
          setLoginError("Authentication callback failed.");
          break;
        case "OAuthAccountNotLinked":
          setLoginError(
            "Email already exists with different provider. Try signing in with your original method."
          );
          break;
        case "EmailSignin":
          setLoginError("Email signin failed.");
          break;
        case "SessionRequired":
          setLoginError("Please sign in to access this page.");
          break;
        case "AccessDenied":
          setLoginError(
            "Access denied. Your account may be suspended or your domain is not allowed."
          );
          break;
        default:
          setLoginError("An authentication error occurred. Please try again.");
      }
    }
  }, [searchParams]);

  // Check if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session?.user?.id) {
          router.push(`/u/${session.user.id}`);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };
    checkSession();
  }, [router]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (loginError) {
      setLoginError("");
    }
  };

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setLoginError("Invalid email or password. Please check your credentials.");
        } else {
          setLoginError("Authentication failed. Please try again.");
        }
      } else if (result?.ok) {
        // Get the callback URL or default to dashboard
        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
        router.push(callbackUrl);
      }
    } catch (error) {
      setLoginError("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading((prev) => ({ ...prev, [provider]: true }));
    setLoginError("");

    try {
      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
      
      const result = await signIn(provider, {
        callbackUrl,
        redirect: false, // Handle redirect manually to show loading state
      });

      if (result?.error) {
        setLoginError(`${provider} login failed. Please try again.`);
      } else if (result?.url) {
        // Redirect to the provider's OAuth page
        window.location.href = result.url;
      }
    } catch (error) {
      setLoginError(`${provider} login failed. Please try again.`);
      console.error(`${provider} login error:`, error);
      setSocialLoading((prev) => ({ ...prev, [provider]: false }));
    }
    // Note: Don't set loading to false here if redirect succeeds
  };

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

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 max-w-md w-full">
      {/* Social Login Buttons */}
      <div className="space-y-3 mb-8">
        <button
          onClick={() => handleSocialLogin("google")}
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
          onClick={() => handleSocialLogin("github")}
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
      {loginError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-sm text-red-400 backdrop-blur-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{loginError}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleCredentialsLogin} className="space-y-6">
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
              autoComplete="current-password"
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
          {errors.password && (
            <p className="text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-black py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg group"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/auth/signup")}
            className="font-medium text-white hover:text-gray-200 transition-colors duration-300"
            disabled={isLoading}
          >
            Sign up
          </button>
        </p>
      </div>

      {/* Forgot Password Link */}
      <div className="mt-4 text-center">
        <button
          onClick={() => router.push("/auth/forgot-password")}
          className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
          disabled={isLoading}
        >
          Forgot your password?
        </button>
      </div>
    </div>
  );
};

// Loading fallback component
const LoginFormFallback = () => (
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
        <div className="h-12 bg-gray-700/50 rounded-xl"></div>
      </div>
    </div>
  </div>
);

// Main component
const LoginPage = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
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
              Welcome back to your
              <span className="block text-gray-400">content autopilot</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Your authentic Twitter presence runs automatically while you focus on building your product.
            </p>


          </div>
        </div>

        {/* Right side - Login Form */}
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
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
              <p className="text-gray-400">Continue building while we handle your Twitter</p>
            </div>

            {/* Login Form with Suspense */}
            <Suspense fallback={<LoginFormFallback />}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-xs text-gray-500 z-10">
        <p>
          By signing in, you agree to our{" "}
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

export default LoginPage;