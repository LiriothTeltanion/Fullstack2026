import Directory from "./features/directory/Directory.jsx";

export default function App() {
  return (
    <main>
      <h1>User posts</h1>
      <p className="muted">Each user's posts are fetched once and then read from the store.</p>
      <Directory />
    </main>
  );
}
