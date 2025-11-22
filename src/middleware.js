import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// 🔧 CONFIGURATION - Easy to customize for any project
const SECURITY_CONFIG = {
  // Routes that don't need any authentication
  PUBLIC_ROUTES: [
    "/",                    // Home page - EXACT match only
    "/auth/signin",         // Sign in page
    "/auth/signup",         // Sign up page  
    "/blog",               // Public blog listing
    "/cookie-policy",      // Cookie policy page
    "/maintenance",        // Maintenance page
    "/unauthorized",       // Unauthorized page (for redirects)
    "/u/",

    "/api/auth",           // All authentication routes
    "/api/webhook",        // Payment webhooks
    "/api/posts/blog",     // Public blog posts
    "/api/posts/slug",     // Public post by slug
    "/api/product",        // Public product catalog
    "/api/users/",  
    "/api/payments",
    "/api/" 
  ],

  // Routes that require admin or owner role
  ADMIN_ONLY_ROUTES: [
   // "/dashboard",      // Admin dashboard
    
   // "/api/users/admins",   // Admin management
    //"/api/users/",         // User analytics
    //"/api/settings",       // System settings
    //"/api/transactions",   // Transaction data
    //"/api/performance",    // Performance metrics
    //"/api/emails",         // Email management (if not user-specific)
  ],

  // Routes where users can only access their own data
  // Format: { route: "paramPosition" } - paramPosition is where user ID appears in URL
  USER_SPECIFIC_ROUTES: {
    //"/u": 2,          // /u/[userId] - ID is at position 3
    //"/api/users": 3,       // /api/users/[userId] - ID is at position 3
    //"/api/emails": 3,      // /api/emails/[userId] - ID is at position 3 (if user-specific)
  },

  /*
  URL: /api/users/12345
  Split by "/": ["", "api", "users", "12345"]
  Positions:     0    1      2        3
                      ↑      ↑        ↑
                      Pos 1  Pos 2    Pos 3
  */

  // Routes that any authenticated user can access
  AUTHENTICATED_ROUTES: [
    "/api/api-keys",       // User's API keys
    //"/api/payments",       // Payment checkout
    "/api/posts/all",      // User's posts
    "/api/posts",          // Post management
    "/api/auth/user",      // User profile
  ],

  // Page routes that need protection
  PROTECTED_PAGES: {
    //"/dashboard": ["admin", "owner"],     // Only admin/owner can access
    //"/u": "user-specific",                // Users can only access their own pages
  },

  // Valid admin roles
  ADMIN_ROLES: ["admin", "owner"],

  // Where to redirect unauthorized users
  REDIRECT_URLS: {
    UNAUTHORIZED: "/unauthorized",
    HOME: "/",
  }
};

// 🚀 MAIN MIDDLEWARE FUNCTION - No need to modify this
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Check if route needs any protection
  if (!needsProtection(pathname)) {
    return NextResponse.next();
  }

  // Handle unauthenticated users
  if (!token) {
    return handleUnauthenticated(pathname, req);
  }

  const { role, id: userId } = token;

  // Debug logging (remove in production)
  console.log("🔒 Middleware:", { pathname, role, userId: userId?.toString().slice(0, 8) + "..." });

  // Check route permissions
  return checkPermissions(pathname, role, userId, req);
}

// 🔍 HELPER FUNCTIONS - FIXED VERSION

function needsProtection(pathname) {
  // Check if it's a public route with proper matching
  return !SECURITY_CONFIG.PUBLIC_ROUTES.some(route => {
    // Exact match for home page
    if (route === "/" && pathname === "/") {
      return true;
    }
    // For other routes, use startsWith but ensure it's not just "/"
    if (route !== "/" && pathname.startsWith(route)) {
      return true;
    }
    return false;
  });
}

function handleUnauthenticated(pathname, req) {
  const isApiRoute = pathname.startsWith('/api');
  
  if (isApiRoute) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  return NextResponse.redirect(new URL(SECURITY_CONFIG.REDIRECT_URLS.HOME, req.url));
}

function checkPermissions(pathname, role, userId, req) {
  const isApiRoute = pathname.startsWith('/api');

  // Check admin-only routes
  if (isAdminOnlyRoute(pathname)) {
    if (!SECURITY_CONFIG.ADMIN_ROLES.includes(role)) {
      return handleUnauthorized(isApiRoute, req, 'Admin access required');
    }
    return NextResponse.next();
  }

  // Check user-specific routes
  const userSpecificCheck = checkUserSpecificRoute(pathname, role, userId);
  if (userSpecificCheck !== null) {
    if (!userSpecificCheck) {
      return handleUnauthorized(isApiRoute, req, 'Access denied');
    }
    return NextResponse.next();
  }

  // Check page routes
  if (!isApiRoute) {
    const pageCheck = checkPagePermissions(pathname, role, userId);
    if (pageCheck !== null) {
      if (!pageCheck) {
        return NextResponse.redirect(new URL(SECURITY_CONFIG.REDIRECT_URLS.UNAUTHORIZED, req.url));
      }
      return NextResponse.next();
    }
  }

  // All other routes require authentication (already verified)
  return NextResponse.next();
}

function isAdminOnlyRoute(pathname) {
  return SECURITY_CONFIG.ADMIN_ONLY_ROUTES.some(route => pathname.startsWith(route));
}

function checkUserSpecificRoute(pathname, role, userId) {
  for (const [route, paramPosition] of Object.entries(SECURITY_CONFIG.USER_SPECIFIC_ROUTES)) {
    if (pathname.startsWith(route)) {
      const pathParts = pathname.split('/');
      const requestedId = pathParts[paramPosition];

      if (!requestedId) return false;

      // Admin/owner can access any user's data
      if (SECURITY_CONFIG.ADMIN_ROLES.includes(role)) {
        return true;
      }

      // Check if user is accessing their own data
      return userId?.toString() === requestedId.toString();
    }
  }
  return null; // Route not found in user-specific routes
}

function checkPagePermissions(pathname, role, userId) {
  for (const [route, permission] of Object.entries(SECURITY_CONFIG.PROTECTED_PAGES)) {
    if (pathname.startsWith(route)) {
      if (Array.isArray(permission)) {
        // Role-based permission
        return permission.includes(role);
      } else if (permission === "user-specific") {
        // User-specific page (like /u/[userId])
        const pathParts = pathname.split('/');
        const requestedId = pathParts[2];

        if (!requestedId) return false;

        // Admin/owner can access any user page
        if (SECURITY_CONFIG.ADMIN_ROLES.includes(role)) {
          return true;
        }

        // Check if user is accessing their own page
        return userId?.toString() === requestedId.toString();
      }
    }
  }
  return null; // Route not found in protected pages
}

function handleUnauthorized(isApiRoute, req, message = 'Access denied') {
  if (isApiRoute) {
    return new NextResponse(
      JSON.stringify({ error: message }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return NextResponse.redirect(new URL(SECURITY_CONFIG.REDIRECT_URLS.UNAUTHORIZED, req.url));
}

// 🎯 MATCHER CONFIGURATION
export const config = {
  matcher: [
    // Protect all pages except public ones
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    // Protect all API routes
    "/api/:path*"
  ],
};

/* 
📋 SETUP INSTRUCTIONS:

1. 📁 Save this file as `middleware.js` in your project root (same level as package.json)

2. 🔧 Customize the SECURITY_CONFIG object above:
   
   PUBLIC_ROUTES: Add routes that don't need authentication
   - Example: ["/api/auth", "/api/public", "/blog"]
   - IMPORTANT: "/" will only match the exact home page, not all routes
   
   ADMIN_ONLY_ROUTES: Add routes only admins can access
   - Example: ["/api/admin", "/api/users", "/api/analytics"]
   
   USER_SPECIFIC_ROUTES: Add routes where users can only access their own data
   - Format: { "/api/users": 3 } means user ID is at position 3 in /api/users/[id]
   - Format: { "/api/orders": 3 } means user ID is at position 3 in /api/orders/[id]
   
   AUTHENTICATED_ROUTES: Routes any logged-in user can access
   - Example: ["/api/profile", "/api/dashboard"]
   
   PROTECTED_PAGES: Page routes that need protection
   - Format: { "/admin": ["admin"], "/profile": "user-specific" }

3. 🚀 Update your roles and redirect URLs in the config

4. ✅ Test your routes:
   - Try accessing protected routes without login
   - Try accessing admin routes as regular user  
   - Try accessing other user's data

5. 🐛 Debug: Check console logs for "🔒 Middleware:" messages

🔧 THE FIX EXPLAINED:
The key change is in the needsProtection() function. Now it:
1. Does EXACT matching for "/" (only matches the home page)
2. Uses startsWith() for other routes (but excludes "/")
3. This prevents "/" from matching every single route

EXAMPLES:

For a blog platform:
- PUBLIC_ROUTES: ["/", "/api/auth", "/api/posts/public", "/api/categories"]
- ADMIN_ONLY_ROUTES: ["/api/admin", "/api/users", "/api/posts/all"]
- USER_SPECIFIC_ROUTES: { "/api/posts": 3, "/api/profile": 3 }

For an e-commerce site:
- PUBLIC_ROUTES: ["/", "/api/auth", "/api/products", "/api/categories"]
- ADMIN_ONLY_ROUTES: ["/api/admin", "/api/orders/all", "/api/analytics"]
- USER_SPECIFIC_ROUTES: { "/api/orders": 3, "/api/cart": 3 }

For a SaaS platform:
- PUBLIC_ROUTES: ["/", "/api/auth", "/api/pricing"]
- ADMIN_ONLY_ROUTES: ["/api/admin", "/api/users", "/api/billing/all"]
- USER_SPECIFIC_ROUTES: { "/api/projects": 3, "/api/billing": 3 }
*/
