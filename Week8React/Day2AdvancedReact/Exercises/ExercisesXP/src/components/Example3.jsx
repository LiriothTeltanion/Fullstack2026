import data from "../data/complexData.json";

function Example3() {
  return (
    <div>
      <h3>Experiences</h3>
      {data.Experiences.map(job => (
        <div key={job.companyName} className="job">
          <img src={job.logo} alt={`${job.companyName} logo`} width="60" />
          <div>
            <a href={job.url}>{job.companyName}</a>
            {job.roles.map(role => (
              <div key={role.title}>
                <p>
                  <strong>{role.title}</strong> · {role.startDate} to {role.endDate} ·{" "}
                  {role.location}
                </p>
                <p className="muted">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Example3;
