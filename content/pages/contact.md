# Contact

Have a project in mind or just want to say hello? Send a note below — I read every message.

<form class="contact-form" action="https://formspree.io/olga.moreira@omopenskies.org" method="POST">
  <div class="field">
    <label for="c-name">Your Name</label>
    <input type="text" id="c-name" name="name" placeholder="Jane Doe" required />
  </div>

  <div class="field">
    <label for="c-email">Email Address</label>
    <input type="email" id="c-email" name="email" placeholder="jane@example.com" required />
  </div>

  <div class="field">
    <label for="c-subject">Subject</label>
    <input type="text" id="c-subject" name="subject" placeholder="How can we collaborate?" />
  </div>

  <div class="field">
    <label for="c-message">Message</label>
    <textarea id="c-message" name="message" rows="6" placeholder="Write your message…" required></textarea>
  </div>

  <!-- Honeypot anti‑spam -->
  <div class="field hp" aria-hidden="true">
    <label for="c-company">Company</label>
    <input type="text" id="c-company" name="company" tabindex="-1" autocomplete="off" />
  </div>

  <button type="submit" class="contact-btn">Send Message</button>
  <input type="hidden" name="_subject" value="Website contact form" />
  <p class="contact-note">Powered by Formspree. You may receive a verification email on first submission.</p>
</form>
