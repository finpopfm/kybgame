import { SANCTIONED_COUNTRIES, HIGH_RISK_BUSINESSES, GAME_DATE } from '../data/merchants';

function isExpired(dateStr) {
  if (!dateStr || dateStr === '—') return false;
  return new Date(dateStr) < new Date(GAME_DATE);
}

function isSoonExpiring(dateStr) {
  if (!dateStr || dateStr === '—') return false;
  const date = new Date(dateStr);
  const gameDate = new Date(GAME_DATE);
  const diff = date - gameDate;
  return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000; // < 90 days
}

function isRecentRegistration(dateStr) {
  if (!dateStr || dateStr === '—') return false;
  const date = new Date(dateStr);
  const gameDate = new Date(GAME_DATE);
  const diff = gameDate - date;
  return diff >= 0 && diff < 60 * 24 * 60 * 60 * 1000; // < 60 days
}

export default function MerchantCard({ merchant }) {
  const { company, ubo } = merchant;

  const isSanctioned = SANCTIONED_COUNTRIES.includes(company.country);
  const isHighRisk = HIGH_RISK_BUSINESSES.includes(company.type.split(' — ')[0]) ||
    HIGH_RISK_BUSINESSES.some(hr => company.type.includes(hr));
  const passportExpired = isExpired(ubo.passportExpiry);
  const passportSoon = isSoonExpiring(ubo.passportExpiry);
  const newCompany = isRecentRegistration(company.registrationDate);
  const lowOwnership = parseInt(ubo.ownership) < 25;

  return (
    <div className="merchant-card">
      <div className="merchant-card__header">
        <div className="merchant-card__company">{company.name}</div>
        <div className="merchant-card__id">{merchant.id}</div>
      </div>

      <div className="merchant-card__grid">
        <div className="merchant-card__field">
          <div className="merchant-card__label">Country</div>
          <div className={`merchant-card__value ${isSanctioned ? 'merchant-card__value--flag' : ''}`}>
            {company.country}
            {isSanctioned && ' ⚠'}
          </div>
        </div>

        <div className="merchant-card__field">
          <div className="merchant-card__label">Business Type</div>
          <div className={`merchant-card__value ${isHighRisk ? 'merchant-card__value--flag' : ''}`}>
            {company.type}
            {isHighRisk && ' ⚠'}
          </div>
        </div>

        <div className="merchant-card__field">
          <div className="merchant-card__label">Registered</div>
          <div className={`merchant-card__value ${newCompany ? 'merchant-card__value--flag' : ''}`}>
            {company.registrationDate}
            {newCompany && ' (NEW)'}
          </div>
        </div>

        <div className="merchant-card__field">
          <div className="merchant-card__label">UBO</div>
          <div className="merchant-card__value">{ubo.name}</div>
        </div>

        <div className="merchant-card__field">
          <div className="merchant-card__label">UBO Ownership</div>
          <div className={`merchant-card__value ${lowOwnership ? 'merchant-card__value--flag' : ''}`}>
            {ubo.ownership}
            {lowOwnership && ' ⚠'}
          </div>
        </div>

        <div className="merchant-card__field">
          <div className="merchant-card__label">Passport Expiry</div>
          <div className={`merchant-card__value ${passportExpired ? 'merchant-card__value--flag' : passportSoon ? 'merchant-card__value--flag' : ''}`}>
            {ubo.passportExpiry}
            {passportExpired && ' (EXPIRED)'}
            {!passportExpired && passportSoon && ' (SOON)'}
          </div>
        </div>
      </div>

      <div className="merchant-card__field" style={{ marginTop: '4px' }}>
        <div className="merchant-card__label">Website</div>
        <div className="merchant-card__value" style={{ color: 'var(--neon-cyan)', fontSize: '13px' }}>
          {company.website}
        </div>
      </div>
    </div>
  );
}
