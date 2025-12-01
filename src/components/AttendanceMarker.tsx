import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Camera, X, Upload, MapPin, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AttendanceMarkerProps {
  onClose: () => void;
  userName: string;
  userId: string;
}

const AttendanceMarker = ({ onClose, userName, userId }: AttendanceMarkerProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [location, setLocation] = useState<string>("Fetching location...");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          
          // Reverse geocode to get location name
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation(data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          } catch (error) {
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        },
        (error) => {
          console.error("Location error:", error);
          setLocation("Location unavailable");
        }
      );
    } else {
      setLocation("Location not supported");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      toast({
        title: "Photo required",
        description: "Please upload a photo to mark attendance",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload photo to Supabase Storage
      const fileName = `${userId}_${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('attendance-photos')
        .upload(fileName, imageFile, {
          contentType: imageFile.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('attendance-photos')
        .getPublicUrl(fileName);

      // Save attendance record to database
      const { error: insertError } = await supabase
        .from('attendance')
        .insert({
          user_id: userId,
          photo_url: publicUrl,
          location: location,
          timestamp_utc: new Date().toISOString(),
          method: 'web',
        });

      if (insertError) throw insertError;

      setIsSuccess(true);
      toast({
        title: "Attendance marked!",
        description: "Your check-in has been recorded successfully",
      });

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to mark attendance. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-lg"
      >
        <Card className="p-6 bg-glass/90 backdrop-blur-xl border-glass-border shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Mark Attendance
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {!isSuccess ? (
            <>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-gold" />
                  <span>{new Date().toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                  <span className={location === "Fetching location..." ? "text-muted-foreground" : "text-foreground"}>
                    {location === "Fetching location..." && (
                      <Loader2 className="w-3 h-3 animate-spin inline mr-2" />
                    )}
                    {location}
                  </span>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="mb-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {image ? (
                  <div className="relative">
                    <img
                      src={image}
                      alt="Attendance"
                      className="w-full h-64 object-cover rounded-lg border-2 border-glass-border"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-glass-border rounded-lg flex flex-col items-center justify-center gap-3 hover:border-gold/50 transition-colors bg-glass/30"
                  >
                    <Camera className="w-12 h-12 text-gold" />
                    <p className="text-sm text-muted-foreground">
                      Click to capture or upload photo
                    </p>
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="hero"
                  onClick={handleSubmit}
                  className="flex-1"
                  disabled={isSubmitting || !image}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                    </motion.div>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  {isSubmitting ? "Submitting..." : "Mark Attendance"}
                </Button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center shadow-[var(--shadow-gold)]"
              >
                <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Success!</h3>
              <p className="text-muted-foreground">Your attendance has been recorded</p>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default AttendanceMarker;
