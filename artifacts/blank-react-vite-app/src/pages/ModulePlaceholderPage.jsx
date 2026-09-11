import { ArrowLeft, Construction } from "lucide-react";
import { Link } from "react-router-dom";

import { DemoDataBadge } from "../components/common/Badges";

/**
 * Placeholder for modules that are navigable but not yet built.
 *
 * Exists so the sidebar never contains a dead link. It states plainly what the
 * module will do and what it depends on, rather than pretending to be a
 * working screen.
 */
function ModulePlaceholderPage({ title, description, planned = [], dependsOn }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <DemoDataBadge label="Not Yet Implemented" />
      </div>

      <section className="placeholder-panel">
        <div className="placeholder-icon" aria-hidden="true">
          <Construction size={30} />
        </div>

        <h3>Module planned for a later phase</h3>

        <p className="placeholder-lead">
          This screen is intentionally empty. The frontend route exists so
          navigation is complete, but the module has not been built and no
          placeholder figures are shown here.
        </p>

        {planned.length > 0 ? (
          <div className="placeholder-block">
            <h4>Planned capabilities</h4>
            <ul>
              {planned.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {dependsOn ? (
          <div className="placeholder-block">
            <h4>Depends on</h4>
            <p>{dependsOn}</p>
          </div>
        ) : null}

        <Link to="/commander" className="placeholder-back">
          <ArrowLeft size={15} aria-hidden="true" />
          Back to Command Overview
        </Link>
      </section>
    </>
  );
}

export default ModulePlaceholderPage;
