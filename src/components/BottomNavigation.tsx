import { Home, Search, TrendingUp, Crown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Beranda", path: "/" },
  { icon: Search, label: "Cari", path: "/search" },
  { icon: TrendingUp, label: "Trending", path: "/trending" },
  { icon: Crown, label: "VIP", path: "/vip" },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border bottom-nav">
      <div className="max-w-[430px] mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center touch-button flex-1"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`p-1.5 rounded-xl transition-colors duration-200 ${
                    isActive ? "bg-primary/20" : ""
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
