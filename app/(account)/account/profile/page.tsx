//  # user info + style prefs
"use client";

import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold">
        Profile
      </h1>

      <p className="text-gray-600">
        {user?.email}
      </p>
    </div>
  );
}
