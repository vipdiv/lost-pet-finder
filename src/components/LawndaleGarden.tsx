interface GardenProps {
  reunionCount: number;
  regularCount: number;
}

export function LawndaleGarden({ reunionCount, regularCount }: GardenProps) {
  const trees = Math.min(reunionCount, 12);
  const benches = Math.min(Math.floor(regularCount / 5), 4);

  return (
    <div className="card-frame p-4 md:p-6">
      <h3 className="font-serif text-lg font-semibold text-park-green-dark mb-2">
        Lawndale Garden
      </h3>
      <p className="text-xs text-park-sepia mb-4">
        Each reunion plants a tree. Every 5 regulars confirmed adds a bench.
      </p>

      <div className="bg-park-paper rounded-lg p-4 min-h-[80px] flex items-end gap-1 overflow-hidden">
        {/* Ground line */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-park-green/10 rounded-b-lg" />

        {/* Trees */}
        {Array.from({ length: trees }).map((_, i) => (
          <div key={`tree-${i}`} className="flex flex-col items-center mx-1">
            <svg
              className="w-8 h-10 text-park-green"
              viewBox="0 0 32 40"
              fill="currentColor"
            >
              <path d="M16 2 L8 16 L12 16 L6 28 L14 28 L14 38 L18 38 L18 28 L26 28 L20 16 L24 16 Z" />
            </svg>
          </div>
        ))}

        {/* Benches */}
        {Array.from({ length: benches }).map((_, i) => (
          <div key={`bench-${i}`} className="flex flex-col items-center mx-2">
            <svg
              className="w-10 h-6 text-park-brown"
              viewBox="0 0 40 24"
              fill="currentColor"
            >
              <rect x="2" y="10" width="36" height="3" rx="1" />
              <rect x="4" y="14" width="3" height="10" rx="1" />
              <rect x="33" y="14" width="3" height="10" rx="1" />
              <rect x="2" y="4" width="36" height="3" rx="1" />
              <rect x="4" y="0" width="3" height="7" rx="1" />
              <rect x="33" y="0" width="3" height="7" rx="1" />
            </svg>
          </div>
        ))}

        {trees === 0 && benches === 0 && (
          <div className="text-xs text-park-sepia/50 italic w-full text-center py-4">
            The garden is waiting for its first reunion...
          </div>
        )}
      </div>
    </div>
  );
}
