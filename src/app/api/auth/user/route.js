import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findUserById } from "@/lib/userService";
import { logError } from "@/lib/logger";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    const userId = decoded.sub;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token: missing user ID" }, { status: 401 });
    }

    const user = await findUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ id: user._id, role: user.role || "user" });
  } catch (error) {
    logError("API /auth/user", error);
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 401 });
  }
}
