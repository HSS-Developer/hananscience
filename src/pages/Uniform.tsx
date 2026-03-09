import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2, ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UniformImage {
  type: "girls" | "boys";
  image_url: string;
}

const Uniform = () => {
  const { user } = useAuth();
  const [uniforms, setUniforms] = useState<UniformImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<"girls" | "boys" | null>(null);
  const girlsInputRef = useRef<HTMLInputElement>(null);
  const boysInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.role === "admin" || user?.role === "principal";

  const fetchUniforms = async () => {
    const { data } = await supabase
      .from("uniform_images" as any)
      .select("type, image_url")
      .order("type");
    setUniforms((data as any as UniformImage[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUniforms();
  }, []);

  const getImageUrl = (type: "girls" | "boys") => {
    return uniforms.find((u) => u.type === type)?.image_url || null;
  };

  const handleUpload = async (type: "girls" | "boys", file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "⚠️ Please select an image file!", variant: "destructive" });
      return;
    }

    setUploading(type);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${type}-uniform.${ext}`;

      // Upload to storage (overwrite)
      const { error: uploadError } = await supabase.storage
        .from("uniforms")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage.from("uniforms").getPublicUrl(filePath);
      const imageUrl = urlData.publicUrl + "?t=" + Date.now();

      // Upsert into uniform_images table
      const existing = uniforms.find((u) => u.type === type);
      if (existing) {
        await (supabase.from("uniform_images" as any) as any).update({
          image_url: imageUrl,
          updated_by: user?.name || "Admin",
          updated_at: new Date().toISOString(),
        }).eq("type", type);
      } else {
        await (supabase.from("uniform_images" as any) as any).insert({
          type,
          image_url: imageUrl,
          updated_by: user?.name || "Admin",
        });
      }

      toast({ title: `✅ ${type === "girls" ? "Girls" : "Boys"} uniform updated!` });
      await fetchUniforms();
    } catch (err: any) {
      toast({ title: "❌ Upload failed: " + (err.message || "Unknown error"), variant: "destructive" });
    }
    setUploading(null);
  };

  const renderCard = (type: "girls" | "boys", label: string, emoji: string) => {
    const imageUrl = getImageUrl(type);
    const inputRef = type === "girls" ? girlsInputRef : boysInputRef;

    return (
      <Card className="shadow-card border-border/50 rounded-2xl overflow-hidden backdrop-blur-sm bg-card/80 flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <span className="text-2xl">{emoji}</span> {label} Uniform
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {imageUrl ? (
            <div className="relative rounded-xl overflow-hidden bg-muted aspect-[3/4]">
              <img
                src={imageUrl}
                alt={`${label} Uniform`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-xl bg-muted/50 aspect-[3/4] flex flex-col items-center justify-center gap-3">
              <ImageIcon className="w-16 h-16 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground font-body">No image uploaded yet</p>
            </div>
          )}

          {isAdmin && (
            <>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(type, file);
                  e.target.value = "";
                }}
              />
              <Button
                onClick={() => inputRef.current?.click()}
                disabled={uploading === type}
                variant="outline"
                className="w-full rounded-xl font-body"
              >
                {uploading === type ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="w-4 h-4 mr-2" /> {imageUrl ? "Change" : "Upload"} Photo</>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">👔 School Uniform</h1>
        <p className="text-muted-foreground font-body">
          {isAdmin ? "Upload and manage uniform images for students" : "View the school uniform for boys and girls"}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {renderCard("girls", "Girls", "👗")}
        {renderCard("boys", "Boys", "👔")}
      </div>
    </motion.div>
  );
};

export default Uniform;
