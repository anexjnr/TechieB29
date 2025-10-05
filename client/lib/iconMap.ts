import {
  Target,
  Palette,
  Cpu,
  BarChart3,
  Zap,
  Code,
  Award,
  Coffee,
  Globe,
  Database,
  Sparkles,
  Users,
  Clock,
  Shield,
  Trophy,
} from "lucide-react";

export const ICONS: Record<string, any> = {
  target: Target,
  palette: Palette,
  cpu: Cpu,
  "bar-chart-3": BarChart3,
  zap: Zap,
  code: Code,
  award: Award,
  coffee: Coffee,
  globe: Globe,
  database: Database,
  sparkles: Sparkles,
  users: Users,
  clock: Clock,
  shield: Shield,
  trophy: Trophy,
};

export const ICON_NAMES = Object.keys(ICONS);

export function getIconByName(name?: string) {
  if (!name) return null;
  return ICONS[name] || null;
}
