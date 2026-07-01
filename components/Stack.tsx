import "animate.css";

function Stack() {
  const skills = [
    "React",
    "Next.js",
    "TypeScript",
    "React Native",
    "GSAP",
    "Three.js",
    "Node.js",
  ];

  return (
    <div className="flex flex-col items-center my-10 gap-0 justify-center">
      {skills.map((skill: string, idx: number) => (
        <h1
          key={skill}
          className={`${idx % 2 === 0 ? "animate__fadeInRight" : "animate__fadeInLeft"} animate__animated  text-center font-bold text-6xl mb-20 font-orbitron text-[#f5a764]`}
        >
          {skill}
        </h1>
      ))}
    </div>
  );
}

export default Stack;
