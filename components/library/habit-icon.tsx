import {
  IconHeartbeat,
  IconBarbell,
  IconApple,
  IconMoon,
  IconBrain,
  IconNotebook,
  IconUsers,
  IconHandStop,
  IconTrendingUp,
  IconCoin,
  IconHome,
  IconCircleCheck,
} from "@tabler/icons-react";

type TablerIcon = React.ComponentType<{
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  stroke?: number;
}>;

const BY_CATEGORY: Record<string, TablerIcon> = {
  Health: IconHeartbeat,
  Fitness: IconBarbell,
  Nutrition: IconApple,
  Sleep: IconMoon,
  Mind: IconBrain,
  Reflection: IconNotebook,
  Connection: IconUsers,
  Restraint: IconHandStop,
  Growth: IconTrendingUp,
  Financial: IconCoin,
  Environment: IconHome,
};

export function habitIcon(categoryNameEn: string) {
  return BY_CATEGORY[categoryNameEn] ?? IconCircleCheck;
}
