import { NextResponse } from "next/server";
import { isEmailConfigured, sendContactFormEmail } from "@/lib/email-service";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

/**
 * POST /api/contact
 * Handle contact form submissions and send email notification
 */
export async function POST(request: Request) {
  console.log(`[Contact] ========== FORM SUBMISSION RECEIVED ==========`);

  try {
    const body: ContactFormData = await request.json();
    const { name, email, phone, message } = body;

    console.log(`[Contact] From: ${name} <${email}>, Phone: ${phone || 'N/A'}`);

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nombre, email y mensaje son requeridos" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    // Check if email is configured
    if (!isEmailConfigured()) {
      console.error("[Contact] Email not configured");
      return NextResponse.json(
        { error: "Servicio de email no configurado" },
        { status: 503 }
      );
    }

    // Send the email
    const result = await sendContactFormEmail({
      name,
      email,
      phone,
      message,
    });

    if (result.success) {
      console.log(`[Contact] Email sent successfully for ${name}`);
      return NextResponse.json({
        success: true,
        message: "Mensaje enviado correctamente",
      });
    } else {
      console.error(`[Contact] Email failed:`, result.error);
      return NextResponse.json(
        { error: "Error al enviar el mensaje" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[Contact] Error processing contact form:", error);
    return NextResponse.json(
      { error: "Error al procesar el formulario" },
      { status: 500 }
    );
  }
}
