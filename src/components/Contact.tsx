"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Mail, Github, Linkedin, MessageCircle, MapPin, CheckCircle2 } from "lucide-react";
import { profile } from "@/data/profile";
import { sendContactMessage, type ContactState } from "@/app/actions/contact";
import { SectionHeading } from "./SectionHeading";
import { RevealOnScroll } from "./RevealOnScroll";

const initialState: ContactState = { status: "idle" };

const channels = [
  {
    key: "email",
    icon: Mail,
    label: "Email",
    value: profile.socials.email,
    href: profile.socials.email ? `mailto:${profile.socials.email}` : undefined,
  },
  {
    key: "linkedin",
    icon: Linkedin,
    label: "LinkedIn",
    value: profile.socials.linkedin ? "Connect on LinkedIn" : "",
    href: profile.socials.linkedin || undefined,
  },
  {
    key: "github",
    icon: Github,
    label: "GitHub",
    value: `github.com/${profile.githubUsername}`,
    href: profile.socials.github,
  },
  {
    key: "whatsapp",
    icon: MessageCircle,
    label: "WhatsApp",
    value: profile.socials.whatsapp,
    href: profile.socials.whatsapp
      ? `https://wa.me/${profile.socials.whatsapp.replace(/\D/g, "")}`
      : undefined,
  },
].filter((c) => c.value);

export function Contact() {
  const [state, formAction] = useFormState(sendContactMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  const mailtoFallback = profile.socials.email
    ? `mailto:${profile.socials.email}`
    : undefined;

  return (
    <section id="contact" className="relative py-24 sm:py-28">
      <div className="container-page">
        <SectionHeading
          kicker="Contact"
          heading="Let's work together"
          description="Open to freelance work, collaboration, and conversations about technology, AI, or the next thing to build."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <RevealOnScroll className="space-y-4">
            <div className="glass-panel flex items-start gap-3 rounded-2xl p-5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-accent-soft" />
              <div>
                <p className="text-sm font-semibold text-mist-100">
                  {profile.location}
                </p>
                <p className="mt-1 text-xs text-mist-400">
                  Working with clients wherever they are.
                </p>
              </div>
            </div>

            {channels.map((c) => (
              <a
                key={c.key}
                href={c.href}
                target={c.key === "email" ? undefined : "_blank"}
                rel={c.key === "email" ? undefined : "noreferrer"}
                className="focus-ring glass-panel flex items-center gap-3 rounded-2xl p-5 transition hover:border-accent/30"
              >
                <c.icon size={16} className="shrink-0 text-accent-soft" />
                <div>
                  <p className="text-sm font-semibold text-mist-100">
                    {c.label}
                  </p>
                  <p className="mt-0.5 text-xs text-mist-400">{c.value}</p>
                </div>
              </a>
            ))}

            {channels.length <= 1 && (
              <p className="text-xs text-mist-500">
                More contact channels (LinkedIn, WhatsApp) go here once
                you share them — see src/data/profile.ts.
              </p>
            )}
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            {state.status === "success" ? (
              <div className="glass-panel flex flex-col items-start gap-3 rounded-2xl p-8 sm:flex-row sm:items-center">
                <CheckCircle2 size={22} className="shrink-0 text-signal-green" />
                <div>
                  <p className="text-sm font-semibold text-mist-100">
                    Message sent — thanks for reaching out.
                  </p>
                  <p className="mt-1 text-sm text-mist-400">
                    I&apos;ll get back to you as soon as I can.
                  </p>
                </div>
              </div>
            ) : (
              <form ref={formRef} action={formAction} className="space-y-5">
                {/* Honeypot — hidden from real visitors via CSS, not type=hidden,
                    since some bots skip hidden inputs but still fill visible-looking ones. */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    id="name"
                    name="name"
                    label="Name"
                    error={state.fieldErrors?.name}
                  />
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    error={state.fieldErrors?.email}
                  />
                </div>
                <Field
                  id="subject"
                  name="subject"
                  label="What are you building?"
                  placeholder="e.g. School management system"
                  error={state.fieldErrors?.subject}
                />
                <Field
                  id="message"
                  name="message"
                  label="Message"
                  textarea
                  error={state.fieldErrors?.message}
                />

                {(state.status === "error" || state.status === "not_configured") && (
                  <p className="text-sm text-accent-soft">
                    {state.message}
                    {state.status === "not_configured" && mailtoFallback && (
                      <>
                        {" "}
                        <a href={mailtoFallback} className="focus-ring underline underline-offset-2">
                          Email me directly
                        </a>
                        .
                      </>
                    )}
                  </p>
                )}

                <SubmitButton />
              </form>
            )}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  textarea = false,
  placeholder,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
  error?: string;
}) {
  const baseClass =
    "focus-ring w-full rounded-xl border border-mist-500/15 bg-ink-900/50 px-4 py-3 text-sm text-mist-100 placeholder:text-mist-500 transition focus:border-accent/40";

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-mist-200">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`mt-2 resize-none ${baseClass}`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`mt-2 ${baseClass}`}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-[#ff7a7a]">
          {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}
