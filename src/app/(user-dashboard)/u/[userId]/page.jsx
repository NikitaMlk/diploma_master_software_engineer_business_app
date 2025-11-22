//\src\app\(user-dashboard)\u\[userId]\page.jsx

/*import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserByEmail } from '@/lib/authService';
import XSchedulerDashboard from '@/components/dashboard/XSchedulerDashboard';

export default async function UserDashboard({ params }) {
  const { userId } = params; // no await
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  // Determine actual user ID
  let actualUserId = session.user.id;

  if (!actualUserId && session.user.email) {
    try {
      const dbUser = await getUserByEmail(session.user.email);
      if (dbUser) {
        actualUserId = dbUser._id?.toString() || dbUser.id?.toString();
      }
    } catch (error) {
      console.error('Error fetching user from DB:', error);
      redirect('/auth/signin');
    }
  }

  if (!actualUserId) {
    redirect('/auth/signin');
  }

  // Redirect to correct dashboard if necessary
  if (actualUserId !== userId) {
    redirect(`/u/${actualUserId}`);
  }

  // Render with actualUserId
  return <XSchedulerDashboard userId={actualUserId} />;
}
*/

// src/app/(user-dashboard)/u/[userId]/page.jsx

import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserByEmail } from '@/lib/authService';
import Dashboard from '@/components/dashboard/Dashboard';

export default async function UserDashboard({ params }) {
  const { userId } = params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  // Determine actual user ID
  let actualUserId = session.user.id;

  if (!actualUserId && session.user.email) {
    try {
      const dbUser = await getUserByEmail(session.user.email);
      if (dbUser) {
        actualUserId = dbUser._id?.toString() || dbUser.id?.toString();
      }
    } catch (error) {
      console.error('Error fetching user from DB:', error);
      redirect('/auth/signin');
    }
  }

  if (!actualUserId) {
    redirect('/auth/signin');
  }

  // Redirect to correct dashboard if necessary
  if (actualUserId !== userId) {
    redirect(`/u/${actualUserId}`);
  }

  // Render Dashboard component directly
  return <Dashboard userId={actualUserId} />;
}