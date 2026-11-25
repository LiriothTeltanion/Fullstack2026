import UserData from "./features/users/UserData.jsx";
import PostsList from "./features/posts/PostsList.jsx";

export default function App() {
  return (
    <main>
      <h1>Posts from JSONPlaceholder</h1>
      <UserData />
      <PostsList />
    </main>
  );
}
