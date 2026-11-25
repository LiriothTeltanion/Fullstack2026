function LikeButton({ label, count, onLike }) {
  return (
    <button onClick={onLike}>
      {label} · {count}
    </button>
  );
}

export default LikeButton;
