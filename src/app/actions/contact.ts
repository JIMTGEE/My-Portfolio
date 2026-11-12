"use server";

import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(120),
  email: z.string().trim().email("Enter a valid email address."),
  subject: z.string().trim().min(2, "Let me know what you're building.").max(160),
  message: z.string().trim().min(10, "A few more words would help.").max(4000),
  // Honeypot: real visitors never fill this in (it's hidden). Bots often
  // auto-fill every field, so any non-empty value here is a strong bot
  // signal — checked separately below, not as a validation rule, so a
  // tripped honeypot doesn't surface as a confusing field error.
  company: z.string().optional(),
});

export type ContactState = {
  status: "idle" | "success" | "error" | "not_configured";
  message?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof ContactSchema>, string>>;
};

export async function sendContactMessage(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
    company: String(formData.get("company") ?? ""),
  };

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof fieldErrors;
      if (key) fieldErrors[key] = issue.message;
    }
    return { status: "error", fieldErrors, message: "Please fix the fields below." };
  }

  // Honeypot tripped — pretend it worked, do nothing.
  if (parsed.data.company) {
    return { status: "success" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !toEmail) {
    // Not a user-facing failure: the site owner hasn't wired up email
    // delivery yet. The UI falls back to a mailto link when it sees this.
    return {
      status: "not_configured",
      message:
        "The contact form isn't wired up to send email yet — use the email link below instead.",
    };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { name, email, subject, message } = parsed.data;

    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>",
      to: toEmail,
      replyTo: email,
      subject: `Portfolio enquiry: ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      return {
        status: "error",
        message: "Something went wrong sending that — try the email link below instead.",
      };
    }

    return { status: "success" };
  } catch {
    return {
      status: "error",
      message: "Something went wrong sending that — try the email link below instead.",
    };
  }
}
