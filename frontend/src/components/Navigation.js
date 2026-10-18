"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWeb3 } from "@/context/Web3Context";

const Navigation = () => {
  const pathname = usePathname();
  const { web3State } = useWeb3();

  const navLinks = [
    { href: "/", label: "Wallet" },
    { href: "/view-all-tasks", label: "All Tasks" },
    { href: "/create-task", label: "Create Task" },
    { href: "/view-task", label: "View Task" },
    { href: "/update-task", label: "Update Task" },
    { href: "/delete-task", label: "Delete Task" },
    { href: "/task-logs", label: "History" },
  ];

  return (
    <header>
      <div className="logo">TODO 3.0</div>
      <nav>
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                className={`nav_link ${pathname === link.href ? "active" : ""}`}
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {web3State.account && (
        <div style={{ fontSize: "0.75rem", color: "var(--accent)", fontFamily: "monospace" }}>
          {web3State.account.slice(0, 6)}...{web3State.account.slice(-4)}
        </div>
      )}
    </header>
  );
};

export default Navigation;
