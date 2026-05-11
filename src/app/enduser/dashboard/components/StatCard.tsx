import { GraduationCap, Users, BookOpen, Trophy, Calendar, DollarSign, Activity, Award, Clock, TrendingUp } from "lucide-react";
import { JSX } from "react";

type ICard = {
  cardHead: string;
  cardStats: string | number;
  cardIcon?: JSX.Element;
  cardStyle?: string;
  cardStatUnit?: string;
  cardType?: 'student' | 'teacher' | 'course' | 'award' | 'event' | 'revenue' | 'attendance' | 'achievement' | 'schedule' | 'progress';
};

type Props = {
  cards: ICard[];
};

// Function to get appropriate icon based on card type
const getCardIcon = (type?: string, customIcon?: JSX.Element) => {
  if (customIcon) return customIcon;

  switch (type) {
    case 'student':
      return <Users className="text-green-400 text-4xl" />;
    case 'teacher':
      return <Users className="text-green-400 text-4xl" />;
    case 'course':
      return <BookOpen className="text-green-400 text-4xl" />;
    case 'award':
      return <Award className="text-green-400 text-4xl" />;
    case 'event':
      return <Calendar className="text-green-400 text-4xl" />;
    case 'revenue':
      return <DollarSign className="text-green-400 text-4xl" />;
    case 'attendance':
      return <Activity className="text-green-400 text-4xl" />;
    case 'achievement':
      return <Trophy className="text-green-400 text-4xl" />;
    case 'schedule':
      return <Clock className="text-green-400 text-4xl" />;
    case 'progress':
      return <TrendingUp className="text-green-400 text-4xl" />;
    default:
      return <GraduationCap className="text-green-400 text-4xl" />;
  }
};

// Function to format large numbers
const formatNumber = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return String(value);

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }

  return num.toLocaleString();
};

export default function StatCard({ cards }: Props) {
  return (
    <div className="relative ">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            opacity: 0.1,
          }}
        ></div>
      </div>
      <div className="relative z-10 flex flex-col sm:flex-row flex-wrap gap-6 ">
        {cards.map((card, index) => (
          <div
            className={`flex flex-row border justify-between items-center text-text bg-green-500/30 backdrop-blur-md rounded-2xl p-6 flex-1 min-w-[180px] shadow-lg hover:scale-105 transition-transform duration-300 ${card.cardStyle}`}
            key={index}
          >
            <div>
              <div className="text-sm ">
                {card?.cardHead || "Total Student"}
              </div>
              <div className="text-2xl font-bold ">
                {card?.cardStatUnit && (
                  <span className="text-sm mr-1 ">{card.cardStatUnit}</span>
                )}
                {formatNumber(card?.cardStats || "2330")}
              </div>
            </div>
            {getCardIcon(card?.cardType, card?.cardIcon)}
          </div>
        ))}
      </div>
    </div>
  );
}