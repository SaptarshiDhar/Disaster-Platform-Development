/** RAKSHA shield mark — a teal rounded square with a white diamond cutout, reused by both citizen screens. */
export function CitizenShield({ size = 44 }: { size?: number }) {
  return (
    <div
      className="grid shrink-0 place-items-center rounded-2xl bg-teal-600"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div
        className="rotate-45 bg-white"
        style={{ width: size * 0.28, height: size * 0.28, borderRadius: 3 }}
      />
    </div>
  );
}
