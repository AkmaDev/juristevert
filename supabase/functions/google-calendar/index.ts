import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.50.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
interface GoogleEvent {
  id: string;
  summary?: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
}

interface CreatedGoogleEvent extends GoogleEvent {
  conferenceData?: {
    entryPoints?: Array<{
      uri?: string;
      entryPointType?: string;
      label?: string;
    }>;
    conferenceId?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  conferenceData?: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

class GoogleCalendarService {
  private clientId: string;
  private clientSecret: string;
  private supabase: SupabaseClient;

  constructor() {
    this.clientId = Deno.env.get("GOOGLE_CLIENT_ID") || "";
    this.clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET") || "";
    this.supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
    );
  }

  async getAccessToken(refreshToken: string): Promise<string> {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data: GoogleTokenResponse = await response.json();
    return data.access_token;
  }

  async getCalendarEvents(
    accessToken: string,
    timeMin: string,
    timeMax: string,
  ): Promise<GoogleEvent[]> {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      },
    );

    const data = await response.json();
    return data.items || [];
  }

  async createCalendarEvent(
    accessToken: string,
    event: CalendarEvent,
  ): Promise<CreatedGoogleEvent> {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      },
    );

    return await response.json();
  }

  async getAvailableSlots(
    accessToken: string,
    date: string,
  ): Promise<string[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const events = await this.getCalendarEvents(
      accessToken,
      startOfDay.toISOString(),
      endOfDay.toISOString(),
    );

    // Créneaux par défaut (9h-17h)
    const allSlots = [
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
    ];

    // Filtrer les créneaux occupés
    const busySlots = events.map((event) => {
      if (event.start?.dateTime) {
        const startTime = new Date(event.start.dateTime);
        return `${startTime.getHours().toString().padStart(2, "0")}:00`;
      }
      return null;
    }).filter(Boolean);

    return allSlots.filter((slot) => !busySlots.includes(slot));
  }

  async storeRefreshToken(refreshToken: string): Promise<void> {
    // Stocker le refresh token dans Supabase de manière sécurisée
    await this.supabase
      .from("calendar_tokens")
      .upsert({ id: "main", refresh_token: refreshToken });
  }

  async getStoredRefreshToken(): Promise<string | null> {
    const { data } = await this.supabase
      .from("calendar_tokens")
      .select("refresh_token")
      .eq("id", "main")
      .single();

    return data?.refresh_token || null;
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const googleService = new GoogleCalendarService();

    switch (action) {
      case "auth-url": {
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${googleService["clientId"]}&` +
          `redirect_uri=${
            encodeURIComponent(
              "https://pmuovgfxujfpbcelppke.supabase.co/functions/v1/google-calendar?action=callback",
            )
          }&` +
          `scope=${
            encodeURIComponent("https://www.googleapis.com/auth/calendar")
          }&` +
          `response_type=code&` +
          `access_type=offline&` +
          `prompt=consent`;

        return new Response(JSON.stringify({ authUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "callback": {
        const code = url.searchParams.get("code");
        if (!code) {
          return new Response("No authorization code provided", {
            status: 400,
          });
        }

        const tokenResponse = await fetch(
          "https://oauth2.googleapis.com/token",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: googleService["clientId"],
              client_secret: googleService["clientSecret"],
              code: code,
              grant_type: "authorization_code",
              redirect_uri:
                "https://pmuovgfxujfpbcelppke.supabase.co/functions/v1/google-calendar?action=callback",
            }),
          },
        );

        const tokenData: GoogleTokenResponse = await tokenResponse.json();

        if (tokenData.refresh_token) {
          await googleService.storeRefreshToken(tokenData.refresh_token);
        }

        return new Response(
          `
          <html>
            <body>
              <h1>Authentification réussie !</h1>
              <p>Votre calendrier Google est maintenant connecté. Vous pouvez fermer cette fenêtre.</p>
              <script>window.close();</script>
            </body>
          </html>
        `,
          {
            headers: { "Content-Type": "text/html" },
          },
        );
      }

      case "available-slots": {
        const { date } = await req.json();
        const refreshToken = await googleService.getStoredRefreshToken();

        if (!refreshToken) {
          return new Response(
            JSON.stringify({ error: "Calendar not connected" }),
            {
              status: 401,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        const accessToken = await googleService.getAccessToken(refreshToken);
        const availableSlots = await googleService.getAvailableSlots(
          accessToken,
          date,
        );

        return new Response(JSON.stringify({ availableSlots }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "create-appointment": {
        const { date, time, clientName, clientEmail, subject } = await req
          .json();
        const refreshToken = await googleService.getStoredRefreshToken();

        if (!refreshToken) {
          return new Response(
            JSON.stringify({ error: "Calendar not connected" }),
            {
              status: 401,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        const accessToken = await googleService.getAccessToken(refreshToken);

        const startDateTime = new Date(`${date}T${time}:00`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 heure

        const event: CalendarEvent = {
          summary: `Consultation - ${clientName}`,
          description:
            `Consultation avec ${clientName}\nEmail: ${clientEmail}\nSujet: ${subject}`,
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: "Africa/Porto-Novo",
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: "Africa/Porto-Novo",
          },
          conferenceData: {
            createRequest: {
              requestId: `meet-${Date.now()}`,
              conferenceSolutionKey: {
                type: "hangoutsMeet",
              },
            },
          },
          attendees: [
            {
              email: clientEmail,
              displayName: clientName,
            },
          ],
        };

        const createdEvent = await googleService.createCalendarEvent(
          accessToken,
          event,
        );

        return new Response(
          JSON.stringify({
            success: true,
            event: createdEvent,
            meetLink: createdEvent.conferenceData?.entryPoints?.[0]?.uri,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      default:
        return new Response("Invalid action", {
          status: 400,
          headers: corsHeaders,
        });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in google-calendar function:", error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.error("Unknown error in google-calendar function:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
