interface Props {
  id?: string | undefined;
}

export default function ReloadBtn({ id }: Props) {
  if (id) {
    return (
      <button
        id={`${id}`}
        className="reload-btn"
        onClick={() => window.location.reload()}
      >
        Reload
      </button>
    );
  } else {
    return (
      <button className="reload-btn" onClick={() => window.location.reload()}>
        Reload
      </button>
    );
  }
}
