import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth, ALL_CLASSES, classDisplayName, type ClassLevel } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2, ImageIcon, Download, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SyllabusImage {
  id: string;
  class: string;
  image_url: string;
  uploaded_by: string;
  created_at: string;
}

const Syllabus = () => {
  const { user } = useAuth();
  const [images, setImages] = useState<SyllabusImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassLevel>("PG");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.role === "admin" || user?.role === "principal";

  const fetchImages = async () => {
    const { data } = await supabase
      .from("syllabus_images" as any)
      .select("*")
      .order("created_at", { ascending: false });
    setImages((data as any as SyllabusImage[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const classImages = images.filter((img) => img.class === selectedClass);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "⚠️ Please select an image file!", variant: "destructive" });
      return;
    }

    setUploading(selectedClass);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${selectedClass}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("syllabus")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("syllabus").getPublicUrl(filePath);
      const imageUrl = urlData.publicUrl;

      await (supabase.from("syllabus_images" as any) as any).insert({
        class: selectedClass,
        image_url: imageUrl,
        uploaded_by: user?.name || "Admin",
      });

      toast({ title: `✅ Syllabus uploaded for ${classDisplayName(selectedClass)}!` });
      await fetchImages();
    } catch (err: any) {
      toast({ title: "❌ Upload failed: " + (err.message || "Unknown error"), variant: "destructive" });
    }
    setUploading(null);
  };

  const handleDelete = async (img: SyllabusImage) => {
    try {
      await (supabase.from("syllabus_images" as any) as any).delete().eq("id", img.id);
      toast({ title: "🗑️ Syllabus image deleted" });
      await fetchImages();
    } catch {
      toast({ title: "❌ Delete failed", variant: "destructive" });
    }
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
        <h1 className="text-2xl font-display font-bold text-foreground">📚 Syllabus</h1>
        <p className="text-muted-foreground font-body">
          {isAdmin ? "Upload and manage syllabus images for each class" : "View and download class syllabus"}
        </p>
      </div>

      {/* Class selector */}
      <Card className="shadow-card border-border/50 rounded-2xl glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg">🏫 Select Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ALL_CLASSES.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`px-4 py-2 rounded-xl font-body font-bold text-sm transition-all ${
                  selectedClass === c
                    ? "gradient-fun text-primary-foreground shadow-card"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {classDisplayName(c)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload section for admin */}
      {isAdmin && (
        <Card className="shadow-card border-border/50 rounded-2xl glass-card">
          <CardContent className="p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={!!uploading}
              className="w-full rounded-xl font-body gradient-warm text-primary-foreground hover:opacity-90"
            >
              {uploading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
              ) : (
                <><Upload className="w-4 h-4 mr-2" /> Upload Syllabus PNG for {classDisplayName(selectedClass)}</>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Display images */}
      {classImages.length === 0 ? (
        <Card className="shadow-card border-border/50 rounded-2xl glass-card">
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <p className="font-display font-bold text-lg text-foreground">No Syllabus Uploaded</p>
            <p className="text-muted-foreground font-body mt-1">
              {isAdmin ? `Upload syllabus for ${classDisplayName(selectedClass)}` : "Check back later"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {classImages.map((img) => (
            <motion.div key={img.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="shadow-card border-border/50 rounded-2xl overflow-hidden glass-card">
                <div className="relative">
                  <img src={img.image_url} alt={`Syllabus ${img.class}`} className="w-full object-contain max-h-[500px] bg-muted/30" />
                </div>
                <CardContent className="p-4 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground font-body">
                    Uploaded by {img.uploaded_by}
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={img.image_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-body font-bold hover:bg-primary/20 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                        onClick={() => handleDelete(img)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Syllabus;
