export function BackgroundGradients() {
  return (
    <div className="absolute inset-0 opacity-30">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 animate-gradient-shift" />
      <div className="absolute inset-0 bg-gradient-to-tl from-indigo-900/20 via-purple-900/20 to-pink-900/20 animate-gradient-shift-reverse" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-green-900/10 animate-gradient-horizontal" />
    </div>
  );
}
