export type FlavorId = 'tradicional' | 'ninho' | 'oreo' | 'doce_leite' | 'cafe' | 'nutella' | 'limao_siciliano' | 'churros';

export type PackagingType = 'unidade' | 'saquinho_kraft_3' | 'saquinho_kraft_5' | 'caixa_acrilica_6' | 'caixa_degustacao_12' | 'pote_mini_8';

export interface Flavor {
  id: FlavorId;
  name: string;
  description: string;
  badgeColor: string; // Hex matching brand
  textColor: string;
  accentBg: string;
  isPopular?: boolean;
  isNew?: boolean;
  cost: number; // Custo estimado de insumos por unidade
  price: number; // Preço unitário avulso
  stock: number; // Unidades prontas em estoque
  reserved: number; // Reservado para pedidos
  minStockAlert: number;
}

export interface PackagingOption {
  id: PackagingType;
  name: string;
  subtitle: string;
  capacity: number; // Quantas palhas cabem
  price: number; // Preço do kit
  cost: number; // Custo da embalagem
  description: string;
  imageType: 'bag_kraft' | 'box_acrylic' | 'single_seal' | 'box_tasting' | 'jar_mini';
  isBestSeller?: boolean;
}

export interface CartItem {
  id: string;
  packagingId: PackagingType;
  packagingName: string;
  selectedFlavors: { flavorId: FlavorId; quantity: number }[];
  unitPrice: number;
  quantity: number;
  giftNote?: string;
}

export type OrderStatus = 'recebido' | 'preparando' | 'saiu_entrega' | 'entregue' | 'cancelado';
export type PaymentStatus = 'pendente' | 'pago' | 'cartao_entrega' | 'fiado_consignado';
export type PaymentMethod = 'pix' | 'cartao' | 'dinheiro';
export type DeliveryType = 'entrega' | 'retirada';

export interface OrderItemSummary {
  packagingId: PackagingType;
  packagingName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  flavorsBreakdown: { flavorId: FlavorId; flavorName: string; count: number }[];
  giftNote?: string;
}

export interface Order {
  id: string; // Ex: PLH-1042
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerNeighborhood?: string;
  deliveryType: DeliveryType;
  deliveryDate?: string;
  deliveryTimeWindow?: string;
  deliveryFee: number;
  discount: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  pixProofUrl?: string;
  giftTagMessage?: string;
  notes?: string;
  items: OrderItemSummary[];
  trackingCode: string;
  source: 'catalogo_whatsapp' | 'manual' | 'prospeccao_b2b';
}

export type LeadStatus = 'novo_lead' | 'contatado' | 'amostra_entregue' | 'negociando' | 'cliente_ativo' | 'recorrente' | 'sem_interesse';
export type LeadType = 'cafeteria' | 'escritorio' | 'evento' | 'mercadinho' | 'salao_beleza' | 'consumidor_final';

export interface ProspectLead {
  id: string;
  name: string;
  companyOrPlace?: string;
  type: LeadType;
  phone: string;
  instagram?: string;
  address?: string;
  status: LeadStatus;
  estimatedVolume?: string; // ex: "30 palhas/semana"
  lastContactDate: string;
  nextFollowUpDate?: string;
  notes: string;
  totalOrdersCount: number;
  totalSpent: number;
}

export interface BatchProductionLog {
  id: string;
  date: string;
  flavorId: FlavorId;
  quantityProduced: number;
  batchCostTotal: number;
  notes?: string;
}

export interface StoreSettings {
  storeName: string;
  ownerName: string;
  whatsappPhone: string; // Ex: 5511999999999
  pixKey: string;
  pixKeyType: 'cpf' | 'cnpj' | 'telefone' | 'email' | 'aleatoria';
  pixReceiverName: string;
  pixCity: string;
  defaultDeliveryFee: number;
  freeDeliveryThreshold: number;
  pickupAddress: string;
  welcomeMessage: string;
  instagramHandle: string;
}
