interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = "Loading..." }: SpinnerProps) {
  return (
    <div className="border border-neutral-300 bg-white p-6 text-center font-sans text-sm text-neutral-600">
      {label}
    </div>
  );
}
