import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  SiWhatsapp,
  SiTelegram,
  SiPaypal,
  SiStripe,
  SiInstagram,
  SiFacebook,
  SiX,
  SiYoutube,
  SiGithub,
  SiDiscord,
} from '@icons-pack/react-simple-icons';
import {
  User,
  Calendar,
  Wifi,
  Mail,
  Phone,
  Link,
} from 'lucide-react';

export interface StandardLogo {
  id: string;
  label: string;
  category: 'brand' | 'generic';
  getDataURL: () => string; // Lazy SVG data URL generation
}

/**
 * Convert a React icon component to an SVG data URL
 * Sets fill color to black (#000000) for visibility against QR backgrounds
 */
function iconToDataURL(IconComponent: React.ComponentType<any>, props: any = {}): string {
  // Create element with black fill for visibility
  const element = React.createElement(IconComponent, {
    ...props,
    fill: '#000000',
    color: '#000000',
  });

  const svgMarkup = ReactDOMServer.renderToStaticMarkup(element);
  return 'data:image/svg+xml,' + encodeURIComponent(svgMarkup);
}

/**
 * Standard logo library with brand and generic icons
 * Each logo's getDataURL is a lazy getter that converts the React icon to a data URL
 */
export const STANDARD_LOGOS: StandardLogo[] = [
  // Brand logos (from @icons-pack/react-simple-icons)
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    category: 'brand',
    getDataURL: () => iconToDataURL(SiWhatsapp, { size: 64 }),
  },
  {
    id: 'telegram',
    label: 'Telegram',
    category: 'brand',
    getDataURL: () => iconToDataURL(SiTelegram, { size: 64 }),
  },
  {
    id: 'paypal',
    label: 'PayPal',
    category: 'brand',
    getDataURL: () => iconToDataURL(SiPaypal, { size: 64 }),
  },
  {
    id: 'stripe',
    label: 'Stripe',
    category: 'brand',
    getDataURL: () => iconToDataURL(SiStripe, { size: 64 }),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    category: 'brand',
    getDataURL: () => iconToDataURL(SiInstagram, { size: 64 }),
  },
  {
    id: 'facebook',
    label: 'Facebook',
    category: 'brand',
    getDataURL: () => iconToDataURL(SiFacebook, { size: 64 }),
  },
  {
    id: 'x',
    label: 'X / Twitter',
    category: 'brand',
    getDataURL: () => iconToDataURL(SiX, { size: 64 }),
  },
  {
    id: 'youtube',
    label: 'YouTube',
    category: 'brand',
    getDataURL: () => iconToDataURL(SiYoutube, { size: 64 }),
  },
  {
    id: 'github',
    label: 'GitHub',
    category: 'brand',
    getDataURL: () => iconToDataURL(SiGithub, { size: 64 }),
  },
  {
    id: 'discord',
    label: 'Discord',
    category: 'brand',
    getDataURL: () => iconToDataURL(SiDiscord, { size: 64 }),
  },

  // Generic icons (from lucide-react)
  {
    id: 'user',
    label: 'User',
    category: 'generic',
    getDataURL: () => iconToDataURL(User, { size: 64, strokeWidth: 2 }),
  },
  {
    id: 'calendar',
    label: 'Calendar',
    category: 'generic',
    getDataURL: () => iconToDataURL(Calendar, { size: 64, strokeWidth: 2 }),
  },
  {
    id: 'wifi',
    label: 'WiFi',
    category: 'generic',
    getDataURL: () => iconToDataURL(Wifi, { size: 64, strokeWidth: 2 }),
  },
  {
    id: 'mail',
    label: 'Email',
    category: 'generic',
    getDataURL: () => iconToDataURL(Mail, { size: 64, strokeWidth: 2 }),
  },
  {
    id: 'phone',
    label: 'Phone',
    category: 'generic',
    getDataURL: () => iconToDataURL(Phone, { size: 64, strokeWidth: 2 }),
  },
  {
    id: 'link',
    label: 'Link',
    category: 'generic',
    getDataURL: () => iconToDataURL(Link, { size: 64, strokeWidth: 2 }),
  },
];
