import React from "react";

const AmbulanceIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true" width="24" height="24">
    <path
      d="M10 18h28c3.3 0 6 2.7 6 6v2h6.6c2.1 0 4.1 1.1 5.2 2.9l4.2 6.8V46c0 2.2-1.8 4-4 4h-2.4a8 8 0 0 1-15.2 0H25.6a8 8 0 0 1-15.2 0H8c-2.2 0-4-1.8-4-4V24c0-3.3 2.7-6 6-6Zm6 32a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm30 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 24v8h6v6h6v-6h6v-8h-6v-6h-6v6h-6Zm29 8h8.7l-2.5-4H46v4Z"
      fill="currentColor"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#111827" />
  </svg>
);

const footerCSS = `
  .mdc-footer {
    background: #f0f4f8;
    margin-top: auto;
  }

  .mdc-footer__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 44px 28px 36px;
  }

  .mdc-footer__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 36px;
  }

  .mdc-footer__brand-icon {
    width: 40px;
    height: 40px;
    background: #111827;
    color: #fff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .mdc-footer__brand-name {
    font-size: 22px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.3px;
  }

  .mdc-footer__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 36px;
  }

  .mdc-footer__col-heading {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 14px 0;
    padding-bottom: 10px;
    border-bottom: 2px solid #06b6d4;
  }

  .mdc-footer__contact-line {
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
    margin: 0 0 10px 0;
  }

  .mdc-footer__contact-email {
    display: inline-block;
    color: #06b6d4;
    text-decoration: none;
    font-size: 14px;
  }

  .mdc-footer__contact-email:hover {
    text-decoration: underline;
  }

  .mdc-footer__social {
    display: flex;
    gap: 10px;
    margin-top: 18px;
  }

  .mdc-footer__social-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #111827;
    color: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.18s;
    text-decoration: none;
  }

  .mdc-footer__social-btn:hover {
    background: #374151;
  }

  .mdc-footer__link-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .mdc-footer__link-list li {
    margin-bottom: 12px;
  }

  .mdc-footer__link-btn {
    background: none;
    border: none;
    padding: 0;
    font-size: 14px;
    color: #374151;
    cursor: pointer;
    text-align: left;
    transition: color 0.15s;
  }

  .mdc-footer__link-btn:hover {
    color: #06b6d4;
  }

  .mdc-footer__form-label {
    display: block;
    font-size: 13px;
    color: #374151;
    margin-bottom: 5px;
    margin-top: 14px;
  }

  .mdc-footer__form-label:first-of-type {
    margin-top: 0;
  }

  .mdc-footer__required {
    color: #ef4444;
    margin-left: 2px;
  }

  .mdc-footer__input {
    width: 100%;
    padding: 9px 13px;
    border: 2px solid #06b6d4;
    border-radius: 6px;
    background: #fff;
    color: #111827;
    outline: none;
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.15s;
  }

  .mdc-footer__input:focus {
    border-color: #0891b2;
  }

  .mdc-footer__textarea {
    width: 100%;
    padding: 9px 13px;
    border: 2px solid #06b6d4;
    border-radius: 6px;
    background: #fff;
    color: #111827;
    outline: none;
    font-size: 14px;
    box-sizing: border-box;
    resize: vertical;
    min-height: 78px;
    transition: border-color 0.15s;
  }

  .mdc-footer__textarea:focus {
    border-color: #0891b2;
  }

  .mdc-footer__form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .mdc-footer__submit {
    width: 100%;
    padding: 11px;
    background: #06b6d4;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    margin-top: 16px;
    transition: background 0.18s;
  }

  .mdc-footer__submit:hover {
    background: #0891b2;
  }

  .mdc-footer__bottom {
    border-top: 1px solid #cbd5e1;
    text-align: center;
    padding: 16px 28px;
    background: #f0f4f8;
  }

  .mdc-footer__bottom p {
    margin: 0;
    font-size: 14px;
    color: #374151;
  }

  @media (max-width: 1024px) {
    .mdc-footer__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 600px) {
    .mdc-footer__grid {
      grid-template-columns: 1fr;
    }

    .mdc-footer__form-row {
      grid-template-columns: 1fr;
    }

    .mdc-footer__inner {
      padding: 32px 16px 28px;
    }
  }
`;

function Footer({ onNavigate }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // data from e
    const formData = new FormData(e.target);
    console.log("FormData entries:", e.target);
    const data = Object.fromEntries(formData.entries());
    console.log("Feedback form submitted:", data);
    // Handle form submission logic here
  };
  return (
    <>
      <style>{footerCSS}</style>
      <footer className="mdc-footer">
        <div className="mdc-footer__inner">
          {/* Brand */}
          <div className="mdc-footer__brand">
            <div className="mdc-footer__brand-icon">
              <AmbulanceIcon />
            </div>
            <span className="mdc-footer__brand-name">MediCare</span>
          </div>

          <div className="mdc-footer__grid">
            {/* Contact Us */}
            <div>
              <h3 className="mdc-footer__col-heading">Contact Us:</h3>
              <p className="mdc-footer__contact-line">
                +977 9810101010
                <br />
                01-51416161
              </p>
              <p className="mdc-footer__contact-line">P.O. Box 11234</p>
              <p className="mdc-footer__contact-line">
                Naxal, Kathmandu, Nepal
              </p>
              <a
                href="mailto:info@medicarehospital.com"
                className="mdc-footer__contact-email"
              >
                info@medicarehospital.com
              </a>
              <div className="mdc-footer__social">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mdc-footer__social-btn"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://www.medicare.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mdc-footer__social-btn"
                  aria-label="Website"
                >
                  <GlobeIcon />
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mdc-footer__social-btn"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mdc-footer__social-btn"
                  aria-label="YouTube"
                >
                  <YoutubeIcon />
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="mdc-footer__col-heading">Services</h3>
              <ul className="mdc-footer__link-list">
                <li>
                  <button type="button" className="mdc-footer__link-btn">
                    Online Consultation
                  </button>
                </li>
                <li>
                  <button type="button" className="mdc-footer__link-btn">
                    Health Checkup
                  </button>
                </li>
                <li>
                  <button type="button" className="mdc-footer__link-btn">
                    Emergency Care
                  </button>
                </li>
                <li>
                  <button type="button" className="mdc-footer__link-btn">
                    Pharmacy
                  </button>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mdc-footer__col-heading">Quick Links</h3>
              <ul className="mdc-footer__link-list">
                <li>
                  <button
                    type="button"
                    className="mdc-footer__link-btn"
                    onClick={() => onNavigate?.("home")}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="mdc-footer__link-btn"
                    onClick={() => onNavigate?.("doctors")}
                  >
                    Doctors
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="mdc-footer__link-btn"
                    onClick={() => onNavigate?.("departments")}
                  >
                    Departments
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="mdc-footer__link-btn"
                    onClick={() => onNavigate?.("appointments")}
                  >
                    Book Appointment
                  </button>
                </li>
              </ul>
            </div>

            {/* Feedback Form */}
            <form onSubmit={(e) => handleSubmit(e)}>
              <h3 className="mdc-footer__col-heading">Feedback Form</h3>

              <label className="mdc-footer__form-label">
                Full Name<span className="mdc-footer__required">*</span>
              </label>
              <input type="text" className="mdc-footer__input" />

              <div className="mdc-footer__form-row">
                <div>
                  <label className="mdc-footer__form-label">
                    Phone Number<span className="mdc-footer__required">*</span>
                  </label>
                  <input type="tel" className="mdc-footer__input" />
                </div>
                <div>
                  <label className="mdc-footer__form-label">Email</label>
                  <input type="email" className="mdc-footer__input" />
                </div>
              </div>

              <label className="mdc-footer__form-label">
                Message<span className="mdc-footer__required">*</span>
              </label>
              <textarea className="mdc-footer__textarea" rows={3} />

              <button type="submit" className="mdc-footer__submit">
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mdc-footer__bottom">
          <p>
            &copy; {new Date().getFullYear()} MediCare. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
