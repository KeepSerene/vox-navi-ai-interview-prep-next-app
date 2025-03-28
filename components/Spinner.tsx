function Spinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="absolute top-1/2 left-1/2 -translate-1/2 flex flex-col items-center gap-4"
    >
      <div
        aria-hidden="true"
        className="w-16 h-16 bg-transparent rounded-full border-4 border-primary-200 border-t-transparent animate-spin"
      />

      <p className="text-primary-100 font-semibold">{text}</p>
    </div>
  );
}

export default Spinner;
