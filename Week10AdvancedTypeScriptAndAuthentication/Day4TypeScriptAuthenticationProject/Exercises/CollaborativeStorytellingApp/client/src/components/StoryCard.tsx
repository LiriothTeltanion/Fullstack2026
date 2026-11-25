import { useState, type FormEvent } from "react";
import type { Story, User } from "../types";
import StoryComments from "./StoryComments";
import { AppLink } from "../navigation";

interface StoryCardProps {
  story: Story;
  currentUser: User;
  detailView?: boolean;
  onEdit?: (id: number) => void;
  onSave: (id: number, changes: { title: string; content: string }) => Promise<void | boolean>;
  onDelete: (id: number) => Promise<void | boolean>;
  onRemoveContributor: (id: number) => Promise<void | boolean>;
  onAddContributor: (id: number, username: string) => Promise<void | boolean>;
}

export default function StoryCard({
  story,
  currentUser,
  detailView = false,
  onEdit,
  onSave,
  onDelete,
  onAddContributor,
  onRemoveContributor,
}: StoryCardProps) {
  const isAuthor = story.author.id === currentUser.id;
  const canEdit = isAuthor || story.contributors.some(user => user.id === currentUser.id);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(story.title);
  const [content, setContent] = useState(story.content);
  const [newContributor, setNewContributor] = useState("");

  const startEditing = () => {
    if (onEdit) {
      onEdit(story.id);
      return;
    }
    setTitle(story.title); // start from the latest saved version
    setContent(story.content);
    setEditing(true);
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const saved = await onSave(story.id, { title, content });
    if (saved !== false) setEditing(false);
  };

  const invite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newContributor.trim()) return;
    const invited = await onAddContributor(story.id, newContributor.trim());
    if (invited !== false) setNewContributor("");
  };

  return (
    <article className="card">
      {editing ? (
        <form className="stack" onSubmit={save}>
          <input
            value={title}
            onChange={event => setTitle(event.target.value)}
            aria-label="Title"
          />
          <textarea
            value={content}
            onChange={event => setContent(event.target.value)}
            aria-label="Story text"
          />
          <div className="row">
            <button type="submit">Save</button>
            <button type="button" className="secondary" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h2>
            {detailView ? (
              story.title
            ) : (
              <AppLink href={`/stories/${story.id}`}>{story.title}</AppLink>
            )}
          </h2>
          <p className="muted">
            by {story.author.username}
            {story.contributors.length > 0 &&
              ` with ${story.contributors.map(user => user.username).join(", ")}`}{" "}
            - updated {new Date(story.updatedAt).toLocaleString()}
          </p>
          <p className="story-content">{story.content}</p>
          <div className="row">
            {canEdit && <button onClick={startEditing}>Continue the story</button>}
            {isAuthor && (
              <button
                className="danger"
                onClick={() => window.confirm("Delete this story?") && onDelete(story.id)}
              >
                Delete
              </button>
            )}
          </div>
        </>
      )}
      {isAuthor && !editing && story.contributors.length > 0 && (
        <ul className="plain">
          {story.contributors.map(user => (
            <li key={user.id}>
              {user.username}{" "}
              {user.contributionId !== undefined && (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => onRemoveContributor(user.contributionId!)}
                >
                  Remove contributor
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {isAuthor && !editing && (
        <form className="row" onSubmit={invite} style={{ marginTop: 12 }}>
          <input
            value={newContributor}
            onChange={event => setNewContributor(event.target.value)}
            placeholder="Username to invite"
            aria-label="Contributor username"
          />
          <button type="submit" className="secondary">
            Add contributor
          </button>
        </form>
      )}
      {detailView && <StoryComments key={story.id} storyId={story.id} />}
    </article>
  );
}
