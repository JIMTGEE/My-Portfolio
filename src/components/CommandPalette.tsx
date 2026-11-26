"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Home,
  User,
  Layers,
  Wrench,
  FolderGit2,
  Github,
  BrainCircuit,
  Milestone,
  Mail,
  Search,
  ArrowUpRight,
} from "lucide-react";
import { projects } from "@/data/projects";

const destinations = [
  { id: "top", label: "Home", href: "/#top", icon: Home },
  { id: "about", label: "About", href: "/#about", icon: User },
  { id: "expertise", label: "Expertise", href: "/#expertise", icon: Layers },
  { id: "services", label: "Services", href: "/#services", icon: Wrench },
  { id: "projects", label: "Projects", href: "/#projects", icon: FolderGit2 },
  { id: "github", label: "GitHub", href: "/#github", icon: Github },
  { id: "ai", label: "AI & ML", href: "/#ai", icon: BrainCircuit },
  { id: "journey", label: "Journey", href: "/#journey", icon: Milestone },
  { id: "contact", label: "Contact", href: "/#contact", icon: Mail },
];

/**
 * Global ⌘K / Ctrl+K command palette — jump to any section, or straight to
 * a project's case study, without touching the nav or scrolling by hand.
 * Built on cmdk (the same headless primitive most of the sites this brief
 * cites — Linear, Vercel — actually use for theirs), not a from-scratch
 * modal, so fuzzy filtering, roving focus and the dialog's a11y semantics
 * come for free.
 *
 * Opens on the keyboard shortcut from anywhere on the page, and also on a
 * "command-palette:open" window event — the one other place that fires it
 * is the small "⌘K" affordance in Nav.tsx, so there's exactly one place
 * that owns open/close state and nothing else needs its own copy of it.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onExternalOpen = () => setOpen(true);

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("command-palette:open", onExternalOpen);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("command-palette:open", onExternalOpen);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    if (href.startsWith("/#")) {
      // Let SmoothScroll's native-smooth-scroll anchor handler do the work
      // (and the 72px header offset it already accounts for) rather than a
      // second, competing scroll implementation here.
      const id = href.slice(2);
      if (location.pathname !== "/") {
        router.push(href);
        return;
      }
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    } else {
      router.push(href);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center bg-ink-950/70 px-4 pt-[14vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <Command
        shouldFilter
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-mist-500/15 bg-ink-900 shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
        label="Command palette"
      >
        <div className="flex items-center gap-3 border-b border-mist-500/10 px-4 py-3.5">
          <Search size={16} className="shrink-0 text-mist-500" />
          <Command.Input
            autoFocus
            placeholder="Jump to a section or project…"
            className="w-full bg-transparent text-sm text-mist-100 outline-none placeholder:text-mist-500"
          />
          <kbd className="shrink-0 rounded border border-mist-500/20 px-1.5 py-0.5 font-mono text-[10px] text-mist-500">
            esc
          </kbd>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-mist-500">
            Nothing matches that.
          </Command.Empty>

          <Command.Group
            heading="Go to"
            className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-mist-500 [&_[cmdk-group-items]]:mt-1"
          >
            {destinations.map((d) => (
              <Command.Item
                key={d.id}
                value={d.label}
                onSelect={() => go(d.href)}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm normal-case text-mist-200 aria-selected:bg-accent/15 aria-selected:text-mist-100"
              >
                <d.icon size={15} className="shrink-0 text-mist-500" />
                {d.label}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group
            heading="Projects"
            className="mt-1 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-mist-500 [&_[cmdk-group-items]]:mt-1"
          >
            {projects.map((p) => (
              <Command.Item
                key={p.slug}
                value={`${p.name} ${p.category}`}
                onSelect={() => go(`/projects/${p.slug}`)}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm normal-case text-mist-200 aria-selected:bg-accent/15 aria-selected:text-mist-100"
              >
                <span className="flex items-center gap-3">
                  <FolderGit2 size={15} className="shrink-0 text-mist-500" />
                  {p.name}
                </span>
                <ArrowUpRight size={13} className="shrink-0 text-mist-500" />
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
