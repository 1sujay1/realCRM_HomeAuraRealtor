import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode, useRef, useEffect, useState } from 'react';

interface ScrollableCardsProps {
    children: ReactNode;
}

const ScrollableCards = ({ children }: ScrollableCardsProps) => {
    const cardsRef = useRef<HTMLDivElement>(null);
    const [arrows, setArrows] = useState({ left: false, right: true });

    const updateArrowStates = () => {
        if (cardsRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = cardsRef.current;
            const atStart = scrollLeft === 0;
            const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;

            setArrows({
                left: !atStart,
                right: !atEnd
            });
        }
    };

    useEffect(() => {
        updateArrowStates();
        const container = cardsRef.current;
        if (container) {
            container.addEventListener('scroll', updateArrowStates);
            return () => container.removeEventListener('scroll', updateArrowStates);
        }
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (cardsRef.current) {
            cardsRef.current.scrollBy({ left: direction === 'left' ? -280 : 280, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative px-12 md:px-0">
            <div ref={cardsRef} className="overflow-x-auto pb-4 scrollbar-hide">
                {children}
            </div>

            {/* Navigation arrows for mobile */}
            <div className="md:hidden absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
                <button
                    onClick={() => scroll('left')}
                    disabled={!arrows.left}
                    className={`bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-slate-200 hover:bg-white transition-colors -ml-2 ${!arrows.left ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <ChevronLeft size={16} className="text-slate-600" />
                </button>
            </div>

            <div className="md:hidden absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
                <button
                    onClick={() => scroll('right')}
                    disabled={!arrows.right}
                    className={`bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-slate-200 hover:bg-white transition-colors -mr-2 ${!arrows.right ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <ChevronRight size={16} className="text-slate-600" />
                </button>
            </div>
        </div>
    );
};

export default ScrollableCards;
