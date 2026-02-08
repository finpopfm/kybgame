import { useEffect, useRef } from 'react';
import QRCodeLib from 'qrcode';

export default function QRCode({ url, size = 68 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !url) return;
    QRCodeLib.toCanvas(canvasRef.current, url, {
      width: size * 2, // 2x for retina
      margin: 1,
      color: {
        dark: '#a855f7',
        light: '#0a0a1a',
      },
      errorCorrectionLevel: 'L',
    }).catch(() => {});
  }, [url, size]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="qr-code"
      style={{ textDecoration: 'none' }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: size,
          height: size,
          borderRadius: '4px',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          display: 'block',
          imageRendering: 'pixelated',
        }}
      />
      <span className="qr-code__label">VERIFY THIS AUDIT</span>
    </a>
  );
}
