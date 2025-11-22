import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";

// GET - List API keys
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const apiKeys = await db.collection("api_keys").find({}, { projection: { key: 1, label: 1, createdAt: 1 } }).toArray();
    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 });
  }
}

// POST - Create a new API key
export async function POST(req) {
  try {
    const { label, key } = await req.json();

    if (!label || !key) {
      return NextResponse.json({ error: "Missing label or key" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("api_keys").insertOne({
      label,
      key,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "API key created", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error creating API key:", error);
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 });
  }
}

// DELETE - Delete API key by ID
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing API key ID" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("api_keys").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "API key deleted successfully" });
  } catch (error) {
    console.error("Error deleting API key:", error);
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 });
  }
}
