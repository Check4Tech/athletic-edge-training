const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const year = document.getElementById("year");
const toTop = document.querySelector(".to-top");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (toggle && header) {
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  header.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function inboxAddress() {
  const encoded = ["dGhlY29hY2hiZW50bGV5", "QGdtYWlsLmNvbQ=="].join("");
  return atob(encoded);
}

const mail = inboxAddress();
const contactEmail = document.getElementById("contact-email");
const footerEmail = document.getElementById("footer-email");

if (contactEmail) {
  contactEmail.href = `mailto:${mail}`;
  contactEmail.textContent = mail;
}

if (footerEmail) {
  footerEmail.href = `mailto:${mail}`;
  footerEmail.setAttribute("aria-label", `Email ${mail}`);
}

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const openedAt = Date.now();

if (form && status) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const honey = form.querySelector('input[name="company"]');
    if (honey && honey.value.trim() !== "") {
      status.hidden = false;
      status.textContent = "Thanks — we have your note.";
      form.reset();
      return;
    }

    if (Date.now() - openedAt < 1200) {
      status.hidden = false;
      status.textContent = "Please wait a moment and try again.";
      return;
    }

    const field = (key) => {
      const el = form.elements.namedItem(key);
      return el && "value" in el ? String(el.value).trim() : "";
    };

    const payload = {
      name: field("name"),
      email: field("email"),
      phone: field("phone"),
      child_name_and_age: field("child"),
      sport: field("sport"),
      interest: field("interest"),
      message: field("message"),
      how_did_you_hear: field("referral"),
      _subject: "Athletic Edge Training website message",
      _template: "table",
      _captcha: "false",
    };

    if (!payload.name || !payload.email || !payload.phone || !payload.interest || !payload.message) {
      status.hidden = false;
      status.textContent =
        "Please fill out name, email, phone, interest, and message.";
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = true;
    }
    status.hidden = false;
    status.textContent = "Sending…";

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(mail)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("send failed");
      }

      status.textContent =
        "Thanks — your message was sent. Check your inbox if FormSubmit asks you to confirm the first delivery.";
      form.reset();
    } catch (error) {
      status.textContent =
        "We couldn't send that just now. Email Coach Bentley directly from the contact section.";
    } finally {
      if (button) {
        button.disabled = false;
      }
    }
  });
}

if (toTop) {
  const toggleToTop = () => {
    toTop.classList.toggle("is-visible", window.scrollY > 280);
  };

  toggleToTop();
  window.addEventListener("scroll", toggleToTop, { passive: true });

  toTop.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
