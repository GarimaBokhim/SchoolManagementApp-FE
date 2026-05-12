import {
  GraduationCap,
  Users,
  BookOpen,
  Trophy,
  Calendar,
  DollarSign,
  Activity,
  Award,
  Clock,
  TrendingUp,
} from "lucide-react";
import { JSX } from "react";

type ICard = {
  cardHead: string;
  cardStats: string | number;
  cardIcon?: JSX.Element;
  cardStyle?: string;
  cardStatUnit?: string;
  cardType?:
  | "student"
  | "teacher"
  | "course"
  | "award"
  | "event"
  | "revenue"
  | "attendance"
  | "achievement"
  | "schedule"
  | "progress";
};

type Props = {
  cards: ICard[];
};

// Function to get appropriate icon based on card type
const getCardIcon = (type?: string, customIcon?: JSX.Element) => {
  if (customIcon) return customIcon;

  switch (type) {
    case "student":
      return <Users className="text-green-400 text-4xl" />;

    case "teacher":
      return <Users className="text-green-400 text-4xl" />;

    case "course":
      return <BookOpen className="text-green-400 text-4xl" />;

    case "award":
      return <Award className="text-green-400 text-4xl" />;

    case "event":
      return <Calendar className="text-green-400 text-4xl" />;

    case "revenue":
      return <DollarSign className="text-green-400 text-4xl" />;

    case "attendance":
      return <Activity className="text-green-400 text-4xl" />;

    case "achievement":
      return <Trophy className="text-green-400 text-4xl" />;

    case "schedule":
      return <Clock className="text-green-400 text-4xl" />;

    case "progress":
      return <TrendingUp className="text-green-400 text-4xl" />;

    default:
      return <GraduationCap className="text-green-400 text-4xl" />;
  }
};

// Function to format numbers without K/M
const formatNumber = (value: string | number): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return String(value);

  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export default function StatCard({ cards }: Props) {
  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10"></div>

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(cyan 1px, transparent 1px),
              linear-gradient(90deg, cyan 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            opacity: 0.1,
          }}
        ></div>
      </div>

      {/* Cards */}
      <div className="relative z-10 flex flex-col sm:flex-row flex-wrap gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`
              flex flex-row justify-between items-center
              border bg-green-500/30 backdrop-blur-md
              rounded-2xl p-6 flex-1 min-w-[180px]
              shadow-lg hover:scale-105
              transition-transform duration-300
              ${card.cardStyle}
            `}
          >
            {/* Left Content */}
            <div>
              {/* Heading */}
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {card?.cardHead || "Total Student"}
              </div>

              {/* Stats */}
              <div className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mt-1 break-words">
                {card?.cardStatUnit && (
                  <span className="text-xs md:text-sm mr-1">
                    {card.cardStatUnit}
                  </span>
                )}

                {formatNumber(card?.cardStats || "2330")}
              </div>
            </div>

            {/* Right Icon */}
            <div>
              {getCardIcon(card?.cardType, card?.cardIcon)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}