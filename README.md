# TecnoExpress - E-commerce de Celulares

Tienda en línea de celulares y dispositivos móviles con chatbot AI integrado.

## Inicio Rápido

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Características

- **Catálogo de productos** con categorías y filtros
- **Carrito de compras** con persistencia
- **Chatbot AI** con OpenAI para atención al cliente
- **Panel de administración** para gestión de productos
- **Analytics de chat** con métricas y leads
- **Notificaciones por email** al finalizar chats

## Documentación

Toda la documentación se encuentra en la carpeta `/docs`:

| Documento | Descripción |
|-----------|-------------|
| [INDEX.md](docs/INDEX.md) | Índice de documentación |
| [QUICK_START.md](docs/QUICK_START.md) | Guía de inicio rápido |
| [CHATBOT_SETUP.md](docs/CHATBOT_SETUP.md) | Configuración del chatbot |
| [DYNAMODB_SETUP_GUIDE.md](docs/DYNAMODB_SETUP_GUIDE.md) | Configuración de DynamoDB |
| [AWS_AMPLIFY_BUILD_GUIDE.md](docs/AWS_AMPLIFY_BUILD_GUIDE.md) | Despliegue en AWS Amplify |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Sistema de diseño |
| [SECURITY.md](docs/SECURITY.md) | Guía de seguridad |
| [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Solución de problemas |

## Variables de Entorno

Copiar `.env.example` a `.env.local` y configurar:

```env
# DynamoDB
DYNAMODB_REGION=us-east-2
DYNAMODB_ACCESS_KEY_ID=...
DYNAMODB_SECRET_ACCESS_KEY=...

# OpenAI (Chatbot)
OPENAI_API_KEY=...

# Email (Gmail App Password)
GMAIL_USER=...
GMAIL_APP_PASSWORD=...
ADMIN_NOTIFICATION_EMAIL=...
```

Ver [ENV_VARIABLE_UPDATE.md](docs/ENV_VARIABLE_UPDATE.md) para más detalles.

## Stack Tecnológico

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, DynamoDB
- **AI**: OpenAI GPT-3.5
- **Email**: Nodemailer + Gmail
- **Deploy**: AWS Amplify

## Licencia

Propiedad de GeoLink IT Services.
