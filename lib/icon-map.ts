import {
  Users, HeartHandshake, Waves, ShieldCheck, Wind, CloudRain, Languages,
  Home, MonitorSmartphone, PhoneCall, ClipboardList, CalendarCheck, Compass,
  BookOpen, Scale, LifeBuoy, MapPin, GraduationCap, Landmark, BadgeCheck,
  Lock, Clock, Wallet, Sparkles, MessageCircleQuestion, FileText,
} from 'lucide-react';

/* One icon library, one stroke weight, one 24px grid — Lucide, per the brief.
 * Mapping lives here rather than in components so a page never picks an icon
 * ad hoc and the vocabulary stays consistent across the site. */

export const SERVICE_ICONS: Record<string, typeof Users> = {
  'individual-therapy': Compass,
  'couples-therapy': HeartHandshake,
  'emdr-therapy': Waves,
  'trauma-therapy': ShieldCheck,
  'anxiety-counselling': Wind,
  'depression-counselling': CloudRain,
  'punjabi-counselling': Languages,
  'south-asian-mental-health': Home,
  'online-counselling-bc': MonitorSmartphone,
};

export const HUB_ICONS = {
  guides: BookOpen,
  approaches: Sparkles,
  compare: Scale,
  resources: LifeBuoy,
  for: Users,
  locations: MapPin,
  glossary: FileText,
  faq: MessageCircleQuestion,
} as const;

export const PROCESS_ICONS = [PhoneCall, ClipboardList, CalendarCheck] as const;

export const TRUST_ICONS = {
  credential: BadgeCheck,
  association: GraduationCap,
  languages: Languages,
  coverage: Wallet,
  privacy: Lock,
  hours: Clock,
  region: Landmark,
} as const;

export const getServiceIcon = (slug: string) => SERVICE_ICONS[slug] ?? Compass;
