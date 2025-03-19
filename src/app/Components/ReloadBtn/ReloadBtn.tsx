interface Props {
  id?: string | undefined;
  label?: string;
  onClick?: () => void;
}

export default function ReloadBtn({ id, label, onClick }: Props) {
  return (
    <button
      id={id || 'ReloadBtn'}
      className="reload-btn"
      onClick={onClick ? onClick : () => window.location.reload()}
    >
      {label || 'Reload'}
    </button>
  );
}
