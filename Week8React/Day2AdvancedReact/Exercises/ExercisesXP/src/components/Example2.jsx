import data from "../data/complexData.json";

function Example2() {
  return (
    <div>
      <h3>Skills</h3>
      {data.Skills.map(group => (
        <div key={group.Area}>
          <strong>{group.Area}</strong>
          <ul>
            {group.SkillSet.map(skill => (
              <li key={skill.Name}>
                {skill.Name} {skill.Hot && "🔥"}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Example2;
