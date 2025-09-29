import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Upload, Loader2, Sparkles } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

export const VirtualTryOn = () => {
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [clothingImage, setClothingImage] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTryOn = async () => {
    if (!avatarImage || !clothingImage) {
      toast({
        title: "Missing Images",
        description: "Please upload both person and clothing images.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("avatar_image", avatarImage);
    formData.append("clothing_image", clothingImage);

    try {
      const response = await fetch("http://127.0.0.1:8000/tryon/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResultImage(imageUrl);

      toast({
        title: "Success! ✨",
        description: "Your virtual try-on is ready!",
      });
    } catch (error) {
      console.error("Try-on failed:", error);
      toast({
        title: "Try-On Failed",
        description: "Something went wrong. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            👕 Virtual Try-On
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload your photo and a clothing item to see how it looks on you using AI magic
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-gradient-card shadow-card border-0 backdrop-blur-sm">
          <div className="p-8">
            {/* Upload Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <ImageUpload
                label="Your Photo"
                file={avatarImage}
                onFileChange={setAvatarImage}
                accept="image/*"
                placeholder="Upload your photo"
                icon={<Upload className="w-8 h-8 text-muted-foreground" />}
              />
              
              <ImageUpload
                label="Clothing Item"
                file={clothingImage}
                onFileChange={setClothingImage}
                accept="image/*"
                placeholder="Upload clothing image"
                icon={<Sparkles className="w-8 h-8 text-muted-foreground" />}
              />
            </div>

            {/* Try On Button */}
            <div className="flex justify-center mb-8">
              <Button
                onClick={() => {
                  console.log('Button clicked!', { avatarImage, clothingImage, isLoading });
                  handleTryOn();
                }}
                disabled={!avatarImage || !clothingImage || isLoading}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Try On
                  </>
                )}
              </Button>
            </div>

            {/* Result Section */}
            {resultImage && (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-center">✨ Your Try-On Result</h3>
                <div className="flex justify-center">
                  <div className="relative group">
                    <img
                      src={resultImage}
                      alt="Try-on result"
                      className="max-w-full max-h-96 object-contain rounded-xl shadow-soft transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-center animate-pulse">Creating your look...</h3>
                <div className="flex justify-center">
                  <div className="w-80 h-96 bg-gradient-to-br from-muted to-secondary/50 rounded-xl animate-pulse shadow-soft" />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <Card className="bg-gradient-card shadow-soft border-0 p-6">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-muted-foreground">Advanced machine learning for realistic try-ons</p>
          </Card>
          
          <Card className="bg-gradient-card shadow-soft border-0 p-6">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold mb-2">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">Get results in seconds, not minutes</p>
          </Card>
          
          <Card className="bg-gradient-card shadow-soft border-0 p-6">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold mb-2">Precise Fit</h3>
            <p className="text-sm text-muted-foreground">Realistic clothing adaptation to your body</p>
          </Card>
        </div>
      </div>
    </div>
  );
};