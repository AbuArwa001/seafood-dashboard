export function SettingsHeader() {
  return (
    <header>
      <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 font-heading leading-tight">
        System <span className="text-blue-600 italic">Configuration</span>
      </h2>
      <p className="text-slate-500 font-semibold mt-3 text-lg">
        Managing application preferences and{" "}
        <span className="text-blue-500 font-black underline decoration-blue-500/20 decoration-4 underline-offset-4">
          administrative protocols
        </span>
        .
      </p>
    </header>
  );
}
