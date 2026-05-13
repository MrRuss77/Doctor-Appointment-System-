import React from "react";

const AmbulanceIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true" className="brand-icon">
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

function Footer({ onNavigate }) {
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    console.log("Feedback form submitted:", data);
    event.target.reset();
  };

  return (
    <footer className="mdc-footer">
      <div className="mdc-footer__inner">
        <div className="mdc-footer__brand">
          <span className="brand-icon-shell">
            <AmbulanceIcon />
          </span>

          <span className="mdc-footer__brand-name">MediCare</span>
        </div>

        <div className="mdc-footer__grid">
          <div>
            <h3 className="mdc-footer__col-heading">Contact Us:</h3>

            <p className="mdc-footer__contact-line">
              +977 9810101010
              <br />
              01-51416161
            </p>

            <p className="mdc-footer__contact-line">P.O. Box 11234</p>
            <p className="mdc-footer__contact-line">Naxal, Kathmandu, Nepal</p>

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
                  onClick={() => onNavigate?.("doctors")}
                >
                  Book Appointment
                </button>
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <h3 className="mdc-footer__col-heading">Feedback Form</h3>

            <label className="mdc-footer__form-label">
              Full Name<span className="mdc-footer__required">*</span>
            </label>
            <input name="fullName" type="text" className="mdc-footer__input" />

            <div className="mdc-footer__form-row">
              <div>
                <label className="mdc-footer__form-label">
                  Phone Number<span className="mdc-footer__required">*</span>
                </label>
                <input name="phone" type="tel" className="mdc-footer__input" />
              </div>

              <div>
                <label className="mdc-footer__form-label">Email</label>
                <input name="email" type="email" className="mdc-footer__input" />
              </div>
            </div>

            <label className="mdc-footer__form-label">
              Message<span className="mdc-footer__required">*</span>
            </label>
            <textarea name="message" className="mdc-footer__textarea" rows={3} />

            <button type="submit" className="mdc-footer__submit">
              Submit
            </button>
          </form>
        </div>
      </div>

      <div className="mdc-footer__bottom">
        <p>&copy; {new Date().getFullYear()} MediCare. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;