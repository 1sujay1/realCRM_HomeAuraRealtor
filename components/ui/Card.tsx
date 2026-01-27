import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = "", onClick, ...props }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
