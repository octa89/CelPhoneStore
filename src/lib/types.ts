export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  priceCents: number;
  images: string[];
  tags: string[];
  specs?: Record<string, string | number>;
  featured?: boolean;
  category: string; // Dynamic categories managed by admin
  description: string;
  // Admin-managed status flags
  available?: boolean; // Show/hide product on website (visible to customers)
  disponible?: boolean; // Stock status - do we have it available to sell right now?
  inCarousel?: boolean; // Show product in hero carousel
  newArrival?: boolean; // Mark as new arrival
  onSale?: boolean; // Mark as on sale
  displayOrder?: number; // Order in which products are displayed on the main page
};

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
};

export type CustomerInsights = {
  name?: string;
  email?: string;
  phone?: string;
  interestedInBrand?: string;
  interestedInModel?: string;  // DEPRECATED: Use interestedInModels instead
  interestedInModels?: string[];  // Array of model names customer is interested in
  priceRange?: string;
  primaryUse?: string;
  currentPhone?: string;
  urgency?: 'immediate' | 'this_week' | 'this_month' | 'just_browsing';
  preferredFeatures?: string[];
  budget?: number;
  purchaseIntent?: 'ready_to_buy' | 'researching' | 'comparing' | 'undecided';
};

export type SessionMetadata = {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  language: string;
  country?: string;
  city?: string;
  ip?: string;
  pageUrl?: string;
  pageTitle?: string;
  referrer?: string;
};

export type ChatConversation = {
  id: string;
  sessionId: string;
  messages: ChatMessage[];
  customerInfo?: CustomerInsights;
  metadata?: SessionMetadata;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'completed' | 'abandoned';
  // Email notification tracking
  emailSent?: boolean;
  emailSentAt?: string;
  emailError?: string;
};

export type ProductInquiry = {
  id: string;
  conversationId: string;
  productId?: string;
  productName: string;
  brand?: string;
  category?: string;
  inquiryType: 'price' | 'availability' | 'specs' | 'delivery' | 'comparison' | 'other';
  timestamp: string;
  customerEmail?: string;
  resolved: boolean;
};

export type PopularModelRequest = {
  id: string;
  modelName: string;
  brand?: string;
  requestCount: number;
  firstRequestedAt: string;
  lastRequestedAt: string;
  requestedByEmails: string[];
  conversationIds: string[];  // Track all conversations that requested this model
};

export type ProductReservation = {
  id: string;
  modelName: string;
  brand?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  conversationId: string;
  requestedAt: string;
  status: 'pending' | 'contacted' | 'fulfilled' | 'cancelled';
  notes?: string;
  estimatedBudget?: number;
  urgency?: string;
};
