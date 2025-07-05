import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConsultationRequest {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Consultation request function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
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
    const { name, email, phone, service, message }: ConsultationRequest =
      await req.json();

    console.log("Sending consultation request email:", {
      name,
      email,
      service,
    });

    // Envoyer l'email à contact@juristevert.com
    const emailResponse = await resend.emails.send({
      from: "Juriste Vert <noreply@juristevert.com>",
      to: ["contact@juristevert.com"],
      subject: `Nouvelle demande de consultation - ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5016; border-bottom: 2px solid #4ade80; padding-bottom: 10px;">
            Nouvelle demande de consultation
          </h2>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d5016; margin-top: 0;">Informations du client</h3>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ""}
            <p><strong>Type de service demandé:</strong> ${service}</p>
          </div>
          
          <div style="background-color: #fefefe; padding: 20px; border-left: 4px solid #4ade80; margin: 20px 0;">
            <h3 style="color: #2d5016; margin-top: 0;">Message du client</h3>
            <p style="line-height: 1.6;">${
        (message ?? "").replace(/\n/g, "<br>")
      }</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #ecfdf5; border-radius: 8px;">
            <p style="margin: 0; color: #065f46; font-size: 14px;">
              <strong>Rappel:</strong> Répondre dans les 24h conformément à notre engagement client.
            </p>
          </div>
          
          <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>Email envoyé automatiquement depuis le site web Juriste Vert</p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    // Envoyer un email de confirmation au client
    const confirmationResponse = await resend.emails.send({
      from: "Juriste Vert <noreply@juristevert.com>",
      to: [email],
      subject: "Confirmation de réception - Votre demande de consultation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5016; border-bottom: 2px solid #4ade80; padding-bottom: 10px;">
            Merci pour votre demande !
          </h2>
          
          <p>Bonjour ${name},</p>
          
          <p>Nous avons bien reçu votre demande de consultation concernant <strong>${service}</strong>.</p>
          
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d5016; margin-top: 0;">Prochaines étapes</h3>
            <ul style="color: #065f46;">
              <li>Notre équipe va examiner votre demande</li>
              <li>Nous vous recontacterons dans les <strong>24 heures</strong></li>
              <li>Nous vous proposerons un créneau pour un premier échange</li>
            </ul>
          </div>
          
          <p>Si vous avez des questions urgentes, n'hésitez pas à nous contacter directement à <a href="mailto:contact@juristevert.com" style="color: #2d5016;">contact@juristevert.com</a>.</p>
          
          <p>Cordialement,<br>
          <strong>L'équipe Juriste Vert</strong></p>
          
          <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p>Cabinet Juriste Vert - Conseil juridique et évaluation environnementale</p>
            <p>Cotonou, République du Bénin</p>
          </div>
        </div>
      `,
    });

    console.log("Confirmation email sent successfully:", confirmationResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Demande envoyée avec succès",
        emailId: emailResponse.data?.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (error: unknown) {
    console.error("Error in send-consultation-request function:", error);

    const errorMessage = typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string"
      ? (error as { message: string }).message
      : "Erreur inconnue";

    return new Response(
      JSON.stringify({
        error: "Erreur lors de l'envoi de la demande",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
};

serve(handler);
