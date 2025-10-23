/**
 * Utilidades para generar números de orden únicos
 */

/**
 * Genera un número de orden único basado en timestamp
 * Formato: ORD-YYYYMMDD-HHMMSS
 */
export const generateOrderNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `ORD-${year}${month}${day}-${hours}${minutes}${seconds}`;
};

/**
 * Genera un número de orden único con sufijo aleatorio
 * Formato: ORD-YYYYMMDD-XXXXXX
 */
export const generateOrderNumberWithRandom = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return `ORD-${year}${month}${day}-${randomSuffix}`;
};

/**
 * Genera un número de orden secuencial
 * Formato: ORD-YYYYMMDD-0001, ORD-YYYYMMDD-0002, etc.
 */
export const generateSequentialOrderNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePrefix = `${year}${month}${day}`;
  
  // Obtener el último número secuencial del localStorage
  const storageKey = `order_counter_${datePrefix}`;
  const lastCounter = parseInt(localStorage.getItem(storageKey) || '0');
  const newCounter = lastCounter + 1;
  
  // Guardar el nuevo contador
  localStorage.setItem(storageKey, newCounter.toString());
  
  return `ORD-${datePrefix}-${String(newCounter).padStart(4, '0')}`;
};

/**
 * Valida si un número de orden tiene el formato correcto
 */
export const isValidOrderNumber = (orderNumber) => {
  const pattern = /^ORD-\d{8}-[A-Z0-9]+$/;
  return pattern.test(orderNumber);
};

/**
 * Extrae la fecha de un número de orden
 */
export const extractDateFromOrderNumber = (orderNumber) => {
  const match = orderNumber.match(/^ORD-(\d{8})-/);
  if (match) {
    const dateStr = match[1];
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return new Date(year, month - 1, day);
  }
  return null;
};

const orderNumberUtils = {
  generateOrderNumber,
  generateOrderNumberWithRandom,
  generateSequentialOrderNumber,
  isValidOrderNumber,
  extractDateFromOrderNumber
};

export default orderNumberUtils;
