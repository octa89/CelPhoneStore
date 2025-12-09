# Chatbot de Atención al Cliente - Guía de Configuración

## Descripción General

El chatbot de TecnoExpress es un asistente virtual impulsado por OpenAI GPT-4 que proporciona:

- 💬 **Respuestas automáticas** a preguntas sobre productos, precios y entregas
- 🛒 **Asistencia para pedidos** mediante la recopilación de información de contacto del cliente
- 📊 **Análisis de conversaciones** y seguimiento de modelos populares solicitados
- 📈 **Estadísticas en tiempo real** de consultas y leads capturados

## Características Principales

### 1. Atención al Cliente Automatizada
- Responde preguntas sobre especificaciones técnicas
- Proporciona información de precios en tiempo real
- Informa sobre tiempos de entrega
- Ayuda a comparar productos

### 2. Gestión de Pedidos
- Recopila información del cliente (nombre, email, teléfono)
- Registra los productos de interés
- Crea leads para seguimiento

### 3. Análisis e Inteligencia de Mercado
- Rastrea productos más consultados
- Identifica modelos solicitados que no están en stock
- Genera informes de conversaciones
- Clasifica consultas por tipo (precio, disponibilidad, especificaciones, etc.)

## Requisitos Previos

1. **Cuenta de OpenAI** con acceso a la API
2. **AWS DynamoDB** configurado (ya incluido en el proyecto)
3. **Node.js** 18+ instalado

## Instalación

### Paso 1: Instalar Dependencias

```bash
npm install
```

Las dependencias del chatbot ya están incluidas:
- `openai` - SDK oficial de OpenAI
- `dotenv` - Gestión de variables de entorno

### Paso 2: Crear Tablas de DynamoDB

Ejecuta el script para crear las tablas necesarias:

```bash
npx tsx scripts/create-chat-tables.ts
```

Esto creará las siguientes tablas:
- `tecnoexpress-chat-conversations` - Almacena todas las conversaciones
- `tecnoexpress-product-inquiries` - Registra consultas de productos
- `tecnoexpress-popular-models` - Rastrea modelos solicitados

### Paso 3: Configurar Variables de Entorno

Agrega las siguientes variables a tu archivo `.env.local`:

```env
# OpenAI Configuration for Chatbot
OPENAI_API_KEY=sk-your-openai-api-key-here

# DynamoDB Chat Tables (ya creadas por el script)
DYNAMODB_CHAT_CONVERSATIONS_TABLE=tecnoexpress-chat-conversations
DYNAMODB_PRODUCT_INQUIRIES_TABLE=tecnoexpress-product-inquiries
DYNAMODB_POPULAR_MODELS_TABLE=tecnoexpress-popular-models
```

### Paso 4: Obtener tu API Key de OpenAI

1. Ve a [platform.openai.com](https://platform.openai.com/)
2. Inicia sesión o crea una cuenta
3. Navega a **API Keys** en el menú
4. Crea una nueva clave secreta
5. Copia la clave y agrégala a `.env.local`

**Importante:** Mantén tu API key segura y nunca la compartas públicamente.

## Uso

### Para Clientes

El widget de chat aparece automáticamente en todas las páginas de la tienda:

1. **Icono flotante** en la esquina inferior derecha
2. **Clic para abrir** el chat
3. **Escribe tu pregunta** y presiona Enter
4. **El asistente responderá** automáticamente

Ejemplos de preguntas que los clientes pueden hacer:
- "¿Cuál es el precio del Samsung Galaxy S24?"
- "¿Tienen el iPhone 15 Pro Max disponible?"
- "Quiero hacer un pedido del Xiaomi Redmi Note 13"
- "¿Cuánto tiempo tarda la entrega?"
- "Compara el Samsung S24 con el Google Pixel 8"

### Para Administradores

Accede al panel de análisis en el admin:

1. Inicia sesión en `/admin`
2. Navega a **"Chat & Analytics"** en el menú lateral
3. Visualiza:
   - Total de conversaciones
   - Leads capturados (clientes con información de contacto)
   - Productos más consultados
   - Modelos solicitados no disponibles en stock
   - Conversaciones recientes con detalles de contacto

## Estructura del Proyecto

### Componentes Frontend

```
src/
├── components/
│   └── ChatWidget.tsx          # Widget de chat flotante
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts        # API endpoint principal del chat
│   │   └── admin/
│   │       └── chat-analytics/
│   │           └── route.ts    # API de estadísticas para admin
│   └── admin/
│       └── chat-analytics/
│           └── page.tsx         # Dashboard de análisis
└── lib/
    ├── types.ts                 # Definiciones de tipos TypeScript
    ├── dynamodb.ts              # Cliente de DynamoDB
    └── dynamodb-service.ts      # Funciones CRUD para chat
```

### Tablas de DynamoDB

#### tecnoexpress-chat-conversations
```typescript
{
  id: string,                    // Identificador único
  sessionId: string,             // ID de sesión del navegador
  messages: ChatMessage[],       // Historial de mensajes
  customerInfo?: {
    name?: string,
    email?: string,
    phone?: string
  },
  createdAt: string,
  updatedAt: string,
  status: 'active' | 'completed' | 'abandoned'
}
```

#### tecnoexpress-product-inquiries
```typescript
{
  id: string,
  conversationId: string,
  productId?: string,
  productName: string,
  brand?: string,
  category?: string,
  inquiryType: 'price' | 'availability' | 'specs' | 'delivery' | 'comparison' | 'other',
  timestamp: string,
  customerEmail?: string,
  resolved: boolean
}
```

#### tecnoexpress-popular-models
```typescript
{
  id: string,
  modelName: string,
  brand?: string,
  requestCount: number,
  firstRequestedAt: string,
  lastRequestedAt: string,
  requestedByEmails: string[]
}
```

## Funciones de OpenAI

El chatbot utiliza **Function Calling** de OpenAI con las siguientes funciones:

### 1. search_products
Busca productos por nombre, marca, categoría o precio máximo.

### 2. get_product_details
Obtiene información detallada de un producto específico.

### 3. save_customer_info
Guarda información de contacto del cliente cuando desea hacer un pedido.

### 4. track_model_request
Registra cuando un cliente pregunta por un modelo que no está en stock.

## Personalización

### Modificar el Prompt del Sistema

Edita el archivo `src/app/api/chat/route.ts` y modifica la constante `SYSTEM_PROMPT`:

```typescript
const SYSTEM_PROMPT = `Tu mensaje personalizado aquí...`;
```

### Ajustar el Modelo de OpenAI

Puedes cambiar el modelo en `src/app/api/chat/route.ts`:

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4-turbo-preview",  // Cambia aquí: gpt-4, gpt-3.5-turbo, etc.
  messages,
  // ...
});
```

**Modelos disponibles:**
- `gpt-4-turbo-preview` - Más inteligente, más caro
- `gpt-4` - Balanceado
- `gpt-3.5-turbo` - Más rápido, más económico

### Personalizar la UI del Chat

Edita `src/components/ChatWidget.tsx` para:
- Cambiar colores y estilos
- Modificar el mensaje de bienvenida
- Ajustar el tamaño del widget
- Agregar funcionalidades adicionales

## Costos y Uso

### Estimación de Costos de OpenAI

Con `gpt-4-turbo-preview`:
- **Input:** $10 por 1M tokens (~$0.01 por conversación típica)
- **Output:** $30 por 1M tokens (~$0.03 por conversación típica)

**Ejemplo:** 1,000 conversaciones/mes = ~$40 USD

Consejos para reducir costos:
1. Usa `gpt-3.5-turbo` para consultas simples
2. Limita el historial de mensajes en contexto
3. Implementa caché de respuestas frecuentes
4. Establece límites de tokens (`max_tokens`)

### Monitoreo de Uso

Verifica tu uso en [platform.openai.com/usage](https://platform.openai.com/usage)

## Seguridad

### Variables de Entorno
- ✅ Nunca commitees `.env.local` a Git
- ✅ Usa variables de entorno en producción (Vercel, AWS, etc.)
- ✅ Rota tu API key periódicamente

### Protección contra Abuso
El endpoint `/api/chat` debería considerar:
- Rate limiting por IP o sesión
- Validación de entrada
- Límite de longitud de mensaje
- Protección CSRF (ya incluida en Next.js)

## Troubleshooting

### Error: "Invalid OpenAI API Key"
**Solución:** Verifica que `OPENAI_API_KEY` esté correctamente configurada en `.env.local`

### Error: "Missing credentials" durante el build de Amplify
**Causa:** El cliente OpenAI se estaba inicializando a nivel de módulo, lo cual falla durante el build cuando la variable de entorno no está disponible.

**Solución:** Ya implementada en v2.1.0 - El cliente OpenAI ahora usa inicialización diferida (lazy initialization):
```typescript
// ✅ CORRECTO - Inicialización diferida
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}
```

### Error: "Table does not exist"
**Solución:** Ejecuta el script de creación de tablas:
```bash
npx tsx scripts/create-chat-tables.ts
```

### El chatbot no aparece en la página
**Solución:** Verifica que `ChatWidget` esté importado en `src/app/layout.tsx`

### Respuestas muy lentas
**Soluciones:**
1. Cambia a `gpt-3.5-turbo` para respuestas más rápidas
2. Reduce `max_tokens` en la configuración
3. Limita el historial de conversación

### Error: "Rate limit exceeded"
**Solución:** Has excedido el límite de solicitudes de OpenAI. Espera unos minutos o actualiza tu plan.

### Los emails no incluyen el modelo que el cliente preguntó
**Solución:** Ya implementada en v2.1.0 - Los emails ahora extraen modelos de los mensajes del usuario automáticamente como fallback cuando `interestedInModels` está vacío. Soporta patrones para iPhone, Samsung Galaxy, Pixel, Xiaomi, OnePlus, y Motorola.

## Próximas Mejoras

Funcionalidades futuras sugeridas:

- [ ] Integración con Stripe para procesar pagos directamente en el chat
- [x] Notificaciones por email cuando se captura un lead ✅ (Implementado v2.0.0)
- [x] Extracción automática de modelos de los mensajes ✅ (Implementado v2.1.0)
- [x] Ubicación del cliente en notificaciones ✅ (Implementado v2.1.0)
- [ ] Respuestas predefinidas para preguntas frecuentes (FAQs)
- [ ] Soporte multiidioma (inglés, portugués)
- [ ] Integración con WhatsApp Business API
- [ ] Análisis de sentimiento de conversaciones
- [ ] Chatbot voice (text-to-speech y speech-to-text)
- [ ] Exportación de datos a CSV/Excel

## Soporte

Para preguntas o problemas:
- 📧 Email: contacto@geolink.dev
- 🌐 Web: https://www.geolink.dev/
- 📱 WhatsApp: [Tu número]

---

**Desarrollado con ❤️ por GeoLink IT Services**
