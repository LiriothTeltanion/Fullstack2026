// No state yet (that is Day 5): the form reads its fields with FormData on submit.
export default function Contact() {
  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    alert(`Thanks ${data.get("name")}, I will write to ${data.get("email")} soon.`);
    event.target.reset();
  }

  return (
    <section id="contact" className="section">
      <h2>Contact</h2>
      <form className="contact" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="4" />
        <button className="button" type="submit">
          Send
        </button>
      </form>
    </section>
  );
}
