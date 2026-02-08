export default function ActionPanel({ onDecision, disabled }) {
  return (
    <div className="action-panel">
      <button
        className="action-btn action-btn--approve"
        onClick={() => onDecision('approve')}
        disabled={disabled}
      >
        Approve
      </button>
      <button
        className="action-btn action-btn--request"
        onClick={() => onDecision('request')}
        disabled={disabled}
      >
        Request Docs
      </button>
      <button
        className="action-btn action-btn--reject"
        onClick={() => onDecision('reject')}
        disabled={disabled}
      >
        Reject
      </button>
    </div>
  );
}
