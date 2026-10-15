import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Heart,
  HeartPulse,
  Leaf,
  MoveUpRight,
  PawPrint,
  Scissors,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import {
  BRAND,
  CARE_VALUES,
  FAQs,
  IMAGES,
  SERVICES,
  SERVICE_FILTERS,
  TEAM,
} from "../data/siteData.js";

const ICONS = {
  heart: HeartPulse,
  shield: ShieldCheck,
  scissors: Scissors,
  smile: Smile,
  leaf: Leaf,
  sparkle: Sparkles,
};

function SectionLabel({
  children,
  light = false,
}) {
  return (
    <span
      className={`pk-kicker ${
        light ? "pk-kicker-light" : ""
      }`}
    >
      <span className="pk-kicker-dot" />
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  light = false,
}) {
  return (
    <div
      className={`pk-section-heading ${
        light ? "is-light" : ""
      }`}
    >
      <SectionLabel light={light}>
        {eyebrow}
      </SectionLabel>

      <h2>
        {title}
        <br />
        <em>{accent}</em>
      </h2>

      {description && (
        <p>{description}</p>
      )}
    </div>
  );
}

function ServiceCard({
  service,
  index,
}) {
  const Icon =
    ICONS[service.icon] ||
    Heart;

  return (
    <article className="pk-service-card">
      <div className="pk-service-card-top">
        <span>
          {service.number} / CARE
        </span>

        <span className="pk-service-icon">
          <Icon size={23} />
        </span>
      </div>

      <div className="pk-service-card-body">
        <small>{service.category}</small>

        <h3>{service.title}</h3>

        <p>{service.description}</p>
      </div>

      <div className="pk-service-card-bottom">
        <span>
          {service.duration} · DEMO
        </span>

        <Link
          to={`/request?service=${service.id}`}
          aria-label={`Request ${service.title}`}
        >
          <ArrowUpRight size={21} />
        </Link>
      </div>
    </article>
  );
}

function TeamCard({
  member,
}) {
  return (
    <article className="pk-team-card">
      <div className="pk-team-card-art">
        <span className="pk-team-number">
          PROFILE / {member.number}
        </span>

        <div className="pk-team-orbit">
          <PawPrint size={30} />
        </div>

        <strong className="pk-team-initials">
          {member.initials}
        </strong>

        <span className="pk-team-art-footer">
          SAMPLE TEAM PROFILE
          <MoveUpRight size={15} />
        </span>
      </div>

      <div className="pk-team-card-body">
        <small>{member.role}</small>

        <h3>{member.name}</h3>

        <p>{member.focus}</p>

        <span>{member.bio}</span>
      </div>
    </article>
  );
}

function BottomCTA() {
  return (
    <section className="pk-cta-section">
      <div className="pk-container">
        <div className="pk-cta-panel">
          <div>
            <SectionLabel light>
              A KINDER NEXT STEP
            </SectionLabel>

            <h2>
              LITTLE PAWS.
              <br />
              <em>BIG LOVE.</em>
            </h2>

            <p>
              Explore what a thoughtful
              appointment experience could
              look like for your pet.
            </p>

            <Link
              to="/request"
              className="pk-button pk-button-coral"
            >
              Request a Demo Visit
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="pk-cta-illustration">
            <PawPrint size={150} />

            <span>
              WITH LOVE,
              <br />
              PAW & KIND.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ======================================
// HOME PAGE
// ======================================

export function HomePage() {
  return (
    <>
      <section className="pk-hero">
        <div className="pk-container pk-hero-grid">
          <div className="pk-hero-copy">
            <SectionLabel>
              FOR THE ONES WHO FEEL LIKE FAMILY
            </SectionLabel>

            <h1>
              A SOFTER
              <br />
              WAY TO
              <br />
              <em>CARE.</em>
            </h1>

            <p>
              Thoughtful pet wellness,
              gentle experiences, and
              plenty of heart. Because
              caring for your companion
              should feel as special as
              they are.
            </p>

            <div className="pk-hero-actions">
              <Link
                to="/request"
                className="pk-button pk-button-dark"
              >
                Request a Visit
                <ArrowUpRight size={19} />
              </Link>

              <Link
                to="/services"
                className="pk-button pk-button-outline"
              >
                Explore Our Care
                <ArrowRight size={19} />
              </Link>
            </div>

            <div className="pk-hero-proof">
              <div className="pk-proof-symbol">
                <Heart
                  size={21}
                  fill="currentColor"
                />
              </div>

              <div>
                <strong>
                  CALM CARE, FIRST.
                </strong>

                <span>
                  Pet-first thinking in
                  every detail.
                </span>
              </div>
            </div>
          </div>

          <div className="pk-hero-media">
            <div className="pk-hero-image">
              <img
                src={IMAGES.hero}
                alt="Friendly golden retriever looking toward the camera"
                fetchPriority="high"
              />
            </div>

            <div className="pk-hero-side-label">
              EVERY LITTLE HEART MATTERS
            </div>

            <div className="pk-hero-round-stamp">
              <PawPrint size={26} />

              <span>
                ALWAYS
                <br />
                WITH LOVE
              </span>
            </div>

            <div className="pk-hero-cat">
              <img
                src={IMAGES.secondary}
                alt="Relaxed cat"
                loading="lazy"
              />

              <span>
                FOR THE
                <br />
                LITTLE ONES.
              </span>
            </div>
          </div>
        </div>

        <div className="pk-hero-bottom">
          <div className="pk-container pk-hero-bottom-inner">
            <span>
              MADE FOR PETS. MADE WITH HEART.
            </span>

            <div>
              DISCOVER OUR APPROACH
              <ArrowDownRight size={21} />
            </div>
          </div>
        </div>
      </section>

      <section className="pk-intro-section">
        <div className="pk-container pk-intro-grid">
          <div>
            <SectionLabel>
              THE PAW & KIND. WAY
            </SectionLabel>

            <h2>
              THEY GIVE US
              <br />
              <em>EVERYTHING.</em>
            </h2>
          </div>

          <div>
            <p>
              The happy greetings.
              The quiet companionship.
              The unconditional love.
              We believe thoughtful care
              should give a little of
              that love right back.
            </p>

            <Link
              to="/about"
              className="pk-text-link"
            >
              Get to Know Us
              <ArrowUpRight size={19} />
            </Link>
          </div>
        </div>
      </section>

      <section className="pk-services-section pk-section-pad">
        <div className="pk-container">
          <div className="pk-section-heading-row">
            <SectionHeading
              eyebrow="CARE DESIGNED WITH HEART"
              title="EVERY NEED."
              accent="EVERY STAGE."
              description="A considered collection of wellness and everyday care pathways for your companion."
            />

            <Link
              to="/services"
              className="pk-text-link"
            >
              All Services
              <ArrowUpRight size={19} />
            </Link>
          </div>

          <div className="pk-services-grid">
            {SERVICES.slice(0, 3).map(
              (service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                />
              )
            )}
          </div>
        </div>
      </section>

      <section className="pk-story-feature">
        <div className="pk-story-media">
          <img
            src={IMAGES.care}
            alt="Dog receiving gentle care"
            loading="lazy"
          />

          <div className="pk-image-caption">
            <PawPrint size={18} />
            SMALL MOMENTS, BIG FEELINGS.
          </div>
        </div>

        <div className="pk-story-copy">
          <SectionLabel light>
            A BETTER KIND OF VISIT
          </SectionLabel>

          <h2>
            LESS WORRY.
            <br />
            MORE
            <br />
            <em>WAGGING.</em>
          </h2>

          <p>
            The best care experiences
            begin by making room for
            comfort, questions, and
            connection. Our concept
            puts that philosophy into
            every visit.
          </p>

          <div className="pk-story-points">
            <span>
              <Check size={17} />
              Comfort-led experience
            </span>

            <span>
              <Check size={17} />
              Clear care information
            </span>

            <span>
              <Check size={17} />
              Simple visit requests
            </span>
          </div>

          <Link
            to="/about"
            className="pk-button pk-button-light"
          >
            Our Approach
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      <section className="pk-feature-section pk-section-pad">
        <div className="pk-container">
          <SectionHeading
            eyebrow="OUR LITTLE PROMISE"
            title="THE KIND"
            accent="OF CARE."
          />

          <div className="pk-values-grid">
            {CARE_VALUES.map(
              (value) => (
                <article
                  className="pk-value-card"
                  key={value.number}
                >
                  <span>
                    {value.number}
                  </span>

                  <h3>
                    {value.title}
                  </h3>

                  <p>
                    {value.description}
                  </p>

                  <PawPrint
                    size={27}
                  />
                </article>
              )
            )}
          </div>
        </div>
      </section>

      <section className="pk-step-section pk-section-pad">
        <div className="pk-container pk-step-grid">
          <div>
            <SectionHeading
              eyebrow="SIMPLE BY DESIGN"
              title="GOOD CARE."
              accent="MADE EASY."
            />

            <p className="pk-section-aside">
              An appointment request
              experience that keeps the
              important things clear
              from the very beginning.
            </p>
          </div>

          <div className="pk-steps">
            {[
              {
                number: "01",
                title: "Explore care.",
                text:
                  "Find the service that fits your pet's needs.",
              },
              {
                number: "02",
                title: "Choose a time.",
                text:
                  "Select a preferred sample date and time.",
              },
              {
                number: "03",
                title: "Keep it handy.",
                text:
                  "Review your locally saved request in My Visits.",
              },
            ].map((step) => (
              <div
                className="pk-step"
                key={step.number}
              >
                <span>{step.number}</span>

                <div>
                  <h3>
                    {step.title}
                  </h3>

                  <p>
                    {step.text}
                  </p>
                </div>

                <ArrowUpRight
                  size={19}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <BottomCTA />
    </>
  );
}

// ======================================
// SERVICES PAGE
// ======================================

export function ServicesPage() {
  const [filter, setFilter] =
    useState("All Care");

  const visible = SERVICES.filter(
    (service) =>
      filter === "All Care" ||
      service.category === filter
  );

  return (
    <>
      <section className="pk-inner-hero">
        <div className="pk-container pk-inner-hero-grid">
          <div>
            <SectionLabel>
              PET WELLNESS, CONSIDERED
            </SectionLabel>

            <h1>
              CARE THAT
              <br />
              <em>GETS THEM.</em>
            </h1>

            <p>
              Every pet is wonderfully
              different. Explore care
              pathways designed for
              unique personalities,
              changing needs, and
              every stage of life.
            </p>
          </div>

          <div className="pk-inner-hero-media">
            <img
              src={IMAGES.puppy}
              alt="Adorable small dog"
            />
          </div>
        </div>
      </section>

      <section className="pk-section-pad">
        <div className="pk-container">
          <div className="pk-service-filters">
            {SERVICE_FILTERS.map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    filter === item
                      ? "is-active"
                      : ""
                  }
                  onClick={() =>
                    setFilter(item)
                  }
                >
                  {item}
                </button>
              )
            )}
          </div>

          <div className="pk-services-grid pk-all-services">
            {visible.map(
              (service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                />
              )
            )}
          </div>

          {visible.length === 0 && (
            <p>
              No services found in
              this category.
            </p>
          )}
        </div>
      </section>

      <section className="pk-service-details-section">
        <div className="pk-container">
          <SectionHeading
            eyebrow="WHAT TO EXPECT"
            title="THE LITTLE"
            accent="DETAILS."
            description="A closer look at what each sample care pathway includes."
          />

          <div className="pk-service-detail-list">
            {SERVICES.map(
              (service) => (
                <article
                  key={service.id}
                  className="pk-service-detail"
                >
                  <div className="pk-detail-number">
                    {service.number}
                  </div>

                  <div>
                    <small>
                      {service.category}
                    </small>

                    <h3>
                      {service.title}
                    </h3>

                    <p>
                      {service.tagline}
                    </p>
                  </div>

                  <ul>
                    {service.includes.map(
                      (item) => (
                        <li key={item}>
                          <CheckCircle2
                            size={16}
                          />

                          {item}
                        </li>
                      )
                    )}
                  </ul>

                  <Link
                    to={`/request?service=${service.id}`}
                    aria-label={`Request ${service.title}`}
                  >
                    <ArrowUpRight
                      size={22}
                    />
                  </Link>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      <BottomCTA />
    </>
  );
}

// ======================================
// TEAM PAGE
// ======================================

export function TeamPage() {
  return (
    <>
      <section className="pk-page-hero pk-team-page-hero">
        <div className="pk-container">
          <SectionLabel>
            MEET THE HEART BEHIND THE CARE
          </SectionLabel>

          <h1>
            GOOD PEOPLE.
            <br />
            <em>GOOD HEARTS.</em>
          </h1>

          <p>
            A sample team built around
            the values of patient care,
            gentle handling, and
            thoughtful conversations.
          </p>

          <div className="pk-demo-notice">
            <ShieldCheck size={18} />

            These team members are
            fictional placeholders for
            this website concept.
          </div>
        </div>
      </section>

      <section className="pk-section-pad">
        <div className="pk-container">
          <div className="pk-team-grid">
            {TEAM.map((member) => (
              <TeamCard
                key={member.id}
                member={member}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="pk-team-principle">
        <div className="pk-container pk-team-principle-grid">
          <div>
            <SectionLabel light>
              PEOPLE FIRST. PETS ALWAYS.
            </SectionLabel>

            <h2>
              KINDNESS
              <br />
              IS PART OF
              <br />
              <em>THE PRACTICE.</em>
            </h2>
          </div>

          <div>
            <p>
              A great veterinary
              experience is about more
              than a checklist. It is
              about patience, trust,
              attentive communication,
              and respect for every
              animal's comfort.
            </p>

            <Link
              to="/about"
              className="pk-button pk-button-light"
            >
              Discover Our Philosophy
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <BottomCTA />
    </>
  );
}

// ======================================
// ABOUT PAGE
// ======================================

export function AboutPage() {
  return (
    <>
      <section className="pk-inner-hero pk-about-hero">
        <div className="pk-container pk-inner-hero-grid">
          <div>
            <SectionLabel>
              OUR STORY
            </SectionLabel>

            <h1>
              MADE FOR
              <br />
              <em>MORE LOVE.</em>
            </h1>

            <p>
              A pet wellness concept
              created around a simple
              belief: thoughtful care
              should feel as warm as
              the companionship that
              makes it matter.
            </p>
          </div>

          <div className="pk-inner-hero-media">
            <img
              src={IMAGES.comfort}
              alt="Happy companion dog"
            />
          </div>
        </div>
      </section>

      <section className="pk-section-pad">
        <div className="pk-container pk-about-story">
          <div>
            <SectionLabel>
              THE IDEA BEHIND PAW & KIND.
            </SectionLabel>

            <h2>
              A NAME WITH
              <br />
              <em>A PURPOSE.</em>
            </h2>
          </div>

          <div>
            <p>
              PAW represents the
              companions who fill
              everyday life with joy.
            </p>

            <p>
              KIND represents the way
              their care should feel:
              calm, welcoming,
              compassionate, and
              thoughtfully designed.
            </p>

            <p>
              Together, they create a
              brand concept inspired
              by the lasting bond
              between pets and the
              people who love them.
            </p>
          </div>
        </div>
      </section>

      <section className="pk-about-photo-strip">
        <div>
          <img
            src={IMAGES.cat}
            alt="Curious cat"
            loading="lazy"
          />
        </div>

        <div>
          <img
            src={IMAGES.dog}
            alt="Happy dog"
            loading="lazy"
          />
        </div>

        <div>
          <img
            src={IMAGES.puppy}
            alt="Small companion dog"
            loading="lazy"
          />
        </div>
      </section>

      <section className="pk-section-pad">
        <div className="pk-container">
          <SectionHeading
            eyebrow="WHAT WE BELIEVE"
            title="LITTLE THINGS."
            accent="LASTING LOVE."
          />

          <div className="pk-values-grid">
            {CARE_VALUES.map(
              (item) => (
                <article
                  className="pk-value-card"
                  key={item.number}
                >
                  <span>
                    {item.number}
                  </span>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.description}
                  </p>

                  <PawPrint size={26} />
                </article>
              )
            )}
          </div>
        </div>
      </section>

      <section className="pk-faq-section pk-section-pad">
        <div className="pk-container pk-faq-grid">
          <div>
            <SectionHeading
              eyebrow="GOOD TO KNOW"
              title="CURIOUS?"
              accent="WE GET IT."
            />

            <p className="pk-faq-description">
              Here are a few useful
              details about how this
              website concept works.
            </p>
          </div>

          <div className="pk-faq-list">
            {FAQs.map((item, index) => (
              <details
                key={item.question}
                className="pk-faq-item"
              >
                <summary>
                  <span>
                    {String(index + 1)
                      .padStart(2, "0")}
                  </span>

                  <strong>
                    {item.question}
                  </strong>

                  <span className="pk-faq-plus">
                    +
                  </span>
                </summary>

                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <BottomCTA />
    </>
  );
}