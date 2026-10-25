type Props = { title: string; subtitle: string; children: React.ReactNode; footer?: React.ReactNode };

export function AuthCard({ title, subtitle, children, footer }: Props) {
  return (
    <div className="glass rounded-3xl p-6 shadow-2xl sm:p-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{subtitle}</p>
      {children}
      {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}
