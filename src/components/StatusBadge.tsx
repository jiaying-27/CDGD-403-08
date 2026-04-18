type StatusBadgeProps = {
  label: string;
  value: string;
};

export default function StatusBadge({ label, value }: StatusBadgeProps) {
  return (
    <p className="status-badge">
      {label}: {value}
    </p>
  );
}
