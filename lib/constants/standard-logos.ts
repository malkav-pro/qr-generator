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
  getDataURL: (color?: string) => string; // Lazy SVG data URL generation with optional color
}

/**
 * Convert a React icon component to an SVG data URL
 * Accepts a color parameter for customizable logo colors
 */
function iconToDataURL(IconComponent: React.ComponentType<any>, color: string = '#000000', props: any = {}): string {
  // Create element with specified color
  const element = React.createElement(IconComponent, {
    ...props,
    fill: color,
    color: color,
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
    getDataURL: (color = '#000000') => iconToDataURL(SiWhatsapp, color, { size: 64 }),
  },
  {
    id: 'telegram',
    label: 'Telegram',
    category: 'brand',
    getDataURL: (color = '#000000') => iconToDataURL(SiTelegram, color, { size: 64 }),
  },
  {
    id: 'paypal',
    label: 'PayPal',
    category: 'brand',
    getDataURL: (color = '#000000') => iconToDataURL(SiPaypal, color, { size: 64 }),
  },
  {
    id: 'stripe',
    label: 'Stripe',
    category: 'brand',
    getDataURL: (color = '#000000') => iconToDataURL(SiStripe, color, { size: 64 }),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    category: 'brand',
    getDataURL: (color = '#000000') => iconToDataURL(SiInstagram, color, { size: 64 }),
  },
  {
    id: 'facebook',
    label: 'Facebook',
    category: 'brand',
    getDataURL: (color = '#000000') => iconToDataURL(SiFacebook, color, { size: 64 }),
  },
  {
    id: 'x',
    label: 'X / Twitter',
    category: 'brand',
    getDataURL: (color = '#000000') => iconToDataURL(SiX, color, { size: 64 }),
  },
  {
    id: 'youtube',
    label: 'YouTube',
    category: 'brand',
    getDataURL: (color = '#000000') => iconToDataURL(SiYoutube, color, { size: 64 }),
  },
  {
    id: 'github',
    label: 'GitHub',
    category: 'brand',
    getDataURL: (color = '#000000') => iconToDataURL(SiGithub, color, { size: 64 }),
  },
  {
    id: 'discord',
    label: 'Discord',
    category: 'brand',
    getDataURL: (color = '#000000') => iconToDataURL(SiDiscord, color, { size: 64 }),
  },

  // Generic icons (from lucide-react)
  {
    id: 'user',
    label: 'User',
    category: 'generic',
    getDataURL: (color = '#000000') => iconToDataURL(User, color, { size: 64, strokeWidth: 2 }),
  },
  {
    id: 'calendar',
    label: 'Calendar',
    category: 'generic',
    getDataURL: (color = '#000000') => iconToDataURL(Calendar, color, { size: 64, strokeWidth: 2 }),
  },
  {
    id: 'wifi',
    label: 'WiFi',
    category: 'generic',
    getDataURL: (color = '#000000') => iconToDataURL(Wifi, color, { size: 64, strokeWidth: 2 }),
  },
  {
    id: 'mail',
    label: 'Email',
    category: 'generic',
    getDataURL: (color = '#000000') => iconToDataURL(Mail, color, { size: 64, strokeWidth: 2 }),
  },
  {
    id: 'phone',
    label: 'Phone',
    category: 'generic',
    getDataURL: (color = '#000000') => iconToDataURL(Phone, color, { size: 64, strokeWidth: 2 }),
  },
  {
    id: 'link',
    label: 'Link',
    category: 'generic',
    getDataURL: (color = '#000000') => iconToDataURL(Link, color, { size: 64, strokeWidth: 2 }),
  },
];
