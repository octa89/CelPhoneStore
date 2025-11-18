"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Facebook, Instagram } from "lucide-react";

export default function ContactFooter() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });

      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <footer className="mt-0 border-t border-honor-border bg-honor-bg-light">
      <div className="container-honor py-16 md:py-24">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-honor-text-primary mb-6">TECNO EXPRESS</h3>
            <p className="text-honor-text-secondary mb-6 leading-relaxed">
              Tu tienda de confianza para los mejores smartphones y accesorios tecnológicos en Nicaragua.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61583486547842"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-honor-border flex items-center justify-center hover:border-honor-primary hover:text-honor-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/tecnoexpress.nic/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-honor-border flex items-center justify-center hover:border-honor-primary hover:text-honor-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-honor-text-primary mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-honor-text-secondary hover:text-honor-primary transition-colors">Inicio</Link></li>
              <li><a href="#productos" className="text-honor-text-secondary hover:text-honor-primary transition-colors">Productos</a></li>
              <li><Link href="/search" className="text-honor-text-secondary hover:text-honor-primary transition-colors">Buscar</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-honor-text-primary mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-honor-primary mt-0.5" />
                <a href="mailto:info@geolink.dev" className="text-honor-text-secondary hover:text-honor-primary transition-colors">
                  info@geolink.dev
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-honor-primary mt-0.5" />
                <span className="text-honor-text-secondary">Nicaragua</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-lg font-semibold text-honor-text-primary mb-6">Horario</h3>
            <ul className="space-y-3 text-honor-text-secondary">
              <li>Lunes - Viernes</li>
              <li className="font-medium">9:00 AM - 6:00 PM</li>
              <li className="mt-4">Sábados</li>
              <li className="font-medium">9:00 AM - 2:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-white rounded-honor-xl p-8 md:p-12 mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold text-honor-text-primary mb-4 text-center">¿Tienes Preguntas?</h2>
            <p className="text-lg text-honor-text-secondary mb-8 text-center">Envíanos un mensaje y te responderemos pronto</p>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 rounded-honor-lg bg-honor-bg-light border border-honor-border text-honor-text-primary placeholder-honor-text-muted focus:outline-none focus:border-honor-primary transition-colors"
                placeholder="Tu Nombre"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 rounded-honor-lg bg-honor-bg-light border border-honor-border text-honor-text-primary placeholder-honor-text-muted focus:outline-none focus:border-honor-primary transition-colors"
                placeholder="Tu Email"
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-honor-lg bg-honor-bg-light border border-honor-border text-honor-text-primary placeholder-honor-text-muted focus:outline-none focus:border-honor-primary transition-colors md:col-span-2"
                placeholder="Teléfono (opcional)"
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-5 py-4 rounded-honor-lg bg-honor-bg-light border border-honor-border text-honor-text-primary placeholder-honor-text-muted focus:outline-none focus:border-honor-primary transition-colors resize-none md:col-span-2"
                placeholder="¿Cómo podemos ayudarte?"
              />

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full md:w-auto px-12"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                </button>
              </div>

              {submitStatus === "success" && (
                <div className="md:col-span-2 p-5 bg-green-50 border border-green-200 rounded-honor-lg text-green-700">
                  ¡Mensaje enviado con éxito! Te contactaremos pronto.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="md:col-span-2 p-5 bg-red-50 border border-red-200 rounded-honor-lg text-red-700">
                  Error al enviar. Intenta de nuevo.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-honor-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-honor-text-secondary">
            <p>&copy; {new Date().getFullYear()} Tecno Express. Todos los derechos reservados.</p>
            <p>Desarrollado por <span className="font-semibold text-honor-text-primary">GeoLink IT Services</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
