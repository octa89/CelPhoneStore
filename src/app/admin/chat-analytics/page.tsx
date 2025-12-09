"use client";

import { useEffect, useState, useMemo } from "react";
import {
  MessageCircle,
  TrendingUp,
  Users,
  Mail,
  Phone,
  Clock,
  Search,
  Download,
  Filter,
  X,
  Smartphone,
  Tablet,
  Monitor,
  Globe,
  User,
  Bot,
  ArrowUpDown,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

type LeadData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  interestedInModels: string[];
  modelsWithAvailability: Array<{
    name: string;
    available: 'available' | 'out_of_stock' | 'not_found';
  }>;
  interestedInBrand: string;
  budget: number | null;
  priceRange: string;
  urgency: string;
  purchaseIntent: string;
  primaryUse: string;
  currentPhone: string;
  preferredFeatures: string[];
  inquiryCount: number;
  reservationCount: number;
  hasReservation: boolean;
  reservationStatus: string | null;
  deviceType: string;
  browser: string;
  os: string;
  language: string;
  country: string;
  city: string;
  pageUrl: string;
  pageTitle: string;
  referrer: string;
  messageCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
};

type Analytics = {
  stats: {
    totalConversations: number;
    activeConversations: number;
    conversationsWithCustomerInfo: number;
    totalInquiries: number;
    readyToBuy: number;
    urgentLeads: number;
  };
  inquiriesByType: Record<string, number>;
  topInquiredProducts: Array<{ name: string; count: number }>;
  topBrandsRequested: Array<{ brand: string; count: number }>;
  popularModels: Array<{
    id: string;
    modelName: string;
    brand?: string;
    requestCount: number;
    firstRequestedAt: string;
    lastRequestedAt: string;
    requestedByEmails: string[];
  }>;
  leadsTableData: LeadData[];
};

type SortConfig = {
  key: keyof LeadData;
  direction: "asc" | "desc";
};

export default function ChatAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Table state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "createdAt",
    direction: "desc",
  });
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSendingId, setEmailSendingId] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Date range filter state
  const [dateRange, setDateRange] = useState<'all' | 'today' | '7days' | '30days' | 'custom'>('all');
  const [customDateFrom, setCustomDateFrom] = useState<string>('');
  const [customDateTo, setCustomDateTo] = useState<string>('');

  // Model filter state
  const [selectedModel, setSelectedModel] = useState<string>('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/chat-analytics");
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError("Error loading analytics");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract unique models from all conversations for filter dropdown
  const uniqueModels = useMemo(() => {
    if (!analytics) return [];
    const models = new Set<string>();
    analytics.leadsTableData.forEach((lead) => {
      lead.interestedInModels.forEach((model) => {
        if (model) models.add(model);
      });
    });
    return Array.from(models).sort();
  }, [analytics]);

  const handleSendEmail = async (conversationId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEmailSending(true);
    setEmailSendingId(conversationId);
    setEmailStatus(null);

    try {
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversationId }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailStatus({ type: 'success', message: 'Email enviado correctamente' });
        // Clear success message after 3 seconds
        setTimeout(() => setEmailStatus(null), 3000);
      } else {
        setEmailStatus({ type: 'error', message: data.error || 'Error al enviar email' });
      }
    } catch (err) {
      console.error("Error sending email:", err);
      setEmailStatus({ type: 'error', message: 'Error de conexión' });
    } finally {
      setEmailSending(false);
      setEmailSendingId(null);
    }
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (!analytics) return [];

    let data = [...analytics.leadsTableData];

    // Apply date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      data = data.filter((lead) => {
        const leadDate = new Date(lead.createdAt);

        switch (dateRange) {
          case 'today':
            return leadDate >= today;
          case '7days':
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return leadDate >= sevenDaysAgo;
          case '30days':
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return leadDate >= thirtyDaysAgo;
          case 'custom':
            const fromDate = customDateFrom ? new Date(customDateFrom) : null;
            const toDate = customDateTo ? new Date(customDateTo + 'T23:59:59') : null;
            if (fromDate && toDate) {
              return leadDate >= fromDate && leadDate <= toDate;
            } else if (fromDate) {
              return leadDate >= fromDate;
            } else if (toDate) {
              return leadDate <= toDate;
            }
            return true;
          default:
            return true;
        }
      });
    }

    // Apply model filter
    if (selectedModel) {
      data = data.filter((lead) =>
        lead.interestedInModels.some(m => m.toLowerCase().includes(selectedModel.toLowerCase()))
      );
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.phone.toLowerCase().includes(query) ||
          lead.interestedInModels.some(m => m.toLowerCase().includes(query)) ||
          lead.interestedInBrand.toLowerCase().includes(query) ||
          lead.city.toLowerCase().includes(query) ||
          lead.country.toLowerCase().includes(query)
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        data = data.filter((lead) => {
          const leadValue = lead[key as keyof LeadData];
          if (typeof leadValue === "string") {
            return leadValue.toLowerCase().includes(value.toLowerCase());
          }
          return String(leadValue) === value;
        });
      }
    });

    // Apply sort
    data.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return data;
  }, [analytics, searchQuery, filters, sortConfig, dateRange, customDateFrom, customDateTo, selectedModel]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  // Get data for stat card modals
  const getStatCardData = (cardType: string): LeadData[] => {
    if (!analytics) return [];

    switch (cardType) {
      case 'total':
        return analytics.leadsTableData;
      case 'active':
        return analytics.leadsTableData.filter(l => l.status === 'active');
      case 'leads':
        return analytics.leadsTableData.filter(l => l.email || l.phone || l.name);
      case 'inquiries':
        return analytics.leadsTableData.filter(l => l.inquiryCount > 0);
      case 'ready':
        return analytics.leadsTableData.filter(l => l.purchaseIntent === 'ready_to_buy');
      case 'urgent':
        return analytics.leadsTableData.filter(l => l.urgency === 'immediate');
      default:
        return [];
    }
  };

  const getStatCardTitle = (cardType: string): string => {
    switch (cardType) {
      case 'total': return 'Todas las Conversaciones';
      case 'active': return 'Conversaciones Activas';
      case 'leads': return 'Leads con Contacto';
      case 'inquiries': return 'Con Consultas de Productos';
      case 'ready': return 'Listos para Comprar';
      case 'urgent': return 'Leads Urgentes';
      default: return '';
    }
  };

  const handleSort = (key: keyof LeadData) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const exportToCSV = () => {
    if (!filteredAndSortedData.length) return;

    const headers = [
      "Fecha",
      "Nombre",
      "Email",
      "Teléfono",
      "Modelos",
      "Stock",
      "Marca",
      "Presupuesto",
      "Urgencia",
      "Intención",
      "Reservación",
      "Dispositivo",
      "País",
      "Ciudad",
      "Navegador",
      "Idioma",
      "Página",
      "Mensajes",
      "Estado",
    ];

    const rows = filteredAndSortedData.map((lead) => {
      // Calculate availability summary
      const availableCount = lead.modelsWithAvailability.filter(m => m.available === 'available').length;
      const total = lead.modelsWithAvailability.length;
      const stockSummary = total === 0 ? '-' : `${availableCount}/${total} disponibles`;

      return [
        new Date(lead.createdAt).toLocaleDateString("es-ES"),
        lead.name,
        lead.email,
        lead.phone,
        lead.interestedInModels.join('; '),
        stockSummary,
        lead.interestedInBrand,
        lead.budget || "",
        lead.urgency,
        lead.purchaseIntent,
        lead.hasReservation ? `Sí (${lead.reservationStatus})` : 'No',
        lead.deviceType,
        lead.country,
        lead.city,
        lead.browser,
        lead.language,
        lead.pageUrl,
        lead.messageCount,
        lead.status,
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "tablet":
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      immediate: { bg: "bg-red-100", text: "text-red-800", label: "🔥 Urgente" },
      this_week: { bg: "bg-orange-100", text: "text-orange-800", label: "Esta semana" },
      this_month: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Este mes" },
      just_browsing: { bg: "bg-gray-100", text: "text-gray-800", label: "Mirando" },
    };
    const badge = badges[urgency] || badges.just_browsing;
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getIntentBadge = (intent: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      ready_to_buy: { bg: "bg-green-100", text: "text-green-800", label: "💰 Listo" },
      researching: { bg: "bg-blue-100", text: "text-blue-800", label: "Investigando" },
      comparing: { bg: "bg-purple-100", text: "text-purple-800", label: "Comparando" },
      undecided: { bg: "bg-gray-100", text: "text-gray-800", label: "Indeciso" },
    };
    const badge = badges[intent] || { bg: "bg-gray-100", text: "text-gray-800", label: intent || "-" };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getAvailabilityBadge = (modelsWithAvailability: Array<{ name: string; available: string }>) => {
    if (modelsWithAvailability.length === 0) {
      return <span className="text-gray-400">-</span>;
    }

    const availableCount = modelsWithAvailability.filter(m => m.available === 'available').length;
    const total = modelsWithAvailability.length;

    if (availableCount === total) {
      return (
        <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">
          {total === 1 ? '✓ Disponible' : `✓ ${total}/${total}`}
        </span>
      );
    } else if (availableCount === 0) {
      return (
        <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium">
          {total === 1 ? '✗ Sin stock' : `✗ 0/${total}`}
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
          ⚠ {availableCount}/{total}
        </span>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error || "Failed to load analytics"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-8 sm:px-4 lg:px-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            Analíticas del Chat
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Estadísticas de conversaciones y leads capturados
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div
            className="bg-white rounded-lg shadow p-4 sm:p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all border-2 border-transparent hover:border-blue-300"
            onClick={() => setSelectedStatCard('total')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {analytics.stats.totalConversations}
                </p>
              </div>
              <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow p-4 sm:p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all border-2 border-transparent hover:border-green-300"
            onClick={() => setSelectedStatCard('active')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Activas</p>
                <p className="text-xl sm:text-3xl font-bold text-green-600 mt-1">
                  {analytics.stats.activeConversations}
                </p>
              </div>
              <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow p-4 sm:p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all border-2 border-transparent hover:border-purple-300"
            onClick={() => setSelectedStatCard('leads')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Leads</p>
                <p className="text-xl sm:text-3xl font-bold text-purple-600 mt-1">
                  {analytics.stats.conversationsWithCustomerInfo}
                </p>
              </div>
              <Users className="w-8 h-8 sm:w-12 sm:h-12 text-purple-600 opacity-20" />
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow p-4 sm:p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all border-2 border-transparent hover:border-orange-300"
            onClick={() => setSelectedStatCard('inquiries')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Consultas</p>
                <p className="text-xl sm:text-3xl font-bold text-orange-600 mt-1">
                  {analytics.stats.totalInquiries}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-orange-600 opacity-20" />
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow p-4 sm:p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all border-2 border-transparent hover:border-green-400"
            onClick={() => setSelectedStatCard('ready')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Listos</p>
                <p className="text-xl sm:text-3xl font-bold text-green-700 mt-1">
                  {analytics.stats.readyToBuy}
                </p>
              </div>
              <div className="text-2xl sm:text-4xl opacity-20">💰</div>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow p-4 sm:p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all border-2 border-transparent hover:border-red-300"
            onClick={() => setSelectedStatCard('urgent')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Urgentes</p>
                <p className="text-xl sm:text-3xl font-bold text-red-600 mt-1">
                  {analytics.stats.urgentLeads}
                </p>
              </div>
              <div className="text-2xl sm:text-4xl opacity-20">🔥</div>
            </div>
          </div>
        </div>

        {/* BI Table Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Date Range Filter Bar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Período:</span>
              <div className="flex flex-wrap gap-1">
                {[
                  { value: 'all', label: 'Todos' },
                  { value: 'today', label: 'Hoy' },
                  { value: '7days', label: '7 días' },
                  { value: '30days', label: '30 días' },
                  { value: 'custom', label: 'Personalizado' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDateRange(option.value as typeof dateRange)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      dateRange === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Custom date inputs */}
              {dateRange === 'custom' && (
                <div className="flex items-center gap-2 ml-2">
                  <input
                    type="date"
                    value={customDateFrom}
                    onChange={(e) => setCustomDateFrom(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm bg-white text-gray-900"
                  />
                  <span className="text-gray-500">a</span>
                  <input
                    type="date"
                    value={customDateTo}
                    onChange={(e) => setCustomDateTo(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm bg-white text-gray-900"
                  />
                </div>
              )}

              {/* Model Filter */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm font-medium text-gray-700">Modelo:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 max-w-[200px]"
                >
                  <option value="">Todos los modelos</option>
                  {uniqueModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table Header with Search and Actions */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="flex flex-1 gap-2">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, email, modelo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-3 py-2 border rounded-lg flex items-center gap-2 text-sm ${
                    showFilters ? "bg-blue-50 border-blue-300" : "border-gray-300"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filtros</span>
                </button>
              </div>
              <div className="flex gap-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <button
                  onClick={exportToCSV}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 text-sm hover:bg-green-700"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Urgencia
                    </label>
                    <select
                      value={filters.urgency || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, urgency: e.target.value }))
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Todos</option>
                      <option value="immediate">Urgente</option>
                      <option value="this_week">Esta semana</option>
                      <option value="this_month">Este mes</option>
                      <option value="just_browsing">Mirando</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Intención
                    </label>
                    <select
                      value={filters.purchaseIntent || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, purchaseIntent: e.target.value }))
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Todos</option>
                      <option value="ready_to_buy">Listo para comprar</option>
                      <option value="researching">Investigando</option>
                      <option value="comparing">Comparando</option>
                      <option value="undecided">Indeciso</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Dispositivo
                    </label>
                    <select
                      value={filters.deviceType || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, deviceType: e.target.value }))
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Todos</option>
                      <option value="mobile">Móvil</option>
                      <option value="tablet">Tablet</option>
                      <option value="desktop">Desktop</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      value={filters.status || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, status: e.target.value }))
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Todos</option>
                      <option value="active">Activo</option>
                      <option value="completed">Completado</option>
                      <option value="abandoned">Abandonado</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setFilters({})}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto overflow-y-visible">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">
                      Fecha
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Nombre
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modelos
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("budget")}
                  >
                    <div className="flex items-center gap-1">
                      Presupuesto
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urgencia
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Intención
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispositivo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Msgs
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {lead.name || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail className="w-3 h-3" />
                            {lead.email.length > 20
                              ? lead.email.substring(0, 20) + "..."
                              : lead.email}
                          </a>
                        )}
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-xs text-green-600 hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {lead.interestedInModels.length === 0 ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <div
                          className="relative"
                          title={lead.interestedInModels.join('\n')}
                        >
                          <div className="text-sm text-gray-900">
                            {lead.interestedInModels[0]}
                            {lead.interestedInModels.length > 1 && (
                              <span
                                className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs cursor-help"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLead(lead);
                                }}
                              >
                                +{lead.interestedInModels.length - 1}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {lead.interestedInBrand}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {lead.budget ? `$${lead.budget.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getAvailabilityBadge(lead.modelsWithAvailability)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getUrgencyBadge(lead.urgency)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getIntentBadge(lead.purchaseIntent)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {getDeviceIcon(lead.deviceType)}
                        <span className="text-xs">{lead.os}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Globe className="w-3 h-3" />
                        <span className="text-xs">
                          {lead.city ? `${lead.city}, ${lead.country}` : lead.country || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {lead.messageCount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={(e) => handleSendEmail(lead.id, e)}
                        disabled={emailSending && emailSendingId === lead.id}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Enviar resumen por email"
                      >
                        {emailSending && emailSendingId === lead.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {paginatedData.map((lead) => (
              <div
                key={lead.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedLead(lead)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {lead.name || "Sin nombre"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {lead.interestedInModels.length > 0
                        ? lead.interestedInModels.slice(0, 2).join(', ') +
                          (lead.interestedInModels.length > 2 ? ` +${lead.interestedInModels.length - 2}` : '')
                        : lead.interestedInBrand || "-"
                      }
                      {lead.budget && ` · $${lead.budget.toLocaleString()}`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </span>
                    {getUrgencyBadge(lead.urgency)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {lead.email && (
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-xs text-blue-600 flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail className="w-3 h-3" />
                      {lead.email}
                    </a>
                  )}
                  {lead.phone && (
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-xs text-green-600 flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="w-3 h-3" />
                      {lead.phone}
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {getAvailabilityBadge(lead.modelsWithAvailability)}
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    {getDeviceIcon(lead.deviceType)}
                    {lead.browser}
                  </span>
                  {(lead.city || lead.country) && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Globe className="w-3 h-3" />
                      {lead.city ? `${lead.city}, ${lead.country}` : lead.country}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">{lead.messageCount} msgs</span>
                  <button
                    onClick={(e) => handleSendEmail(lead.id, e)}
                    disabled={emailSending && emailSendingId === lead.id}
                    className="ml-auto p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    title="Enviar resumen por email"
                  >
                    {emailSending && emailSendingId === lead.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                    <span className="text-xs">Email</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-700">
              Mostrando{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              -{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)}
              </span>{" "}
              de{" "}
              <span className="font-medium">{filteredAndSortedData.length}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm">
                {currentPage} / {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

        {/* Detail Modal - uses fixed positioning with viewport height */}
        {selectedLead && (
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[9999] flex items-start justify-center pt-[5vh] pb-[5vh] px-4 overflow-y-auto"
            style={{ height: '100vh', width: '100vw' }}
            onClick={() => setSelectedLead(null)}
          >
            <div
              className="bg-white w-full max-w-2xl rounded-lg overflow-hidden flex flex-col shadow-2xl"
              style={{ maxHeight: '90vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-blue-600 text-white rounded-t-lg flex-shrink-0">
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedLead.name || "Sin nombre"}
                  </h3>
                  <p className="text-sm text-blue-100">
                    {selectedLead.interestedInModels.length > 0
                      ? selectedLead.interestedInModels.join(', ')
                      : selectedLead.interestedInBrand || "Sin interés específico"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Send Email Button */}
                  <button
                    onClick={(e) => handleSendEmail(selectedLead.id, e)}
                    disabled={emailSending && emailSendingId === selectedLead.id}
                    className="flex items-center gap-2 px-3 py-2 bg-white text-blue-600 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                    title="Enviar resumen por email"
                  >
                    {emailSending && emailSendingId === selectedLead.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">
                      {emailSending && emailSendingId === selectedLead.id ? 'Enviando...' : 'Enviar Email'}
                    </span>
                  </button>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-2 hover:bg-blue-700 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Email Status Message */}
              {emailStatus && (
                <div className={`px-4 py-2 flex items-center gap-2 text-sm ${
                  emailStatus.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {emailStatus.type === 'success' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {emailStatus.message}
                </div>
              )}

              {/* Customer Info & Metadata */}
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                {/* Date & Contact Row */}
                <div className="flex flex-wrap items-center gap-3 text-sm mb-3 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                      {new Date(selectedLead.createdAt).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                  {selectedLead.email && (
                    <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                      <Mail className="w-4 h-4" />
                      {selectedLead.email}
                    </a>
                  )}
                  {selectedLead.phone && (
                    <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-1 text-green-600 hover:underline">
                      <Phone className="w-4 h-4" />
                      {selectedLead.phone}
                    </a>
                  )}
                </div>

                {/* Metadata Row - Device, Location, Browser */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                  <div className="bg-white rounded p-2 border">
                    <div className="text-gray-500 mb-1">Dispositivo</div>
                    <div className="flex items-center gap-1 font-medium text-gray-800">
                      {getDeviceIcon(selectedLead.deviceType)}
                      <span className="capitalize">{selectedLead.deviceType || '-'}</span>
                    </div>
                  </div>
                  <div className="bg-white rounded p-2 border">
                    <div className="text-gray-500 mb-1">Ubicación</div>
                    <div className="flex items-center gap-1 font-medium text-gray-800">
                      <Globe className="w-4 h-4" />
                      <span>{selectedLead.city ? `${selectedLead.city}, ${selectedLead.country}` : selectedLead.country || '-'}</span>
                    </div>
                  </div>
                  <div className="bg-white rounded p-2 border">
                    <div className="text-gray-500 mb-1">Navegador</div>
                    <div className="font-medium text-gray-800 truncate">{selectedLead.browser || '-'}</div>
                  </div>
                  <div className="bg-white rounded p-2 border">
                    <div className="text-gray-500 mb-1">Sistema</div>
                    <div className="font-medium text-gray-800 truncate">{selectedLead.os || '-'}</div>
                  </div>
                </div>

                {/* Page Context */}
                {selectedLead.pageUrl && (
                  <div className="text-xs text-gray-500 mb-3 truncate">
                    <span className="font-medium">Página:</span> {selectedLead.pageTitle || selectedLead.pageUrl}
                  </div>
                )}

                {/* Badges Row */}
                <div className="flex flex-wrap gap-2">
                  {selectedLead.budget && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      💰 ${selectedLead.budget.toLocaleString()}
                    </span>
                  )}
                  {selectedLead.urgency && getUrgencyBadge(selectedLead.urgency)}
                  {selectedLead.purchaseIntent && getIntentBadge(selectedLead.purchaseIntent)}
                  {selectedLead.hasReservation && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                      📋 Reserva: {selectedLead.reservationStatus}
                    </span>
                  )}
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    💬 {selectedLead.messageCount} mensajes
                  </span>
                </div>

                {/* Models interested with availability */}
                {selectedLead.modelsWithAvailability.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-600 mb-2">
                      Modelos Interesados ({selectedLead.modelsWithAvailability.length}):
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLead.modelsWithAvailability.map((m, i) => (
                        <span
                          key={i}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            m.available === 'available'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : m.available === 'out_of_stock'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {m.available === 'available' ? '✓' : m.available === 'out_of_stock' ? '✗' : '?'} {m.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Conversation */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Conversación ({selectedLead.messages.length} mensajes)
                </h4>
                {selectedLead.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {msg.role === "user" ? (
                          <User className="w-3 h-3" />
                        ) : (
                          <Bot className="w-3 h-3" />
                        )}
                        <span
                          className={`text-xs ${
                            msg.role === "user" ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {msg.role === "user" ? "Cliente" : "Asistente"} ·{" "}
                          {new Date(msg.timestamp).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className={`text-sm whitespace-pre-wrap ${msg.role === "user" ? "text-white" : "text-gray-800"}`}>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stat Card Modal */}
        {selectedStatCard && (
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[9999] flex items-start justify-center pt-[5vh] pb-[5vh] px-4 overflow-y-auto"
            style={{ height: '100vh', width: '100vw' }}
            onClick={() => setSelectedStatCard(null)}
          >
            <div
              className="bg-white w-full max-w-4xl rounded-lg overflow-hidden flex flex-col shadow-2xl"
              style={{ maxHeight: '90vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-800 text-white rounded-t-lg flex-shrink-0">
                <div>
                  <h3 className="font-semibold text-lg">
                    {getStatCardTitle(selectedStatCard)}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {getStatCardData(selectedStatCard).length} registros
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStatCard(null)}
                  className="p-2 hover:bg-gray-700 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* List Content */}
              <div className="flex-1 overflow-y-auto">
                {getStatCardData(selectedStatCard).length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No hay datos para mostrar
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {getStatCardData(selectedStatCard).map((lead) => (
                      <div
                        key={lead.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedStatCard(null);
                          setSelectedLead(lead);
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">
                                {lead.name || 'Sin nombre'}
                              </span>
                              {lead.urgency === 'immediate' && (
                                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs">🔥 Urgente</span>
                              )}
                              {lead.purchaseIntent === 'ready_to_buy' && (
                                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">💰 Listo</span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                              {lead.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {lead.email}
                                </span>
                              )}
                              {lead.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {lead.phone}
                                </span>
                              )}
                            </div>
                            {lead.interestedInModels.length > 0 && (
                              <div className="mt-1 text-sm text-gray-500">
                                <span className="font-medium">Interés:</span>{' '}
                                {lead.interestedInModels.slice(0, 3).join(', ')}
                                {lead.interestedInModels.length > 3 && ` +${lead.interestedInModels.length - 3} más`}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 text-xs text-gray-500 flex-shrink-0">
                            <span>
                              {new Date(lead.createdAt).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                            <div className="flex items-center gap-1">
                              {getDeviceIcon(lead.deviceType)}
                              {lead.city && <span>{lead.city}</span>}
                            </div>
                            <span className="text-gray-400">{lead.messageCount} msgs</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 sm:mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Marcas Más Solicitadas
            </h2>
            <div className="space-y-3">
              {analytics.topBrandsRequested.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {item.brand}
                  </span>
                  <span className="bg-purple-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
                    {item.count} clientes
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Productos Más Consultados
            </h2>
            <div className="space-y-3">
              {analytics.topInquiredProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {product.name}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {product.count} consultas
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Modelos No Disponibles
            </h2>
            <div className="space-y-3">
              {analytics.popularModels.slice(0, 5).map((model) => (
                <div
                  key={model.id}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {model.modelName}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {model.brand}
                    </span>
                  </div>
                  <span className="bg-orange-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
                    {model.requestCount} pedidos
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
