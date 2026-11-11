import { config } from '../data/config';

export interface WishPayload {
  name: string;
  /** e.g. "YES" — a heart is appended in the message */
  answer: string;
  wish: string;
  message: string;
}

export function buildMessage(p: WishPayload): string {
  return [
    `Hello ${config.owner.name}! ♡`,
    '',
    'Someone just sent you a little wish!',
    '',
    `Name: ${p.name}`,
    '',
    `Answer: ${p.answer} ♡`,
    '',
    'My Wish:',
    p.wish,
    '',
    'My Message:',
    p.message.trim() ? p.message : '(no extra message)',
    '',
    `Sent from: ${config.whatsapp.sentFrom}`,
  ].join('\n');
}

/** Keep digits only: "+62 838-7002-8215" -> "6283870028215". */
export function normalizeNumber(raw: string): string {
  return raw.replace(/\D/g, '');
}

export function isNumberConfigured(raw: string = config.whatsapp.number): boolean {
  if (/x/i.test(raw)) return false; // still the "62XXXXXXXXXXX" placeholder
  return /^[1-9]\d{7,14}$/.test(normalizeNumber(raw));
}

/**
 * WhatsApp Click-to-Chat link. URLSearchParams encodes emojis, line breaks and special
 * characters; "+" (how it encodes spaces) is swapped for %20 because WhatsApp is stricter.
 */
export function buildWhatsAppUrl(p: WishPayload): string {
  const number = normalizeNumber(config.whatsapp.number);
  const qs = new URLSearchParams({ text: buildMessage(p) }).toString().replace(/\+/g, '%20');
  return `https://wa.me/${number}?${qs}`;
}
