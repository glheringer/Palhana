import { Flavor, PackagingOption, Order, ProspectLead, BatchProductionLog, StoreSettings } from '../types';
import { INITIAL_FLAVORS, INITIAL_PACKAGINGS, INITIAL_ORDERS, INITIAL_LEADS, INITIAL_BATCH_LOGS, INITIAL_SETTINGS } from '../data/initialData';

const KEYS = {
  SETTINGS: 'palhanas_settings_v1',
  FLAVORS: 'palhanas_flavors_v1',
  PACKAGINGS: 'palhanas_packagings_v1',
  ORDERS: 'palhanas_orders_v1',
  LEADS: 'palhanas_leads_v1',
  BATCHES: 'palhanas_batches_v1',
};

export const getSettings = (): StoreSettings => {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : INITIAL_SETTINGS;
  } catch {
    return INITIAL_SETTINGS;
  }
};

export const saveSettings = (settings: StoreSettings): void => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  window.dispatchEvent(new Event('palhanas_storage_update'));
};

export const getFlavors = (): Flavor[] => {
  try {
    const raw = localStorage.getItem(KEYS.FLAVORS);
    return raw ? JSON.parse(raw) : INITIAL_FLAVORS;
  } catch {
    return INITIAL_FLAVORS;
  }
};

export const saveFlavors = (flavors: Flavor[]): void => {
  localStorage.setItem(KEYS.FLAVORS, JSON.stringify(flavors));
  window.dispatchEvent(new Event('palhanas_storage_update'));
};

export const getPackagings = (): PackagingOption[] => {
  try {
    const raw = localStorage.getItem(KEYS.PACKAGINGS);
    return raw ? JSON.parse(raw) : INITIAL_PACKAGINGS;
  } catch {
    return INITIAL_PACKAGINGS;
  }
};

export const savePackagings = (packagings: PackagingOption[]): void => {
  localStorage.setItem(KEYS.PACKAGINGS, JSON.stringify(packagings));
  window.dispatchEvent(new Event('palhanas_storage_update'));
};

export const getOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(KEYS.ORDERS);
    return raw ? JSON.parse(raw) : INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
};

export const saveOrders = (orders: Order[]): void => {
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  window.dispatchEvent(new Event('palhanas_storage_update'));
};

export const getLeads = (): ProspectLead[] => {
  try {
    const raw = localStorage.getItem(KEYS.LEADS);
    return raw ? JSON.parse(raw) : INITIAL_LEADS;
  } catch {
    return INITIAL_LEADS;
  }
};

export const saveLeads = (leads: ProspectLead[]): void => {
  localStorage.setItem(KEYS.LEADS, JSON.stringify(leads));
  window.dispatchEvent(new Event('palhanas_storage_update'));
};

export const getBatches = (): BatchProductionLog[] => {
  try {
    const raw = localStorage.getItem(KEYS.BATCHES);
    return raw ? JSON.parse(raw) : INITIAL_BATCH_LOGS;
  } catch {
    return INITIAL_BATCH_LOGS;
  }
};

export const saveBatches = (batches: BatchProductionLog[]): void => {
  localStorage.setItem(KEYS.BATCHES, JSON.stringify(batches));
  window.dispatchEvent(new Event('palhanas_storage_update'));
};

// Reset to initial brand data
export const resetToDemoData = (): void => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  localStorage.setItem(KEYS.FLAVORS, JSON.stringify(INITIAL_FLAVORS));
  localStorage.setItem(KEYS.PACKAGINGS, JSON.stringify(INITIAL_PACKAGINGS));
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
  localStorage.setItem(KEYS.BATCHES, JSON.stringify(INITIAL_BATCH_LOGS));
  window.dispatchEvent(new Event('palhanas_storage_update'));
};
