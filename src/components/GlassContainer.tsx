export function GlassContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass p-6 rounded-2xl ${className}`}>
      {children}
    </div>
  )
}
