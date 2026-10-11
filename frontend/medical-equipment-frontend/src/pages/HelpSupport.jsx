
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HelpSupport.css";

const faqs = [
  {
    question: "How do I add new equipment?",
    answer:
      "Open Add Equipment from the dashboard, enter the equipment details, and submit the form. The record should appear in the inventory list after it is saved successfully.",
  },
  {
    question: "How do I edit equipment information?",
    answer:
      "Find the equipment in your inventory and select its Edit action. Update the required fields and save your changes.",
  },
  {
    question: "How do I delete an equipment record?",
    answer:
      "Use the Delete action for the relevant equipment and confirm the operation if prompted. Refresh the list if the latest record is not immediately visible.",
  },
  {
    question: "Where can I check equipment maintenance?",
    answer:
      "Open the Maintenance page from the application navigation to review the maintenance information available in your system.",
  },
  {
    question: "What should I do if equipment data does not load?",
    answer:
      "Check that the frontend is running, the Express backend is running on port 5000, and the MySQL connection is successful. Then refresh the page.",
  },
  {
    question: "Are Settings notifications sent automatically?",
    answer:
      "The preference switches control the saved settings in this interface. Actual email, mobile push, and two-factor authentication require separate backend integration.",
  },
];

export default function HelpSupport() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const filteredFaqs = faqs.filter((faq) =>
    `${faq.question} ${faq.answer}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="help-page">
      <header className="help-header">
        <div>
          <span className="help-kicker">SUPPORT CENTRE</span>
          <h1>Help &amp; Support</h1>
          <p>Find guidance for managing your medical equipment inventory.</p>
        </div>
        <button className="help-back" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </button>
      </header>

      <section className="help-welcome">
        <div className="help-welcome-icon">?</div>
        <div>
          <h2>How can we help you?</h2>
          <p>
            Browse common questions or search for guidance on equipment,
            maintenance, reports, and application troubleshooting.
          </p>
          <input
            type="search"
            placeholder="Search help articles..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search help articles"
          />
        </div>
      </section>

      <section className="help-quick-grid">
        <article className="help-quick-card">
          <span>▤</span>
          <h3>Equipment Inventory</h3>
          <p>Learn how to add, view, edit, and remove equipment records.</p>
          <button onClick={() => navigate("/")}>Open Dashboard →</button>
        </article>
        <article className="help-quick-card">
          <span>⚙</span>
          <h3>Maintenance</h3>
          <p>Review equipment maintenance information and status.</p>
          <button onClick={() => navigate("/maintenance")}>
            Open Maintenance →
          </button>
        </article>
        <article className="help-quick-card">
          <span>▥</span>
          <h3>Reports</h3>
          <p>Visit the reports section to review available inventory reports.</p>
          <button onClick={() => navigate("/reports")}>Open Reports →</button>
        </article>
      </section>

      <section className="help-faq-section">
        <div className="help-section-heading">
          <div>
            <h2>Frequently Asked Questions</h2>
            <p>Answers to common application questions.</p>
          </div>
          <span>{filteredFaqs.length} articles</span>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="help-empty">
            No matching articles. Try searching for equipment, reports, or data.
          </div>
        ) : (
          filteredFaqs.map((faq, index) => (
            <article className="help-faq" key={faq.question}>
              <button
                className="help-faq-question"
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                aria-expanded={openFaq === index}
              >
                <span>{faq.question}</span>
                <span>{openFaq === index ? "−" : "+"}</span>
              </button>
              {openFaq === index && (
                <p className="help-faq-answer">{faq.answer}</p>
              )}
            </article>
          ))
        )}
      </section>

      <section className="help-contact">
        <div>
          <h2>Still need help?</h2>
          <p>
            If a feature is not working, note the error message and check that
            the frontend, backend, and database are running.
          </p>
        </div>
        <button onClick={() => navigate("/settings")}>Open Settings →</button>
      </section>

      <p className="help-footer">
        Medical Equipment Management System · Help Centre
      </p>
    </main>
  );
}
