import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface AppointmentRequest {
    name: string;
    email: string;
    phone?: string;
    service: string;
    message?: string;
    _date: string; // format ISO yyyy-MM-dd
    _time: string; // ex: "14:00"
    datetime: string; // ex: "25 juin 2025 à 14:00"
}

const handler = async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
        // CORS preflight
        return new Response(null, { headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return new Response(
            JSON.stringify({ error: "Method not allowed" }),
            {
                status: 405,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            },
        );
    }

    try {
        const {
            name,
            email,
            phone,
            service,
            message = "",
            _date,
            _time,
            datetime,
        }: AppointmentRequest = await req.json();

        // Construire l'email à envoyer au prestataire
        const emailToPrestataire = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d5016; border-bottom: 2px solid #4ade80; padding-bottom: 10px;">
          Nouvelle prise de rendez-vous
        </h2>

        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2d5016; margin-top: 0;">Informations du client</h3>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ""}
          <p><strong>Service demandé:</strong> ${service}</p>
          <p><strong>Date et heure du rendez-vous:</strong> ${datetime}</p>
        </div>

        <div style="background-color: #fefefe; padding: 20px; border-left: 4px solid #4ade80; margin: 20px 0;">
          <h3 style="color: #2d5016; margin-top: 0;">Message du client</h3>
          <p style="line-height: 1.6;">${message.replace(/\n/g, "<br>")}</p>
        </div>

        <div style="margin-top: 30px; padding: 15px; background-color: #ecfdf5; border-radius: 8px;">
          <p style="margin: 0; color: #065f46; font-size: 14px;">
            <strong>Rappel:</strong> Confirmer le rendez-vous auprès du client dans les 24h.
          </p>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>Email envoyé automatiquement depuis le site Juriste Vert</p>
        </div>
      </div>
    `;

        const emailToClient = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d5016; border-bottom: 2px solid #4ade80; padding-bottom: 10px;">
          Confirmation de prise de rendez-vous
        </h2>

        <p>Bonjour ${name},</p>

        <p>Merci d’avoir pris rendez-vous avec nous pour le <strong>${datetime}</strong>.</p>

        <p>Nous vous enverrons bientôt un lien Google Meet pour votre consultation en ligne.</p>

        <p>Si vous avez des questions, n’hésitez pas à nous contacter à <a href="mailto:contact@juristevert.com" style="color: #2d5016;">contact@juristevert.com</a>.</p>

        <p>Cordialement,<br><strong>L’équipe Juriste Vert</strong></p>

        <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <p>Cabinet Juriste Vert - Conseil juridique et évaluation environnementale</p>
          <p>Cotonou, République du Bénin</p>
        </div>
      </div>
    `;

        // Envoi des emails
        const [prestataireResponse, clientResponse] = await Promise.all([
            resend.emails.send({
                from: "Juriste Vert <noreply@juristevert.com>",
                to: ["contact@juristevert.com"],
                subject: `Nouveau rendez-vous: ${service} - ${datetime}`,
                html: emailToPrestataire,
            }),
            resend.emails.send({
                from: "Juriste Vert <noreply@juristevert.com>",
                to: [email],
                subject: "Votre rendez-vous est confirmé - Juriste Vert",
                html: emailToClient,
            }),
        ]);

        return new Response(
            JSON.stringify({
                success: true,
                message: "Rendez-vous pris avec succès",
                prestataireEmailId: prestataireResponse.data?.id,
                clientEmailId: clientResponse.data?.id,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            },
        );
    } catch (error) {
        console.error("Erreur dans send-appointment-request:", error);

        return new Response(
            JSON.stringify({ error: "Erreur lors de la prise de rendez-vous" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            },
        );
    }
};

serve(handler);
