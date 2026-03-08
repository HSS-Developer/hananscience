import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Verify the caller is admin/principal
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user: caller },
    } = await supabaseAdmin.auth.getUser(token);
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check caller role
    const { data: callerRole } = await supabaseAdmin.rpc("get_user_role", {
      _user_id: caller.id,
    });
    if (callerRole !== "admin" && callerRole !== "principal") {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action } = body;

    // Seed action doesn't require auth (uses internal secret)
    if (action === "seed") {
      const accounts = [
        { email: "admin@hanan.edu", password: "admin123", name: "Gmd", role: "admin" },
        { email: "principal@hanan.edu", password: "principal123", name: "Miss. Shamila", role: "principal" },
      ];

      const results = [];
      for (const acc of accounts) {
        const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
        const exists = existing?.users?.find((u: any) => u.email === acc.email);
        if (exists) {
          // Ensure role is correct
          await supabaseAdmin.from("user_roles").upsert(
            { user_id: exists.id, role: acc.role },
            { onConflict: "user_id,role" }
          );
          await supabaseAdmin.from("profiles").update({ name: acc.name }).eq("user_id", exists.id);
          results.push({ email: acc.email, status: "already exists, role updated" });
          continue;
        }

        const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
          email: acc.email,
          password: acc.password,
          email_confirm: true,
          user_metadata: { name: acc.name },
        });

        if (error) {
          results.push({ email: acc.email, status: "error", error: error.message });
          continue;
        }

        await supabaseAdmin.from("user_roles").update({ role: acc.role }).eq("user_id", newUser.user.id);
        await supabaseAdmin.from("profiles").update({ name: acc.name }).eq("user_id", newUser.user.id);
        results.push({ email: acc.email, status: "created" });
      }

      return new Response(JSON.stringify({ success: true, results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create") {
      const { email, password, name, class: studentClass, section, rollNumber, fatherName, phone, role } = body;

      // Create auth user
      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name },
        });

      if (createError) {
        return new Response(JSON.stringify({ error: createError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update profile with additional info
      await supabaseAdmin
        .from("profiles")
        .update({
          name,
          class: studentClass || "PG",
          section: section || "A",
          roll_number: rollNumber || null,
          father_name: fatherName || null,
          phone: phone || null,
        })
        .eq("user_id", newUser.user.id);

      // Update role if not student
      if (role && role !== "student") {
        await supabaseAdmin
          .from("user_roles")
          .update({ role })
          .eq("user_id", newUser.user.id);
      }

      return new Response(
        JSON.stringify({ success: true, userId: newUser.user.id }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (action === "delete") {
      const { userId } = body;
      const { error: deleteError } =
        await supabaseAdmin.auth.admin.deleteUser(userId);
      if (deleteError) {
        return new Response(JSON.stringify({ error: deleteError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "seed") {
      // Seed initial admin and principal accounts
      const accounts = [
        {
          email: "admin@hanan.edu",
          password: "admin123",
          name: "Gmd",
          role: "admin",
        },
        {
          email: "principal@hanan.edu",
          password: "principal123",
          name: "Miss. Shamila",
          role: "principal",
        },
      ];

      const results = [];
      for (const acc of accounts) {
        // Check if user already exists
        const { data: existing } =
          await supabaseAdmin.auth.admin.listUsers();
        const exists = existing?.users?.find((u) => u.email === acc.email);
        if (exists) {
          results.push({ email: acc.email, status: "already exists" });
          continue;
        }

        const { data: newUser, error } =
          await supabaseAdmin.auth.admin.createUser({
            email: acc.email,
            password: acc.password,
            email_confirm: true,
            user_metadata: { name: acc.name },
          });

        if (error) {
          results.push({ email: acc.email, status: "error", error: error.message });
          continue;
        }

        // Update role
        await supabaseAdmin
          .from("user_roles")
          .update({ role: acc.role })
          .eq("user_id", newUser.user.id);

        // Update profile
        await supabaseAdmin
          .from("profiles")
          .update({ name: acc.name })
          .eq("user_id", newUser.user.id);

        results.push({ email: acc.email, status: "created" });
      }

      return new Response(JSON.stringify({ success: true, results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
