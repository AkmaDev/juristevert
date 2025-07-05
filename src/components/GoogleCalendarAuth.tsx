import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const GoogleCalendarAuth = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "google-calendar",
        {
          body: { action: "check-connection" },
        }
      );

      if (!error && data?.connected) {
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "google-calendar",
        {
          method: "GET",
          body: new URLSearchParams({ action: "auth-url" }),
        }
      );

      if (error) throw error;

      if (data?.authUrl) {
        window.open(data.authUrl, "_blank", "width=500,height=600");

        // Vérifier la connexion après quelques secondes
        setTimeout(() => {
          checkConnectionStatus();
        }, 5000);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error connecting to Google:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à Google Calendar.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-forest-600"></div>
            <span>Vérification de la connexion...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Google Calendar
        </CardTitle>
        <CardDescription>
          Connectez votre agenda Google pour gérer les rendez-vous
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Connecté</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-amber-600">
              <AlertCircle className="w-5 h-5" />
              <span>Non connecté</span>
            </div>
            <Button
              onClick={handleConnect}
              className="w-full gradient-forest text-white"
            >
              Connecter Google Calendar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleCalendarAuth;
