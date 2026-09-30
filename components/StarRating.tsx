interface StarRatingProps {
  rating: number; // 0 to 5
  ratingsCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function StarRating({
  rating,
  ratingsCount = 0,
  size = 'md',
  showText = true,
}: StarRatingProps) {
  const normalizedRating = Math.max(0, Math.min(5, Number(rating) || 0));

  const sizeMap = {
    sm: { width: 14, height: 14, spacing: 'gap-0.5', textClass: 'text-xs' },
    md: { width: 18, height: 18, spacing: 'gap-1', textClass: 'text-sm' },
    lg: { width: 24, height: 24, spacing: 'gap-1.5', textClass: 'text-base' },
  };

  const { width, height, spacing, textClass } = sizeMap[size];

  const starPath =
    'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';

  return (
    <div className="flex items-center flex-wrap gap-2">
      <div
        className={`flex items-center ${spacing}`}
        title={`Rating: ${normalizedRating.toFixed(1)} dari 5`}
      >
        {[0, 1, 2, 3, 4].map((starIndex) => {
          const fillPercentage = Math.max(
            0,
            Math.min(1, normalizedRating - starIndex)
          ) * 100;

          return (
            <div
              key={starIndex}
              className="relative inline-block select-none"
              style={{ width: `${width}px`, height: `${height}px` }}
            >
              <svg
                viewBox="0 0 24 24"
                width={width}
                height={height}
                className="text-gray-300 dark:text-zinc-700 block fill-current"
              >
                <path d={starPath} />
              </svg>

              {fillPercentage > 0 && (
                <div
                  className="absolute top-0 left-0 bottom-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width={width}
                    height={height}
                    className="text-amber-400 block fill-current drop-shadow-xs"
                  >
                    <path d={starPath} />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showText && (
        <div className={`flex items-center gap-1.5 font-medium ${textClass}`}>
          {normalizedRating > 0 ? (
            <>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                {normalizedRating.toFixed(1)}
              </span>
              <span className="text-gray-400 dark:text-zinc-500 text-xs">/ 5</span>
              {ratingsCount > 0 && (
                <span className="text-gray-500 dark:text-zinc-400 text-xs font-normal">
                  ({ratingsCount.toLocaleString('id-ID')})
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-400 dark:text-zinc-500 text-xs italic font-normal">
              Belum ada rating
            </span>
          )}
        </div>
      )}
    </div>
  );
}
