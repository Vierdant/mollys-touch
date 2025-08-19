import { json } from "@sveltejs/kit";
import { supabase } from "../../../lib/supabase";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
  try {
    const characterIds = url.searchParams.get("characterIds");

    if (!characterIds) {
      return json({ error: "Character IDs are required" }, { status: 400 });
    }

    const ids = characterIds.split(",").map((id) => parseInt(id.trim()));

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .in("id", ids);

    if (error) {
      console.error("Error fetching profiles:", error);
      return json({ error: "Failed to fetch profiles" }, { status: 500 });
    }

    return json({ profiles: data || [] });
  } catch (error) {
    console.error("Error in GET /api/profiles:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const profile = await request.json();

    const { error } = await supabase.from("profiles").insert({
      id: profile.id,
      username: profile.username,
      phone_number: profile.phone_number || "",
      routing_number: profile.routing_number || "",
      address: profile.address || "",
      discord: profile.discord || "",
    });

    if (error) {
      console.error("Error creating profile:", error);
      return json({ error: "Failed to create profile" }, { status: 500 });
    }

    return json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/profiles:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request }) => {
  try {
    const profile = await request.json();

    const { error } = await supabase
      .from("profiles")
      .update({
        username: profile.username,
        phone_number: profile.phone_number || "",
        routing_number: profile.routing_number || "",
        address: profile.address || "",
        discord: profile.discord || "",
      })
      .eq("id", profile.id);

    if (error) {
      console.error("Error updating profile:", error);
      return json({ error: "Failed to update profile" }, { status: 500 });
    }

    return json({ success: true });
  } catch (error) {
    console.error("Error in PUT /api/profiles:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
