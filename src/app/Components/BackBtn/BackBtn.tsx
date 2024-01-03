interface Props {
  id?: string | undefined;
}

export default function BackBtn({ id }: Props) {
  if (id) {
    return (
      <button
        id={`${id}`}
        className="back-btn"
        onClick={() => window.history.back()}
      >
        Back
      </button>
    );
  } else {
    return (
      <button className="back-btn" onClick={() => window.history.back()}>
        Back
      </button>
    );
  }
}
