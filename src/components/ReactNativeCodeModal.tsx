import React, { useState } from 'react';
import { PalhanasBadge } from './BrandGraphics';
import {
  Smartphone,
  Copy,
  Check,
  Code,
  Download,
  ExternalLink,
  Layers,
  Sparkles,
  X,
  Play,
  Terminal,
  FileCode
} from 'lucide-react';

interface ReactNativeCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReactNativeCodeModal: React.FC<ReactNativeCodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeFile, setActiveFile] = useState<
    'App.tsx' | 'CatalogScreen.tsx' | 'TrackingScreen.tsx' | 'StockScreen.tsx' | 'package.json'
  >('App.tsx');
  const [copied, setCopied] = useState(false);

  const codeSnippets: Record<string, string> = {
    'App.tsx': `import React, { useState } from 'react';
import { StyleSheet, View, Text, StatusBar, SafeAreaView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Telas do Aplicativo Palhanas
import CatalogScreen from './screens/CatalogScreen';
import TrackingScreen from './screens/TrackingScreen';
import StockScreen from './screens/StockScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import ProspectingScreen from './screens/ProspectingScreen';

const Tab = createBottomTabNavigator();

// Paleta de Cores Oficial Palhanas
export const PALHANAS_COLORS = {
  chocolate: '#4B2E20',
  hazelnut: '#7A4A2E',
  caramel: '#D79A61',
  vanillaCream: '#F5EDE3',
  sweetPink: '#D88A8A',
  white: '#FFFFFF',
};

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={PALHANAS_COLORS.chocolate}
      />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle: {
              backgroundColor: PALHANAS_COLORS.chocolate,
              elevation: 4,
              shadowOpacity: 0.15,
            },
            headerTitleStyle: {
              fontWeight: '900',
              color: PALHANAS_COLORS.vanillaCream,
              fontSize: 18,
            },
            tabBarActiveTintColor: PALHANAS_COLORS.chocolate,
            tabBarInactiveTintColor: '#A89284',
            tabBarStyle: {
              backgroundColor: PALHANAS_COLORS.white,
              borderTopColor: '#E6D7C8',
              height: Platform.OS === 'ios' ? 88 : 64,
              paddingBottom: Platform.OS === 'ios' ? 24 : 8,
              paddingTop: 8,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen
            name="Vitrine"
            component={CatalogScreen}
            options={{
              title: 'Palhanas Artesanal',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="bag-handle" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Rastreio"
            component={TrackingScreen}
            options={{
              title: 'Acompanhar Pedido',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="truck-delivery" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Estoque"
            component={StockScreen}
            options={{
              title: 'Estoque & Fornadas',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="cube" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Caixa"
            component={PaymentsScreen}
            options={{
              title: 'Financeiro & Pix',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="cash" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Leads"
            component={ProspectingScreen}
            options={{
              title: 'Prospecção (CRM)',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="people" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALHANAS_COLORS.chocolate,
  },
});`,

    'CatalogScreen.tsx': `import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PALHANAS_COLORS } from '../App';

interface Flavor {
  id: string;
  name: string;
  price: number;
  description: string;
  badgeColor: string;
}

const FLAVORS: Flavor[] = [
  {
    id: 'tradicional',
    name: 'Palhana Tradicional',
    price: 6.0,
    description: 'Brigadeiro gourmet aveludado 50% cacau e biscoito crocante.',
    badgeColor: '#4B2E20',
  },
  {
    id: 'ninho_nutella',
    name: 'Leite Ninho c/ Nutella',
    price: 7.0,
    description: 'Brigadeiro puro de Ninho recheado com Nutella e finalizado no leite em pó.',
    badgeColor: '#C48A54',
  },
  {
    id: 'doce_leite',
    name: 'Doce de Leite Mineiro',
    price: 6.5,
    description: 'Doce de leite cremoso cozido lentamente com toque suave de canela.',
    badgeColor: '#B66E28',
  },
  {
    id: 'churros',
    name: 'Churros Artesanal',
    price: 6.5,
    description: 'Brigadeiro branco especial, doce de leite e açúcar com canela.',
    badgeColor: '#D79A61',
  },
  {
    id: 'maracuja',
    name: 'Maracujá Azedinho',
    price: 7.0,
    description: 'Chocolate branco cremoso com redução de polpa de maracujá.',
    badgeColor: '#E0A926',
  },
  {
    id: 'pistache',
    name: 'Pistache Premium',
    price: 8.5,
    description: 'Pasta pura de pistache italiano com pedacinhos tostados crocantes.',
    badgeColor: '#728C52',
  },
];

export default function CatalogScreen() {
  const [cartCount, setCartCount] = useState(0);

  const handleSendWhatsAppOrder = (flavorName: string) => {
    const phone = '5511999999999';
    const text = encodeURIComponent(
      \`Olá! Vim pelo App da *Palhanas* e gostaria de pedir 1 unidade de: *\\\${flavorName}*! ❤️\`
    );
    Linking.openURL(\`https://api.whatsapp.com/send?phone=\\\${phone}&text=\\\${text}\`);
  };

  return (
    <View style={styles.container}>
      {/* Slogan Banner */}
      <View style={styles.sloganBanner}>
        <Text style={styles.sloganText}>"O difícil é comer só uma."</Text>
        <Text style={styles.subSloganText}>Pequena no tamanho. Gigante na vontade. ❤️</Text>
      </View>

      <FlatList
        data={FLAVORS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.flavorIcon, { backgroundColor: item.badgeColor }]}>
              <Text style={styles.flavorIconText}>P</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.cardPrice}>R$ {item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.orderButton}
              onPress={() => handleSendWhatsAppOrder(item.name)}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#FFF" />
              <Text style={styles.orderButtonText}>Pedir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALHANAS_COLORS.vanillaCream,
  },
  sloganBanner: {
    backgroundColor: PALHANAS_COLORS.chocolate,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  sloganText: {
    color: PALHANAS_COLORS.caramel,
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  subSloganText: {
    color: PALHANAS_COLORS.vanillaCream,
    fontSize: 11,
    marginTop: 2,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6D7C8',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  flavorIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  flavorIconText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 20,
  },
  cardInfo: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PALHANAS_COLORS.chocolate,
  },
  cardDesc: {
    fontSize: 11,
    color: '#7A4A2E',
    marginTop: 2,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: PALHANAS_COLORS.chocolate,
    marginTop: 4,
  },
  orderButton: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});`,

    'TrackingScreen.tsx': `import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PALHANAS_COLORS } from '../App';

export default function TrackingScreen() {
  const [code, setCode] = useState('PLH-1042');

  const steps = [
    { label: 'Pedido Confirmado', done: true, time: 'Hoje às 14:15' },
    { label: 'Em Preparação na Cozinha', done: true, time: 'Hoje às 14:30' },
    { label: 'Saiu para Entrega', done: true, time: 'Hoje às 15:10' },
    { label: 'Entregue com Sucesso', done: false, time: 'Previsão: 15:45' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.searchCard}>
        <Text style={styles.title}>Rastreie sua Palha Fresquinha</Text>
        <Text style={styles.subtitle}>Digite o código do seu pedido (ex: PLH-1042):</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="Código do Pedido"
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.searchBtn}>
            <Ionicons name="search" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.timelineCard}>
        <Text style={styles.orderNumber}>Pedido #{code}</Text>
        <Text style={styles.clientName}>Cliente: Mariana Costa • 6 unidades</Text>

        <View style={styles.stepsContainer}>
          {steps.map((s, idx) => (
            <View key={idx} style={styles.stepRow}>
              <View style={[styles.stepDot, s.done ? styles.stepDotActive : null]}>
                <Ionicons
                  name={s.done ? 'checkmark' : 'time-outline'}
                  size={12}
                  color={s.done ? '#FFF' : '#A89284'}
                />
              </View>
              <View style={styles.stepInfo}>
                <Text style={[styles.stepLabel, s.done ? styles.stepLabelDone : null]}>
                  {s.label}
                </Text>
                <Text style={styles.stepTime}>{s.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALHANAS_COLORS.vanillaCream,
  },
  content: {
    padding: 16,
  },
  searchCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6D7C8',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PALHANAS_COLORS.chocolate,
  },
  subtitle: {
    fontSize: 12,
    color: '#7A4A2E',
    marginTop: 2,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F9F5F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D79A61',
    fontWeight: 'bold',
    color: PALHANAS_COLORS.chocolate,
  },
  searchBtn: {
    backgroundColor: PALHANAS_COLORS.chocolate,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6D7C8',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: PALHANAS_COLORS.chocolate,
  },
  clientName: {
    fontSize: 12,
    color: '#7A4A2E',
    marginBottom: 16,
  },
  stepsContainer: {
    gap: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E6D7C8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepDotActive: {
    backgroundColor: '#25D366',
  },
  stepInfo: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 13,
    color: '#7A4A2E',
  },
  stepLabelDone: {
    fontWeight: 'bold',
    color: PALHANAS_COLORS.chocolate,
  },
  stepTime: {
    fontSize: 10,
    color: '#A89284',
  },
});`,

    'StockScreen.tsx': `import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PALHANAS_COLORS } from '../App';

export default function StockScreen() {
  const [stock, setStock] = useState([
    { id: '1', name: 'Tradicional', qty: 24, min: 10 },
    { id: '2', name: 'Ninho c/ Nutella', qty: 18, min: 10 },
    { id: '3', name: 'Doce de Leite', qty: 12, min: 8 },
    { id: '4', name: 'Churros', qty: 8, min: 8 },
    { id: '5', name: 'Maracujá', qty: 5, min: 8 },
    { id: '6', name: 'Pistache', qty: 4, min: 6 },
  ]);

  const updateQty = (id: string, delta: number) => {
    setStock((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
      )
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={stock}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.stockCard}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.status}>
                {item.qty <= item.min ? '⚠️ Estoque Baixo' : '✅ Estoque Regular'}
              </Text>
            </View>
            <View style={styles.counter}>
              <TouchableOpacity
                onPress={() => updateQty(item.id, -1)}
                style={styles.counterBtn}
              >
                <Text style={styles.counterBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qty}>{item.qty}</Text>
              <TouchableOpacity
                onPress={() => updateQty(item.id, 1)}
                style={[styles.counterBtn, styles.counterBtnPlus]}
              >
                <Text style={[styles.counterBtnText, { color: '#FFF' }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALHANAS_COLORS.vanillaCream,
  },
  list: {
    padding: 16,
  },
  stockCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6D7C8',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PALHANAS_COLORS.chocolate,
  },
  status: {
    fontSize: 11,
    color: '#7A4A2E',
    marginTop: 2,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PALHANAS_COLORS.caramel,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnPlus: {
    backgroundColor: PALHANAS_COLORS.chocolate,
    borderColor: PALHANAS_COLORS.chocolate,
  },
  counterBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PALHANAS_COLORS.chocolate,
  },
  qty: {
    fontSize: 16,
    fontWeight: '900',
    color: PALHANAS_COLORS.chocolate,
    minWidth: 24,
    textAlign: 'center',
  },
});`,

    'package.json': `{
  "name": "palhanas-mobile-app",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.1",
    "react": "18.2.0",
    "react-native": "0.74.5",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/bottom-tabs": "^6.5.20",
    "@expo/vector-icons": "^14.0.0",
    "react-native-safe-area-context": "4.10.5",
    "react-native-screens": "3.31.1",
    "canvas-confetti": "^1.9.4"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "typescript": "^5.1.3"
  },
  "private": true
}`,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAllProject = () => {
    let bundle = `=== PROJETO REACT NATIVE EXPO: PALHANAS ARTESANAL ===\n\n`;
    Object.entries(codeSnippets).forEach(([fileName, content]) => {
      bundle += `\n/* ==================== ARQUIVO: ${fileName} ==================== */\n\n${content}\n\n`;
    });
    navigator.clipboard.writeText(bundle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#4B2E20]/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#D79A61] max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F5EDE3] text-[#4B2E20] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D79A61]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#4B2E20] border-2 border-[#D79A61] flex items-center justify-center text-white shadow-md">
              <Smartphone className="w-6 h-6 text-[#D79A61]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-brand font-bold text-xl sm:text-2xl text-[#4B2E20]">
                  Código React Native (Expo)
                </h3>
                <span className="bg-[#D88A8A]/20 text-[#4B2E20] font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-[#D88A8A]">
                  Pronto para iOS & Android
                </span>
              </div>
              <p className="text-xs text-[#7A4A2E]">
                Copie os componentes nativos para rodar no <strong>Expo Go</strong> ou no <strong>Snack Expo</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAllProject}
              className="bg-[#4B2E20] hover:bg-[#7A4A2E] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Copiar todos os arquivos em um único bloco"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Projeto Inteiro'}</span>
            </button>

            <a
              href="https://snack.expo.dev"
              target="_blank"
              rel="noreferrer"
              className="bg-[#D79A61] hover:bg-[#c48850] text-[#4B2E20] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir Expo Snack</span>
            </a>
          </div>
        </div>

        {/* File Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#D79A61]/20 pb-3">
          {(['App.tsx', 'CatalogScreen.tsx', 'TrackingScreen.tsx', 'StockScreen.tsx', 'package.json'] as const).map(
            (fileName) => {
              const isSelected = activeFile === fileName;
              return (
                <button
                  key={fileName}
                  onClick={() => setActiveFile(fileName)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-[#4B2E20] text-[#F5EDE3] shadow-xs'
                      : 'bg-[#F5EDE3] text-[#4B2E20] hover:bg-[#FFF9F2] border border-[#D79A61]/30'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-[#D79A61]" />
                  <span>{fileName}</span>
                </button>
              );
            }
          )}
        </div>

        {/* Code Viewer */}
        <div className="flex-1 min-h-0 relative bg-[#1E140F] rounded-2xl border border-[#D79A61]/40 overflow-hidden shadow-inner flex flex-col">
          <div className="bg-[#2D1B13] px-4 py-2 flex items-center justify-between text-xs text-[#D79A61] border-b border-[#4B2E20]">
            <span className="font-mono">{activeFile}</span>
            <button
              onClick={handleCopyCode}
              className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copiado!' : 'Copiar este arquivo'}</span>
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-[#F5EDE3] overflow-y-auto flex-1 leading-relaxed selection:bg-[#D79A61] selection:text-[#4B2E20]">
            <code>{codeSnippets[activeFile]}</code>
          </pre>
        </div>

        {/* Quick Instructions */}
        <div className="bg-[#FFF9F2] border border-[#D79A61]/30 p-3.5 rounded-2xl text-xs text-[#4B2E20] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#D88A8A] flex-shrink-0" />
            <div>
              <span className="font-bold">Como rodar no celular com Expo:</span>
              <p className="text-[11px] text-[#7A4A2E]">
                1. <code>npx create-expo-app palhanas-app</code> &nbsp;|&nbsp; 2. Instale as dependências &nbsp;|&nbsp; 3. <code>npx expo start</code> e leia o QR Code no app <strong>Expo Go</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-[#4B2E20] text-white px-4 py-1.5 rounded-xl font-bold text-xs hover:bg-[#7A4A2E]"
          >
            Voltar ao App
          </button>
        </div>
      </div>
    </div>
  );
};
