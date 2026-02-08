// QR Code component — uses Google Charts API to generate a real scannable QR code
// Purple on dark background to match FINPOP aesthetic

const VERIFY_URL = 'https://kyb.finpop.fm/verify';

export default function QRCode({ size = 68 }) {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(VERIFY_URL)}&color=a855f7&bgcolor=0a0a1a&margin=1&format=svg`;

  return (
    <a
      href={VERIFY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="qr-code"
      style={{ textDecoration: 'none' }}
    >
      <img
        src={qrSrc}
        alt="Verify audit"
        width={size}
        height={size}
        style={{
          borderRadius: '4px',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          display: 'block',
        }}
      />
      <span className="qr-code__label">VERIFY THIS AUDIT</span>
    </a>
  );
}
