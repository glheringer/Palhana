import { Order, ProspectLead, StoreSettings } from '../types';

export const formatPhoneForWhatsapp = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('55')) {
    return cleaned;
  }
  return `55${cleaned}`;
};

export const createWhatsappUrl = (phone: string, text: string): string => {
  const formattedPhone = formatPhoneForWhatsapp(phone);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
};

// Generates the clean customer checkout WhatsApp message
export const generateOrderWhatsappMessage = (
  order: Order,
  settings: StoreSettings
): string => {
  const itemsText = order.items
    .map((item, index) => {
      const flavorsList = item.flavorsBreakdown
        .map((f) => `   • ${f.count}x ${f.flavorName}`)
        .join('\n');
      return `📦 *Item ${index + 1}: ${item.packagingName}* (Qtd: ${item.quantity})\n${flavorsList}${
        item.giftNote ? `\n   🎁 _Obs/Presente: ${item.giftNote}_` : ''
      }\n   💰 R$ ${item.total.toFixed(2)}`;
    })
    .join('\n\n');

  const deliveryInfo =
    order.deliveryType === 'entrega'
      ? `🛵 *Forma:* Entrega no endereço\n📍 *Endereço:* ${order.customerAddress || 'A combinar'}${
          order.customerNeighborhood ? ` (${order.customerNeighborhood})` : ''
        }\n🚚 *Taxa de Entrega:* R$ ${order.deliveryFee.toFixed(2)}`
      : `🛍️ *Forma:* Retirada no Ateliê Palhanas\n📍 *Local:* ${settings.pickupAddress}`;

  const paymentText =
    order.paymentMethod === 'pix'
      ? `💳 *Pagamento:* Pix (Chave: ${settings.pixKey})`
      : order.paymentMethod === 'cartao'
      ? `💳 *Pagamento:* Cartão na entrega/retirada`
      : `💵 *Pagamento:* Dinheiro`;

  const trackingLink = `${window.location.origin}/?track=${order.trackingCode}`;

  return `🍫 *NOVO PEDIDO - PALHANAS ARTESANAL* 🍫
_O difícil é comer só uma._
-----------------------------------
🏷️ *Código do Pedido:* #${order.id}
👤 *Cliente:* ${order.customerName}
📱 *WhatsApp:* ${order.customerPhone}

🛒 *ITENS DO PEDIDO:*
${itemsText}

${order.giftTagMessage ? `💌 *Mensagem do Cartãozinho:* "${order.giftTagMessage}"\n` : ''}
${order.notes ? `📝 *Observações:* ${order.notes}\n` : ''}
-----------------------------------
${deliveryInfo}
${paymentText}

Subtotal: R$ ${order.subtotal.toFixed(2)}
${order.deliveryFee > 0 ? `Entrega: R$ ${order.deliveryFee.toFixed(2)}\n` : ''}${
    order.discount > 0 ? `Desconto: -R$ ${order.discount.toFixed(2)}\n` : ''
  }💰 *VALOR TOTAL: R$ ${order.total.toFixed(2)}*
-----------------------------------
✨ *Acompanhe seu pedido em tempo real pelo link:*
${trackingLink}

Gostaria de confirmar a disponibilidade e o envio! ❤️`;
};

// Generates delivery update notification for the client
export const generateStatusUpdateWhatsappMessage = (
  order: Order,
  settings: StoreSettings
): string => {
  const trackingLink = `${window.location.origin}/?track=${order.trackingCode}`;

  let statusMessage = '';
  switch (order.status) {
    case 'recebido':
      statusMessage = `Seu pedido *#${order.id}* foi confirmado e já entrou em nossa fila de produção artesanal! 👩‍🍳`;
      break;
    case 'preparando':
      statusMessage = `Oba! Suas palhas italianas estão na fornada e sendo embaladas com todo carinho nos saquinhos/caixas da Palhanas! 🎀🍫`;
      break;
    case 'saiu_entrega':
      statusMessage =
        order.deliveryType === 'entrega'
          ? `🛵 *SEU PEDIDO SAIU PARA ENTREGA!* O entregador está a caminho do seu endereço. Fique de olho!`
          : `🛍️ *SEU PEDIDO ESTÁ PRONTO PARA RETIRADA!* Pode passar no nosso ateliê para retirar suas delícias!`;
      break;
    case 'entregue':
      statusMessage = `🎉 *PEDIDO ENTREGUE!* Esperamos que você ame cada mordida! Depois nos conte o que achou. O difícil é comer só uma! ❤️`;
      break;
    case 'cancelado':
      statusMessage = `Seu pedido #${order.id} foi cancelado. Qualquer dúvida estamos à disposição!`;
      break;
  }

  return `Olá, *${order.customerName}*! Tudo bem? Aqui é da *${settings.storeName}* ❤️

${statusMessage}

🔍 *Acompanhe o status do pedido:*
${trackingLink}

Qualquer dúvida, é só responder aqui!`;
};

// Generates Pix payment reminder
export const generatePixReminderMessage = (order: Order, settings: StoreSettings): string => {
  return `Oi, *${order.customerName}*! Tudo bom? 🍫

Passando só para te lembrar do pagamento Pix do seu pedido *#${order.id}* na *Palhanas*:

💰 *Valor:* R$ ${order.total.toFixed(2)}
🔑 *Chave Pix (${settings.pixKeyType.toUpperCase()}):* \`${settings.pixKey}\`
👤 *Nome:* ${settings.pixReceiverName}

Assim que fizer, pode nos mandar o comprovante aqui para liberarmos sua entrega fresquinha! Muito obrigada ❤️`;
};

// Scripts for B2B & Customer prospecting
export interface ProspectScript {
  id: string;
  title: string;
  category: 'cafeteria' | 'escritorio' | 'evento' | 'promocao' | 'pos_venda';
  description: string;
  generateText: (lead: ProspectLead, settings: StoreSettings) => string;
}

export const PROSPECT_SCRIPTS: ProspectScript[] = [
  {
    id: 'cafeteria_apresentacao',
    title: 'Parceria com Cafeterias & Bistrôs',
    category: 'cafeteria',
    description: 'Apresentar a Palhanas para o dono/gerente de cafeteria para colocar no balcão.',
    generateText: (lead, settings) => {
      const name = lead.name.split(' ')[0] || 'Tudo bem?';
      return `Olá, *${name}*! Tudo bem? Me chamo da *${settings.storeName}* (${settings.instagramHandle}) 🍫✨

Acompanho o trabalho do *${lead.companyOrPlace || 'seu café'}* e admiro muito o cuidado com as experiências dos clientes!

Nós produzimos palhas italianas 100% artesanais (com embalagens lindas em saquinhos kraft e caixas de acrílico com selo) que combinam perfeitamente com um bom café espresso no balcão.

Gostaria de passar aí esta semana para deixar uma caixinha de degustação sem custo nenhum para você e sua equipe provarem. 

Qual seria o melhor dia e horário para eu levar? ❤️`;
    },
  },
  {
    id: 'amostra_gratis',
    title: 'Oferta de Amostra Degustação',
    category: 'cafeteria',
    description: 'Oferecer kit de degustação dos melhores sabores (Tradicional, Ninho, Oreo).',
    generateText: (lead, settings) => {
      const name = lead.name.split(' ')[0] || 'Olá';
      return `Oi, *${name}*! Tudo bem? 

Estou organizando o roteiro de entregas de amostras da *${settings.storeName}* desta semana. 

Preparamos um kit especial com nossos 3 sabores mais pedidos (Tradicional 50% Cacau, Ninho Trufado e Oreo Cream). 

Posso deixar um kit aí no *${lead.companyOrPlace || 'seu local'}* para vocês conhecerem? É 100% cortesia! 🎁😋`;
    },
  },
  {
    id: 'escritorio_mimo',
    title: 'Mimo Corporativo & Coffee Break',
    category: 'escritorio',
    description: 'Proposta para empresas, recepções, aniversariantes do mês e presentes.',
    generateText: (lead, settings) => {
      const name = lead.name.split(' ')[0] || 'Olá';
      return `Olá, *${name}*! Tudo bem? 

Aqui é da *${settings.storeName}*! Nós criamos lembrancinhas e mimos corporativos em palha italiana artesanal para eventos, recepção de clientes e aniversariantes do mês na *${lead.companyOrPlace || 'sua empresa'}*.

Nossas caixas e saquinhos contam com tags personalizadas e visual impecável.

Gostaria de receber nosso catálogo corporativo com condições especiais para pedidos em lote? 💼🍫`;
    },
  },
  {
    id: 'evento_lembrancinha',
    title: 'Lembrancinhas para Casamentos & Festas',
    category: 'evento',
    description: 'Proposta para noivas, formandos e cerimonialistas.',
    generateText: (lead, settings) => {
      const name = lead.name.split(' ')[0] || 'Olá';
      return `Olá, *${name}*! Tudo bem? 

Sou da *${settings.storeName}*! Especializada em palhas italianas artesanais finas para eventos e casamentos elegantes.

Nossas palhas vêm em embalagens exclusivas com laços em fita rústica, selo personalizado e sabores que encantam todos os convidados.

Se você estiver planejando um evento especial, adoraria enviar nosso catálogo de lembrancinhas e uma caixinha de prova! 💍✨`;
    },
  },
  {
    id: 'sexta_promocao',
    title: 'Promoção do Fim de Semana (Sextou Doce)',
    category: 'promocao',
    description: 'Disparo para reativar clientes e fechar pedidos de sexta a domingo.',
    generateText: (lead, settings) => {
      const name = lead.name.split(' ')[0] || 'Oi';
      return `Oi, *${name}*! Sextou com novidade na *${settings.storeName}*! 🍫😋

Fizemos fornadas fresquinhas de *Tradicional, Ninho Trufado e Oreo* saindo agora.

Que tal garantir um saquinho kraft ou uma caixinha para adoçar o seu fim de semana?

Você pode escolher seus sabores e pedir diretamente no nosso aplicativo:
👉 ${window.location.origin}

Entregamos hoje quentinho no seu endereço! ❤️`;
    },
  },
  {
    id: 'pos_venda',
    title: 'Pós-Venda & Avaliação Carinhosa',
    category: 'pos_venda',
    description: 'Perguntar como foi a experiência do cliente e pedir feedback.',
    generateText: (lead, settings) => {
      const name = lead.name.split(' ')[0] || 'Oi';
      return `Oi, *${name}*! Passando para saber o que achou das nossas palhas italianas! 🥰

Esperamos de coração que tenha adoçado o seu dia. Como diz nosso lema: _O difícil é comer só uma!_ 

Se puder marcar a gente no Instagram (*${settings.instagramHandle}*) ou mandar uma fotinho, vamos amar repostar!

Até o próximo pedido! ❤️`;
    },
  },
];
