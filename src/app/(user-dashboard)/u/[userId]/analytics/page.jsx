// src/app/(user-dashboard)/u/[userId]/analytics/page.jsx

import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserByEmail } from '@/lib/authService';
import { BarChart3 } from 'lucide-react';

export default async function AnalyticsPage({ params }) {
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
    redirect(`/u/${actualUserId}/analytics`);
  }

  return (
    <div className="text-center py-20">
      <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-foreground mb-2">Analytics Coming Soon</h2>
      <p className="text-muted-foreground">Detailed engagement insights will be available soon.</p>
    </div>
  );
}