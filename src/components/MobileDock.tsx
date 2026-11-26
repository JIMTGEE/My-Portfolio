"use client";

import { Home, FolderGit2, Layers, Github, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/lib/useActiveSection";

const items = [
  { id: "top", label: "Home", href: "/#top", icon: Home },
  { id: "expertise", label: "Skills", href: "/#expertise", icon: Layers },
  { id: "projects", label: "Work", href: "/#projects", icon: FolderGit2 },
  { id: "github", label: "GitHub", href: "/#github", icon: Github },
  { id: "contact", label: "Contact", href: "/#contact", icon: Mail },
];

const sectionIds = items.map((i) => i.id);

/**
 * Fixed bottom tab bar, phones only (hidden from `sm` up — Nav's own
 * top bar + hamburger menu already covers tablet and desktop). A premium
 * portfolio shouldn't make a visitor hunt through a hamburger menu for the
 * five things they're actually here to reach; this mirrors the native-app
 * pattern instead. Shares Nav's active-section logic (see
 * lib/useActiveSection) so the two never disagree about where you are.
 */
export function MobileDock() {
  const active = useActiveSection(sectionIds);

  return (
    <nav
      aria-label="Mobile tab bar"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-mist-500/10 bg-ink-950/95 backdrop-blur-md sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={item.href}
                className="focus-ring flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium"
              >
                <item.icon
                  size={19}
                  className={cn(
                    "transition",
                    isActive ? "text-accent" : "text-mist-500"
                  )}
                />
                <span className={cn(isActive ? "text-mist-100" : "text-mist-500")}>
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
