"use client";
import Link from "next/link";

export const DashboardCard = ({ href, icon: Icon, title, description, color }) => (
  <Link
    href={href}
    className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow flex items-center space-x-3 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-300 min-h-[100px] text-sm"
  >
    <Icon className={`w-8 h-8 text-${color}-500`} />
    <div>
      <h3 className="text-md font-semibold text-gray-800 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-xs">{description}</p>
    </div>
  </Link>
);
