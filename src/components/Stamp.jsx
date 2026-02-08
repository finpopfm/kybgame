export default function Stamp({ type }) {
  const label =
    type === 'approved' ? 'APPROVED' :
    type === 'rejected' ? 'REJECTED' :
    'MORE DOCS';

  const inkClass =
    type === 'approved' ? 'stamp__ink--approved' :
    type === 'rejected' ? 'stamp__ink--rejected' :
    'stamp__ink--approved'; // request uses neutral ink

  return (
    <div className="stamp-overlay">
      <div className={`stamp__ink ${inkClass}`} />
      <div className={`stamp stamp--${type}`}>
        {label}
      </div>
    </div>
  );
}
