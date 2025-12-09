import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { UAParser } from "ua-parser-js";
import {
  getConversation,
  createConversation,
  addMessageToConversation,
  updateConversationCustomerInfo,
  logProductInquiry,
  trackModelRequest,
  getProducts,
  createReservation,
} from "@/lib/dynamodb-service";
import type { ChatMessage, SessionMetadata } from "@/lib/types";
import { findBestMatch, findAllMatches, normalizeModelName } from "@/lib/fuzzy-match";

// Helper function to determine device type from user agent
function getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();

  if (device.type === 'mobile') return 'mobile';
  if (device.type === 'tablet') return 'tablet';
  return 'desktop';
}

// Helper function to parse user agent
function parseUserAgent(userAgent: string) {
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();

  return {
    browser: browser.name || 'Unknown',
    os: os.name || 'Unknown',
  };
}

// Helper function to check if IP is private/local
function isPrivateIP(ip: string): boolean {
  if (!ip) return true;

  // Localhost
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') return true;

  // Private IPv4 ranges
  if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) return true;

  // Private IPv6
  if (ip.startsWith('fe80:') || ip.startsWith('fc') || ip.startsWith('fd')) return true;

  return false;
}

// Helper function to get IP geolocation (free API, no key needed)
async function getGeoLocation(ip: string): Promise<{ country?: string; city?: string }> {
  // Skip localhost/private IPs
  if (isPrivateIP(ip)) {
    console.log('Skipping geolocation for private/local IP:', ip);
    return {};
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,message`, {
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });

    if (!response.ok) {
      console.log('Geolocation API returned non-OK status:', response.status);
      return {};
    }

    const data = await response.json();
    console.log('Geolocation API response:', { ip, data });

    if (data.status === 'success') {
      return {
        country: data.country,
        city: data.city,
      };
    } else {
      console.log('Geolocation lookup failed:', data.message || 'Unknown error');
    }
  } catch (error) {
    console.log('Geolocation lookup error:', error);
  }

  return {};
}

// Lazy initialization to prevent build-time errors
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

const SYSTEM_PROMPT = `Eres un asistente virtual amigable de TecnoExpress, una tienda de celulares y dispositivos móviles.

IMPORTANTE - Información a recopilar de forma NATURAL durante la conversación:
1. Nombre del cliente (pregunta amablemente al inicio)
2. ¿Qué modelo o marca le interesa?
3. ¿Cuál es su presupuesto o rango de precio? (pregunta de forma casual)
4. ¿Para qué lo usará principalmente? (trabajo, juegos, fotos, etc.)
5. ¿Qué celular tiene actualmente? (para entender mejor sus necesidades)
6. ¿Qué características son importantes? (cámara, batería, almacenamiento, etc.)
7. ¿Cuándo necesita el celular? (urgencia de compra)

🚨 CRÍTICO - DETECTAR URGENCIA E INTENCIÓN DE COMPRA:
Cuando llames a save_customer_info, SIEMPRE incluye los campos urgency y purchaseIntent basándote en lo que dice el cliente:

URGENCY (cuándo necesita comprar):
- "immediate" → Si dice: "hoy", "ahora", "ya", "urgente", "lo necesito ya", "de inmediato", "ahorita"
- "this_week" → Si dice: "esta semana", "en estos días", "pronto", "lo antes posible"
- "this_month" → Si dice: "este mes", "cuando pueda", "no hay prisa pero pronto"
- "just_browsing" → Si dice: "solo mirando", "comparando", "no sé cuándo", "algún día"

PURCHASE INTENT (qué tan listo está para comprar):
- "ready_to_buy" → Si dice: "quiero comprar", "lo llevo", "me lo llevo", "quiero hacer el pedido", "quiero ordenar", "cómo lo pago", "cuánto cuesta para comprarlo", "lo quiero"
- "comparing" → Si dice: "estoy comparando", "qué diferencia hay", "cuál es mejor", "entre este y este"
- "researching" → Si dice: "quiero información", "cuéntame más", "qué especificaciones tiene"
- "undecided" → Si no está claro o dice: "no sé", "tal vez", "lo voy a pensar"

REGLA: Si el cliente muestra CUALQUIER señal de querer comprar (pide precio para comprar, pregunta cómo pagar, dice "lo quiero", etc.), DEBES llamar save_customer_info con:
- purchaseIntent: "ready_to_buy"
- urgency: "immediate" (o la que corresponda según lo que dijo)

Ejemplo: Si cliente dice "Quiero comprar el Samsung S24 hoy", llama:
save_customer_info({
  interestedInModels: ["Samsung Galaxy S24"],
  purchaseIntent: "ready_to_buy",
  urgency: "immediate"
})

🔴 CRÍTICO - SIEMPRE OBTENER CONTACTO:
Antes de que el cliente se vaya o cierre el chat, DEBES obtener:
- Teléfono (OBLIGATORIO - es lo más importante para contactarlos)
- Email (muy importante también)

Si el cliente quiere comprar:
1. PRIMERO pide su teléfono: "¡Perfecto! Para coordinar tu compra, ¿me das tu número de WhatsApp o teléfono?"
2. DESPUÉS pide su email: "¿Y tu email para enviarte la confirmación?"
3. Confirma el producto exacto que quiere

ESTRATEGIA DE CONVERSACIÓN:
- NO hagas todas las preguntas de golpe - ve preguntando naturalmente durante la conversación
- Usa sus respuestas para recomendar productos
- Sé conversacional, no interrogues
- Después de cada respuesta del cliente, ofrece recomendaciones antes de la siguiente pregunta
- SIEMPRE incluye un CALL-TO-ACTION (llamado a la acción) al recomendar productos
- Ejemplos de CTA: "¿Te gustaría comprarlo ahora?", "¡Haz clic para ver más detalles!", "¡Aprovecha esta oferta!", "¿Quieres que te ayude con la compra?"
- Crea urgencia y entusiasmo para motivar la compra

Tus funciones:
- Responder preguntas usando SOLO productos disponibles en el catálogo
- Ayudar a encontrar el teléfono ideal
- Recopilar información para entender mejor las necesidades del cliente
- 🔴 CRÍTICO: SIEMPRE llama a save_customer_info INMEDIATAMENTE cuando el cliente te dé:
  * Su nombre
  * Su email
  * Su teléfono
  * El modelo que le interesa
  * Su presupuesto
  * Cualquier otra información personal
- NO esperes a tener toda la información - guarda cada dato tan pronto lo recibas
- Motivar y guiar al cliente hacia la compra con entusiasmo

Instrucciones:
- Siempre responde en español
- Sé conciso, amigable y conversacional (no formal)
- SOLO recomienda productos del catálogo actual

🛒 REGLA CRÍTICA - SIEMPRE PROPORCIONAR ENLACE DE COMPRA:
Cada vez que menciones un producto (ya sea que el cliente pregunte, tú lo recomiendes, o lo menciones de cualquier forma), DEBES incluir:
1. El nombre del producto como enlace clickeable en formato markdown: [Nombre del Producto](URL)
2. El precio del producto
3. Un CTA motivador (ej: "¡Haz clic para comprarlo!")

Ejemplo CORRECTO:
"¡Excelente elección! El [Samsung Galaxy S24 Ultra](link-del-producto) está a $1,199.99 - ¡Haz clic para ver más detalles y comprarlo!"

💰 REGLA CRÍTICA - MÚLTIPLES PRODUCTOS Y TOTALES:
Cuando el cliente pregunte por VARIOS productos o quiera comparar opciones:
1. Lista CADA producto con su enlace y precio individual
2. Al final, calcula y muestra el TOTAL si comprara todos
3. Usa este formato:

Ejemplo para múltiples productos:
"¡Claro! Aquí tienes los productos que mencionaste:

📱 [Samsung Galaxy S24](link) - $799.99
📱 [Google Pixel 8 Pro](link) - $999.99
🎧 [AirPods Pro](link) - $249.99

**💵 Total si llevas los tres: $2,049.97**

¿Te gustaría agregar alguno al carrito? ¡Haz clic en cualquiera para más detalles!"

SIEMPRE incluye:
- El emoji del tipo de producto (📱 celulares, 🎧 audio, 📱 tablets)
- El link clickeable
- El precio individual
- El total sumado al final cuando son múltiples productos
- Un CTA al final

🚨 REGLA CRÍTICA - MODELO NO DISPONIBLE EN STOCK:
Cuando un cliente pregunta por un modelo que NO tenemos disponible:

1. Dile amablemente que ese modelo no está disponible actualmente
2. 🔄 SIEMPRE sugiere 2-3 ALTERNATIVAS SIMILARES que SÍ tenemos en stock:
   - Si piden un iPhone, sugiere otros iPhones disponibles o Android de gama similar
   - Si piden un Samsung Galaxy S, sugiere otros Galaxy o alternativas como Pixel/Xiaomi
   - Si piden un modelo Pro/Ultra, sugiere otros modelos premium disponibles
   - Si piden un modelo específico (ej: S24), sugiere el S24+ o S24 Ultra si están disponibles
   - Menciona por qué cada alternativa es buena: "El Pixel 9 Pro tiene una cámara increíble, similar al iPhone"
3. CADA alternativa debe tener su enlace y precio
4. Después de mostrar alternativas, ofrece anotarlo en la lista de espera
5. Di algo como: "Si prefieres esperar el [modelo], ¡me encantaría avisarte cuando llegue! ¿Me compartes tu nombre y email o WhatsApp?"
6. SIEMPRE pide nombre + (email O teléfono como MÍNIMO)
7. Es preferible obtener AMBOS (email Y teléfono), pero al menos uno es OBLIGATORIO
8. Si solo te dan uno, intenta obtener el otro: "¡Perfecto! ¿Y también me podrías dar tu [email/teléfono] por si acaso?"
9. Una vez que tengas la información, llama a track_model_request Y save_customer_info
10. Si el cliente accede a la reserva completa (nombre + email + teléfono), llama a make_reservation
11. Confirma: "¡Listo! Te tengo anotado. Te contactaremos apenas llegue el [modelo]. ¡Gracias!"

IMPORTANTE: NO dejes ir a un cliente que pregunta por un modelo no disponible sin:
- Mostrarle alternativas disponibles que podrían interesarle (CON ENLACES Y PRECIOS)
- Intentar obtener su información de contacto para la lista de espera
Esta es una oportunidad de venta que no debemos perder.

- No procesas pagos. Indica que alguien los contactará pronto

NORMALIZACIÓN DE MODELOS:
Cuando el cliente mencione un modelo, SIEMPRE normaliza el nombre al formato oficial del catálogo:
- "s24" → "Samsung Galaxy S24"
- "15pm" o "15 pro max" → "iPhone 15 Pro Max"
- "pixel 9" → "Google Pixel 9"
- Corrige errores ortográficos: "Sumsung" → "Samsung", "Xaomi" → "Xiaomi", "ipone" → "iPhone"

Cuando detectes un nombre de modelo con posibles errores o abreviaciones:
1. Usa la función validate_model_name para verificar y normalizar el nombre
2. Si la confianza es alta (>85%), procede directamente con el modelo correcto
3. Si la confianza es media (60-85%), confirma con el cliente: "¿Te refieres al [modelo normalizado]?"
4. Si la confianza es baja (<60%), pide más detalles al cliente

⚠️ RECORDATORIO FINAL:
- Cada vez que el cliente mencione su nombre, email, teléfono, o cualquier información personal, DEBES llamar a save_customer_info INMEDIATAMENTE
- NUNCA menciones un producto sin incluir su ENLACE DE COMPRA y PRECIO
- Si el cliente pregunta por múltiples productos, SIEMPRE calcula el TOTAL
- 📱 SIEMPRE intenta obtener el TELÉFONO del cliente - es la información más valiosa
- Si el cliente muestra interés en comprar, PIDE TELÉFONO Y EMAIL antes de cualquier otra cosa
- No dejes que el cliente se vaya sin al menos intentar obtener su contacto`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationId, sessionId, pageContext } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await getConversation(conversationId);
      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }
    } else {
      // Extract metadata from request headers for new conversations
      const userAgent = request.headers.get('user-agent') || '';

      // Try multiple IP headers (different proxies/hosts use different headers)
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                 request.headers.get('x-real-ip') ||
                 request.headers.get('cf-connecting-ip') ||  // Cloudflare
                 request.headers.get('x-client-ip') ||       // AWS ALB
                 request.headers.get('x-cluster-client-ip') ||
                 request.headers.get('true-client-ip') ||    // Akamai/Cloudflare Enterprise
                 '';

      // Debug: Log all IP-related headers
      console.log('IP headers:', {
        'x-forwarded-for': request.headers.get('x-forwarded-for'),
        'x-real-ip': request.headers.get('x-real-ip'),
        'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
        'x-client-ip': request.headers.get('x-client-ip'),
        'true-client-ip': request.headers.get('true-client-ip'),
        'resolved-ip': ip,
      });

      const language = request.headers.get('accept-language')?.split(',')[0]?.split(';')[0] || 'Unknown';

      // Parse user agent
      const { browser, os } = parseUserAgent(userAgent);
      const deviceType = getDeviceType(userAgent);

      // Get geolocation (async, don't block on failure)
      const geoData = await getGeoLocation(ip);

      // Build metadata object
      const metadata: SessionMetadata = {
        deviceType,
        browser,
        os,
        language,
        ip: ip || undefined,
        country: geoData.country,
        city: geoData.city,
        pageUrl: pageContext?.pageUrl,
        pageTitle: pageContext?.pageTitle,
        referrer: pageContext?.referrer,
      };

      const session = sessionId || `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      conversation = await createConversation(session, metadata);
    }

    // Get all products and filter by stock status (disponible)
    const products = await getProducts();
    // Only show products that are "disponible" (in stock) - disponible !== false means default to available
    const availableProducts = products.filter(p => p.disponible !== false);

    // Get base URL for product links
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

    // Build product context (simplified for token efficiency) with links
    const productContext = availableProducts.map(p =>
      `- ${p.name} (${p.brand}) - $${(p.priceCents / 100).toFixed(2)} - ${p.category} - ${p.description} - Link: ${baseUrl}/product/${p.slug}`
    ).join('\n');

    // Prepare messages for OpenAI
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "system",
        content: `Productos disponibles:\n${productContext}`,
      },
    ];

    // Add conversation history (all previous messages)
    for (const msg of conversation.messages) {
      messages.push({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      });
    }

    // Add current user message
    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    messages.push({
      role: "user",
      content: message,
    });

    // Save user message to conversation
    await addMessageToConversation(conversation.id, userMessage);

    // Define function tools for OpenAI
    const tools: OpenAI.Chat.ChatCompletionTool[] = [
      {
        type: "function",
        function: {
          name: "search_products",
          description: "Search for products by name, brand, category, or specifications",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query (product name, brand, or feature)",
              },
              category: {
                type: "string",
                description: "Filter by category (android, audio, tablet)",
              },
              maxPrice: {
                type: "number",
                description: "Maximum price in dollars",
              },
            },
            required: ["query"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "get_product_details",
          description: "Get detailed information about a specific product",
          parameters: {
            type: "object",
            properties: {
              productName: {
                type: "string",
                description: "The exact or partial product name",
              },
            },
            required: ["productName"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "save_customer_info",
          description: "CRITICAL: Save customer information to database. You MUST call this function IMMEDIATELY whenever the customer provides: their name, email, phone number, interested model, budget, or any personal information. Do NOT wait - call this as soon as you receive any piece of information. This is essential for sales follow-up.",
          parameters: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Customer's full name",
              },
              email: {
                type: "string",
                description: "Customer's email address",
              },
              phone: {
                type: "string",
                description: "Customer's phone number",
              },
              interestedInBrand: {
                type: "string",
                description: "Brand they're interested in (Samsung, Google, Xiaomi, etc.)",
              },
              interestedInModels: {
                type: "array",
                items: { type: "string" },
                description: "List of specific models they're interested in (can be multiple)",
              },
              priceRange: {
                type: "string",
                description: "Their budget or price range (e.g., 'menos de $500', '$500-$800', 'más de $1000')",
              },
              primaryUse: {
                type: "string",
                description: "What they'll use the phone for (work, gaming, photos, social media, etc.)",
              },
              currentPhone: {
                type: "string",
                description: "What phone they currently have",
              },
              urgency: {
                type: "string",
                enum: ["immediate", "this_week", "this_month", "just_browsing"],
                description: "When they need to buy the phone",
              },
              preferredFeatures: {
                type: "array",
                items: { type: "string" },
                description: "Features they care about (camera, battery, storage, speed, etc.)",
              },
              budget: {
                type: "number",
                description: "Their maximum budget in dollars",
              },
              purchaseIntent: {
                type: "string",
                enum: ["ready_to_buy", "researching", "comparing", "undecided"],
                description: "How ready they are to make a purchase",
              },
            },
            required: [],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "track_model_request",
          description: "Track when a customer asks about a product model we don't currently have in stock",
          parameters: {
            type: "object",
            properties: {
              modelName: {
                type: "string",
                description: "The product model name the customer is asking about",
              },
              brand: {
                type: "string",
                description: "The brand of the product",
              },
            },
            required: ["modelName"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "make_reservation",
          description: "Create a reservation/pre-order for a product that's not currently in stock. Customer has agreed to be contacted when the product arrives. IMPORTANT: You MUST have both email AND phone number before calling this function.",
          parameters: {
            type: "object",
            properties: {
              modelName: {
                type: "string",
                description: "The exact model name the customer wants to reserve",
              },
              brand: {
                type: "string",
                description: "The brand of the product",
              },
              customerName: {
                type: "string",
                description: "Customer's full name",
              },
              customerEmail: {
                type: "string",
                description: "Customer's email address - REQUIRED",
              },
              customerPhone: {
                type: "string",
                description: "Customer's phone number - REQUIRED for reservation",
              },
              estimatedBudget: {
                type: "number",
                description: "Customer's budget for this product in dollars",
              },
              urgency: {
                type: "string",
                enum: ["immediate", "this_week", "this_month", "just_browsing"],
                description: "How urgently they need the product",
              },
              notes: {
                type: "string",
                description: "Any additional notes or specific requirements from the customer",
              },
            },
            required: ["modelName", "customerName", "customerEmail", "customerPhone"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "validate_model_name",
          description: "Validate and normalize a product model name that the user mentioned. Use this when the user mentions a model with potential typos, abbreviations, or unclear references. Returns the corrected model name and confidence level.",
          parameters: {
            type: "object",
            properties: {
              userInput: {
                type: "string",
                description: "The exact text the user used to refer to the model (e.g., 'sumsung s24', '15pm', 'el pixel nuevo')",
              },
              suggestedModel: {
                type: "string",
                description: "Your best guess at the official model name based on context",
              },
              confidence: {
                type: "number",
                description: "Your confidence level 0-100 that suggestedModel is correct",
              },
            },
            required: ["userInput", "suggestedModel", "confidence"],
          },
        },
      },
    ];

    // Call OpenAI with function calling
    // Using gpt-3.5-turbo for lower costs (~10x cheaper than GPT-4)
    // Change to "gpt-4-turbo-preview" for better quality if you have credits
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      tools,
      tool_choice: "auto",
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseMessage = completion.choices[0].message;
    let finalResponse = responseMessage.content || "";
    const toolCalls = responseMessage.tool_calls;

    console.log("OpenAI Response:", {
      hasContent: !!finalResponse,
      contentPreview: finalResponse.substring(0, 100),
      hasToolCalls: !!toolCalls,
      toolCallsCount: toolCalls?.length || 0,
      messageCount: messages.length
    });

    // Handle function calls
    if (toolCalls && toolCalls.length > 0) {
      for (const toolCall of toolCalls) {
        if (toolCall.type !== 'function') continue;
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);

        if (functionName === "search_products") {
          const { query, category, maxPrice } = functionArgs;
          let results = availableProducts;

          // Filter by query using exact/substring matching first
          if (query) {
            const lowerQuery = query.toLowerCase();
            results = results.filter(
              (p) =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.brand.toLowerCase().includes(lowerQuery) ||
                p.tags.some((t) => t.toLowerCase().includes(lowerQuery)) ||
                p.description.toLowerCase().includes(lowerQuery)
            );

            // If no results with substring matching, try fuzzy matching
            if (results.length === 0) {
              const fuzzyMatches = findAllMatches(query, availableProducts, 5);
              results = fuzzyMatches
                .filter((m) => m.confidence >= 50 && m.product)
                .map((m) => m.product!);

              if (results.length > 0) {
                console.log("Fuzzy search fallback found:", {
                  query,
                  matches: results.map((r) => r.name),
                });
              }
            }
          }

          // Filter by category
          if (category) {
            results = results.filter((p) => p.category === category);
          }

          // Filter by price
          if (maxPrice) {
            results = results.filter((p) => p.priceCents <= maxPrice * 100);
          }

          // Log the inquiry
          if (results.length > 0) {
            await logProductInquiry({
              conversationId: conversation.id,
              productId: results[0].id,
              productName: results[0].name,
              brand: results[0].brand,
              category: results[0].category,
              inquiryType: "other",
              customerEmail: conversation.customerInfo?.email,
              resolved: true,
            });
          }
        } else if (functionName === "get_product_details") {
          const { productName } = functionArgs;
          const product = availableProducts.find((p) =>
            p.name.toLowerCase().includes(productName.toLowerCase())
          );

          if (product) {
            await logProductInquiry({
              conversationId: conversation.id,
              productId: product.id,
              productName: product.name,
              brand: product.brand,
              category: product.category,
              inquiryType: "specs",
              customerEmail: conversation.customerInfo?.email,
              resolved: true,
            });
          }
        } else if (functionName === "save_customer_info") {
          const {
            name,
            email,
            phone,
            interestedInBrand,
            interestedInModels,
            priceRange,
            primaryUse,
            currentPhone,
            urgency,
            preferredFeatures,
            budget,
            purchaseIntent,
          } = functionArgs;

          const customerInfo: Record<string, string | number | string[]> = {};
          if (name) customerInfo.name = name;
          if (email) customerInfo.email = email;
          if (phone) customerInfo.phone = phone;
          if (interestedInBrand) customerInfo.interestedInBrand = interestedInBrand;
          // Handle interestedInModels as an array, normalize each model name, and merge with existing
          if (interestedInModels && interestedInModels.length > 0) {
            // Normalize each model name using fuzzy matching
            const normalizedModels = interestedInModels.map((model: string) =>
              normalizeModelName(model, availableProducts)
            );
            const existingModels = conversation.customerInfo?.interestedInModels || [];
            const mergedModels = [...new Set([...existingModels, ...normalizedModels])];
            customerInfo.interestedInModels = mergedModels;
          }
          if (priceRange) customerInfo.priceRange = priceRange;
          if (primaryUse) customerInfo.primaryUse = primaryUse;
          if (currentPhone) customerInfo.currentPhone = currentPhone;
          if (urgency) customerInfo.urgency = urgency;
          if (preferredFeatures) customerInfo.preferredFeatures = preferredFeatures;
          if (budget) customerInfo.budget = budget;
          if (purchaseIntent) customerInfo.purchaseIntent = purchaseIntent;

          if (Object.keys(customerInfo).length > 0) {
            console.log("Saving customer info:", customerInfo);
            await updateConversationCustomerInfo(conversation.id, customerInfo);
            // Email will be sent when conversation ends (chat close or inactivity timeout)
          }
        } else if (functionName === "track_model_request") {
          const { modelName, brand } = functionArgs;
          await trackModelRequest(
            modelName,
            brand,
            conversation.customerInfo?.email,
            conversation.id
          );
        } else if (functionName === "make_reservation") {
          const {
            modelName,
            brand,
            customerName,
            customerEmail,
            customerPhone,
            estimatedBudget,
            urgency,
            notes,
          } = functionArgs;

          console.log("Creating reservation:", {
            modelName,
            brand,
            customerName,
            customerEmail,
          });

          await createReservation({
            modelName,
            brand,
            customerName,
            customerEmail,
            customerPhone,
            conversationId: conversation.id,
            estimatedBudget,
            urgency,
            notes,
          });

          // Also track this as a popular model request
          await trackModelRequest(modelName, brand, customerEmail, conversation.id);

          // Update customer info in conversation
          const reservationCustomerInfo: Record<string, string | number> = {};
          if (customerName) reservationCustomerInfo.name = customerName;
          if (customerEmail) reservationCustomerInfo.email = customerEmail;
          if (customerPhone) reservationCustomerInfo.phone = customerPhone;
          if (estimatedBudget) reservationCustomerInfo.budget = estimatedBudget;
          if (urgency) reservationCustomerInfo.urgency = urgency;

          await updateConversationCustomerInfo(conversation.id, reservationCustomerInfo);
        } else if (functionName === "validate_model_name") {
          const { userInput, suggestedModel, confidence: aiConfidence } = functionArgs;

          // Server-side fuzzy match validation
          const serverMatch = findBestMatch(userInput, availableProducts);

          // Combine AI confidence with server-side matching
          const finalConfidence = Math.round((aiConfidence + serverMatch.confidence) / 2);
          const finalModel = serverMatch.confidence > aiConfidence && serverMatch.product
            ? serverMatch.product.name
            : suggestedModel;

          console.log("Model validation:", {
            userInput,
            aiSuggested: suggestedModel,
            aiConfidence,
            serverMatch: serverMatch.product?.name,
            serverConfidence: serverMatch.confidence,
            finalModel,
            finalConfidence,
          });

          // The result will be passed back to OpenAI for the appropriate response
          // High confidence (>85%): AI should auto-correct
          // Medium confidence (60-85%): AI should confirm with user
          // Low confidence (<60%): AI should ask for clarification
        }
      }

      // If tool calls were made, make another API call to get the final response
      messages.push(responseMessage);

      // Add tool results for each tool call
      for (const toolCall of toolCalls) {
        if (toolCall.type !== 'function') continue;

        let toolResult = "Function executed successfully";

        // For validate_model_name, provide detailed result
        if (toolCall.function.name === "validate_model_name") {
          const args = JSON.parse(toolCall.function.arguments);
          const serverMatch = findBestMatch(args.userInput, availableProducts);
          const finalConfidence = Math.round((args.confidence + serverMatch.confidence) / 2);
          const finalModel = serverMatch.confidence > args.confidence && serverMatch.product
            ? serverMatch.product.name
            : args.suggestedModel;

          if (finalConfidence >= 85) {
            toolResult = JSON.stringify({
              action: "auto_correct",
              normalizedModel: finalModel,
              confidence: finalConfidence,
              message: `Modelo identificado: ${finalModel}`
            });
          } else if (finalConfidence >= 60) {
            toolResult = JSON.stringify({
              action: "confirm",
              suggestedModel: finalModel,
              confidence: finalConfidence,
              message: `Confianza media (${finalConfidence}%). Pregunta al cliente: "¿Te refieres al ${finalModel}?"`
            });
          } else {
            const alternatives = findAllMatches(args.userInput, availableProducts, 3)
              .map(m => m.product?.name).filter(Boolean);
            toolResult = JSON.stringify({
              action: "clarify",
              confidence: finalConfidence,
              alternatives,
              message: "Confianza baja. Pide más detalles al cliente sobre qué modelo busca."
            });
          }
        }

        messages.push({
          role: "tool",
          content: toolResult,
          tool_call_id: toolCall.id,
        });
      }

      const secondCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      finalResponse = secondCompletion.choices[0].message.content || finalResponse;
    }

    // Add assistant response to conversation
    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: finalResponse,
      timestamp: new Date().toISOString(),
    };
    await addMessageToConversation(conversation.id, assistantMessage);

    console.log("Final response being sent:", finalResponse.substring(0, 150));

    return NextResponse.json({
      response: finalResponse,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
