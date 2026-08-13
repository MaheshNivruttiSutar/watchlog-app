import * as ToggleGroup from '@radix-ui/react-toggle-group';

interface RatingInputProps {
  value: number | null;
  onChange: (rating: number | null) => void;
  /** Optional id of a visible label (preferred over aria-label alone). */
  'aria-labelledby'?: string;
}

function RatingInput({
  value,
  onChange,
  'aria-labelledby': ariaLabelledBy,
}: RatingInputProps) {
  const filledThrough = value ?? 0;

  return (
    <ToggleGroup.Root
      type="single"
      value={value === null ? '' : String(value)}
      onValueChange={(next) => {
        onChange(next === '' ? null : Number(next));
      }}
      aria-label={ariaLabelledBy ? undefined : 'Rating from 1 to 5 stars'}
      aria-labelledby={ariaLabelledBy}
      className="inline-flex items-center gap-0.5"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= filledThrough;
        return (
          <ToggleGroup.Item
            key={star}
            value={String(star)}
            aria-label={`${star} star${star === 1 ? '' : 's'}`}
            className={[
              'inline-flex items-center justify-center w-8 h-8 border-0 rounded-button bg-transparent text-[1.25rem] leading-none cursor-pointer transition-colors',
              'focus-visible:outline-none focus-visible:shadow-focus',
              filled ? 'text-warning' : 'text-border hover:text-warning/70',
            ].join(' ')}
          >
            ★
          </ToggleGroup.Item>
        );
      })}
    </ToggleGroup.Root>
  );
}

export default RatingInput;
