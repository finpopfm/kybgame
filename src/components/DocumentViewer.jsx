import { useState } from 'react';

const TABS = [
  { id: 'incorporation', label: 'Incorporation' },
  { id: 'tax', label: 'Tax ID' },
  { id: 'funds', label: 'Source of Funds' },
  { id: 'ubo', label: 'UBO Details' },
];

export default function DocumentViewer({ merchant }) {
  const [activeTab, setActiveTab] = useState('incorporation');
  const { documents, ubo, company } = merchant;

  const renderContent = () => {
    switch (activeTab) {
      case 'incorporation':
        return (
          <div className="doc-viewer__content" key="inc">
            <div className="doc-viewer__section">
              <div className="doc-viewer__section-title">Certificate of Incorporation</div>
              <div className="doc-viewer__row">
                <span className="doc-viewer__row-label">Status</span>
                <span className={`doc-viewer__row-value ${documents.incorporation.status !== 'valid' ? 'doc-viewer__row-value--suspicious' : ''}`}>
                  {documents.incorporation.status.toUpperCase()}
                </span>
              </div>
              <div className="doc-viewer__row">
                <span className="doc-viewer__row-label">Registration No.</span>
                <span className="doc-viewer__row-value">{documents.incorporation.number}</span>
              </div>
              <div className="doc-viewer__row">
                <span className="doc-viewer__row-label">Issue Date</span>
                <span className="doc-viewer__row-value">{documents.incorporation.issueDate}</span>
              </div>
              <div className="doc-viewer__row">
                <span className="doc-viewer__row-label">Company Name</span>
                <span className="doc-viewer__row-value">{company.name}</span>
              </div>
              <div className="doc-viewer__row">
                <span className="doc-viewer__row-label">Jurisdiction</span>
                <span className="doc-viewer__row-value">{company.country}</span>
              </div>
            </div>
          </div>
        );

      case 'tax':
        return (
          <div className="doc-viewer__content" key="tax">
            <div className="doc-viewer__section">
              <div className="doc-viewer__section-title">Tax Identification</div>
              <div className="doc-viewer__row">
                <span className="doc-viewer__row-label">Tax ID</span>
                <span className={`doc-viewer__row-value ${documents.taxId.status !== 'valid' ? 'doc-viewer__row-value--suspicious' : ''}`}>
                  {documents.taxId.number}
                </span>
              </div>
              <div className="doc-viewer__row">
                <span className="doc-viewer__row-label">Status</span>
                <span className={`doc-viewer__row-value ${documents.taxId.status !== 'valid' ? 'doc-viewer__row-value--suspicious' : ''}`}>
                  {documents.taxId.status.toUpperCase()}
                </span>
              </div>
              <div className="doc-viewer__row">
                <span className="doc-viewer__row-label">Jurisdiction</span>
                <span className="doc-viewer__row-value">{company.country}</span>
              </div>
            </div>
          </div>
        );

      case 'funds':
        return (
          <div className="doc-viewer__content" key="funds">
            <div className="doc-viewer__section">
              <div className="doc-viewer__section-title">Source of Funds Declaration</div>
              <div className="doc-viewer__row">
                <span className="doc-viewer__row-label">Declared Source</span>
                <span className="doc-viewer__row-value">{documents.sourceOfFunds}</span>
              </div>
              <div className="doc-viewer__row">
                <span className="doc-viewer__row-label">Verification</span>
                <span className={`doc-viewer__row-value ${
                  documents.sourceOfFunds.toLowerCase().includes('unverif') ||
                  documents.sourceOfFunds.toLowerCase().includes('self-declared') ||
                  documents.sourceOfFunds.toLowerCase().includes('unspecified')
                    ? 'doc-viewer__row-value--suspicious'
                    : ''
                }`}>
                  {documents.sourceOfFunds.toLowerCase().includes('unverif') ||
                   documents.sourceOfFunds.toLowerCase().includes('self-declared') ||
                   documents.sourceOfFunds.toLowerCase().includes('unspecified')
                    ? 'NOT VERIFIED'
                    : documents.sourceOfFunds.toLowerCase().includes('crypto') && !documents.sourceOfFunds.toLowerCase().includes('verified')
                      ? 'REQUIRES VERIFICATION'
                      : 'DECLARED'}
                </span>
              </div>
            </div>
          </div>
        );

      case 'ubo':
        return (
          <div className="doc-viewer__content" key="ubo">
            <div className="doc-viewer__section">
              <div className="doc-viewer__section-title">Ultimate Beneficial Owner</div>
              <div className="doc-viewer__row">
                <span className="doc-viewer__row-label">Full Name</span>
                <span className="doc-viewer__row-value">{ubo.name}</span>
              </div>
              <div className="doc-viewer__row">
                <span className="doc-viewer__row-label">Nationality</span>
                <span className="doc-viewer__row-value">{ubo.nationality}</span>
              </div>
              <div className="doc-viewer__row">
                <span className="doc-viewer__row-label">Ownership Stake</span>
                <span className={`doc-viewer__row-value ${parseInt(ubo.ownership) < 25 ? 'doc-viewer__row-value--suspicious' : ''}`}>
                  {ubo.ownership}
                </span>
              </div>
              <div className="doc-viewer__row">
                <span className="doc-viewer__row-label">Passport Expiry</span>
                <span className={`doc-viewer__row-value ${
                  new Date(ubo.passportExpiry) < new Date('2026-02-08') ? 'doc-viewer__row-value--suspicious' : ''
                }`}>
                  {ubo.passportExpiry}
                </span>
              </div>
              <div className="doc-viewer__row">
                <span className="doc-viewer__row-label">Control Threshold</span>
                <span className={`doc-viewer__row-value ${parseInt(ubo.ownership) < 25 ? 'doc-viewer__row-value--suspicious' : ''}`}>
                  {parseInt(ubo.ownership) >= 25 ? 'MEETS 25% THRESHOLD' : 'BELOW 25% THRESHOLD ⚠'}
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="doc-viewer">
      <div className="doc-viewer__tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`doc-viewer__tab ${activeTab === tab.id ? 'doc-viewer__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
}
