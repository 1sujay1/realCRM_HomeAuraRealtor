
import { Loader2 } from "lucide-react";
export default function Spinner({ className, size=20 }: { className?: string, size?: number }) {
    return <Loader2 size={size} className={`animate-spin ${className}`} />;
}
