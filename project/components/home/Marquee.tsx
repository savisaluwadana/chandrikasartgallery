'use client';

export function Marquee() {
    const items = [
        'ORIGINAL PAINTINGS',
        'LIMITED EDITIONS',
        'WORLDWIDE SHIPPING',
        'AUTHENTICITY GUARANTEED',
        'SRI LANKA',
        'FINE ART',
    ];

    // Duplicate items to ensure it's long enough even for one copy on wide screens
    const extendedItems = [...items, ...items, ...items];

    const content = extendedItems.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-6 mx-6 text-sm md:text-base font-light tracking-[0.25em] text-black/30 uppercase whitespace-nowrap">
            {item}
            <span className="text-[#6CD8D1] text-lg">✦</span>
        </span>
    ));

    return (
        <div className="py-6 bg-white border-y border-black/[0.05] overflow-hidden relative z-20">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div
                className="flex w-max"
                style={{
                    animation: 'marquee-scroll 60s linear infinite',
                }}
            >
                {/* First copy */}
                <div className="flex shrink-0 items-center justify-around min-w-full">
                    {content}
                </div>
                {/* Second copy (seamless duplicate) */}
                <div className="flex shrink-0 items-center justify-around min-w-full">
                    {content}
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee-scroll {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
}
