import data from "../data/complexData.json";

function Example1() {
  return (
    <div>
      <h3>Social medias</h3>
      <ul>
        {data.SocialMedias.map(link => (
          <li key={link}>
            <a href={link}>{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Example1;
