
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import {
  Mail,
  Phone,
  MapPin,
  Code2,
  GraduationCap,
  FolderKanban,
  Download,
  ExternalLink,
  ArrowUpRight,
  BriefcaseBusiness,
} from "lucide-react";
import { db } from "./config/Firebase";
import "./index.css";

const initialData = {
  name: "Your Name",
  title: "Mathematics & Computer Science Student | Web Developer",
  summary:
    "I build responsive websites and practical digital solutions for businesses and individuals.",
  email: "",
  phone: "",
  location: "Kenya",
  github: "",
  linkedin: "",
  skills: ["JavaScript", "React", "Firebase", "HTML", "CSS"],
  education: [
    "BSc Mathematics and Computer Science",
    "Kenyatta University — Expected graduation 2028",
  ],
  projects: [],
};

function validLink(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol)
      ? url.href
      : "";
  } catch {
    return "";
  }
}

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase() || "CV";
}

export default function App() {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ref = doc(db, "portfolio", "main");

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ ...initialData, ...snapshot.data() });
        } else {
          setError(
            "Your portfolio has not been published yet. Save your details in the admin dashboard."
          );
        }
        setLoading(false);
      },
      () => {
        setError(
          "Unable to load your portfolio. Check your Firebase connection and Firestore read rules."
        );
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const skills = Array.isArray(data.skills) ? data.skills : [];
  const education = Array.isArray(data.education)
    ? data.education
    : [];
  const projects = Array.isArray(data.projects)
    ? data.projects
    : [];

  const githubUrl = validLink(data.github);
  const linkedinUrl = validLink(data.linkedin);
  const emailUrl = data.email.trim()
    ? `mailto:${data.email.trim()}`
    : "";
  const phoneUrl = data.phone.trim()
    ? `tel:${data.phone.trim().replace(/[^\d+]/g, "")}`
    : "";

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loader" />
        <p>Loading portfolio...</p>
      </main>
    );
  }

  return (
    <div className="site">
      <header className="navbar no-print">
        <a href="#home" className="logo">
          <span className="logo-icon"><Code2 size={23} /></span>
          <span>{data.name || "My Portfolio"}</span>
        </a>

        <nav>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#education">Education</a>
        </nav>

        <button className="nav-button" onClick={() => window.print()}>
          <Download size={17} />
          <span>Save CV</span>
        </button>
      </header>

      {error && (
        <div className="status-message" role="status">
          {error}
        </div>
      )}

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="availability">
              <span className="status-dot" />
              PORTFOLIO & CURRICULUM VITAE
            </div>
            <img
      src="/portfolioicon.png"
      alt="My profile photo"
      className="profile-photo"
    />

            <p className="eyebrow">HELLO, I'M</p>
            <h1>{data.name || "Your Name"}</h1>
            <h2>{data.title}</h2>

            <p className="hero-summary">
              {data.summary || "Welcome to my professional portfolio."}
            </p>

            <div className="hero-actions no-print">
              <a className="button-primary" href="#projects">
                Explore my work <ArrowUpRight size={18} />
              </a>
              <button className="button-outline" onClick={() => window.print()}>
                <Download size={18} /> Download CV
              </button>
            </div>

            <div className="hero-meta">
              {data.location && (
                <span><MapPin size={16} /> {data.location}</span>
              )}
              {data.email && (
                <a href={emailUrl}>
                  <Mail size={16} /> {data.email}
                </a>
              )}
            </div>

            <div className="social-links no-print">
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noreferrer">
                  <FaGithub size={20} /> GitHub
                </a>
              )}
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noreferrer">
                  <FaLinkedin size={20} /> LinkedIn
                </a>
              )}
            </div>
          </div>

          <div className="hero-visual" aria-label="Profile initials">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="profile-card">
              <div className="profile-avatar">
                {initials(data.name)}
              </div>
              <Code2 size={29} className="avatar-code" />
              <p>BUILD. LEARN. CREATE.</p>
              <span>Web development & technology</span>
            </div>
            <div className="floating-chip chip-top">
              <Code2 size={17} /> Developer
            </div>
            <div className="floating-chip chip-bottom">
              <BriefcaseBusiness size={17} /> Problem solver
            </div>
          </div>
        </section>

        <section className="stats-strip">
          <div>
            <strong>{skills.length}</strong>
            <span>Skills</span>
          </div>
          <div>
            <strong>{projects.length}</strong>
            <span>Projects</span>
          </div>
          <div>
            <strong>{education.length}</strong>
            <span>Education entries</span>
          </div>
        </section>

        <section className="content-section" id="about">
          <SectionTitle number="01" title="About me" />
          <div className="about-card">
            <div className="about-icon"><Code2 size={28} /></div>
            <div>
              <h3>Turning ideas into digital solutions.</h3>
              <p>{data.summary || "My professional introduction will appear here."}</p>
              <p>
                I enjoy building useful, responsive digital experiences
                and learning technologies that solve real-world problems.
              </p>
              <div className="contact-row no-print">
                {emailUrl && (
                  <a className="text-link" href={emailUrl}>
                    Contact me <ArrowUpRight size={16} />
                  </a>
                )}
                {phoneUrl && (
                  <a className="text-link" href={phoneUrl}>
                    <Phone size={16} /> Call me
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="content-section" id="skills">
          <SectionTitle number="02" title="Skills & technologies" />
          <p className="section-description">
            Tools and technologies I use to build digital products.
          </p>
          {skills.length > 0 ? (
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <div className="skill-card" key={`${skill}-${index}`}>
                  <span className="skill-icon"><Code2 size={21} /></span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">Skills will be added soon.</p>
          )}
        </section>

        <section className="content-section" id="projects">
          <SectionTitle number="03" title="Featured projects" />
          <p className="section-description">
            Selected projects, experiments and digital solutions.
          </p>

          {projects.length > 0 ? (
            <div className="projects-grid">
              {projects.map((project, index) => {
                const projectUrl = validLink(project.link);
                const techList = (project.tech || "")
                  .split(",")
                  .map((tech) => tech.trim())
                  .filter(Boolean);

                return (
                  <article className="project-card" key={index}>
                    <div className="project-top">
                      <div className="project-icon"><FolderKanban size={24} /></div>
                      <span className="project-number">
                        PROJECT {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3>{project.title || "Untitled project"}</h3>
                    <p>
                      {project.description || "Project details coming soon."}
                    </p>

                    {techList.length > 0 && (
                      <div className="tech-list">
                        {techList.map((tech, i) => (
                          <span key={`${tech}-${i}`}>{tech}</span>
                        ))}
                      </div>
                    )}

                    {projectUrl && (
                      <a
                        className="project-link"
                        href={projectUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View project <ExternalLink size={16} />
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <FolderKanban size={30} />
              <h3>Projects coming soon</h3>
              <p>Add your work through your private admin dashboard.</p>
            </div>
          )}
        </section>

        <section className="content-section" id="education">
          <SectionTitle number="04" title="Education" />
          <div className="education-list">
            {education.filter(Boolean).map((item, index) => (
              <div className="education-item" key={index}>
                <div className="education-icon"><GraduationCap size={23} /></div>
                <div>
                  <h3>{item}</h3>
                  <p>Education and professional development</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-section no-print">
          <p className="eyebrow">LET'S CONNECT</p>
          <h2>Have a project in mind?</h2>
          <p>Let's discuss how I can help bring your ideas to life.</p>
          {emailUrl ? (
            <a className="button-primary" href={emailUrl}>
              <Mail size={18} /> Get in touch
            </a>
          ) : (
            <p>Add your email address in the admin dashboard to enable contact.</p>
          )}
        </section>
      </main>

      <footer className="footer">
        <a href="#home" className="logo">
          <span className="logo-icon"><Code2 size={20} /></span>
          {data.name || "My Portfolio"}
        </a>
        <p>Designed and built with care.</p>
        <span>© {new Date().getFullYear()} {data.name || "Portfolio"}</span>
      </footer>
    </div>
  );
}

function SectionTitle({ number, title }) {
  return (
    <div className="section-title">
      <span>{number}</span>
      <h2>{title}</h2>
    </div>
  );
}
