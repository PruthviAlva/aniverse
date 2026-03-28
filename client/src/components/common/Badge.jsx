// Badge.jsx — Small label pill used for genres, types, status etc.
const Badge = ({ label, color = "primary" }) => {
  const colorMap = {
    primary: "bg-anime-primary/20 text-anime-primary border-anime-primary/30",
    purple:  "bg-anime-purple/20 text-purple-400 border-purple-400/30",
    green:   "bg-green-500/20 text-green-400 border-green-400/30",
    gray:    "bg-anime-border/40 text-anime-muted border-anime-border",
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border
                      ${colorMap[color]}`}>
      {label}
    </span>
  );
};

export default Badge;