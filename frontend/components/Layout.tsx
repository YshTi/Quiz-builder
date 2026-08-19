import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BookOpen, PlusCircle, Moon, Sun } from "lucide-react";
import { GiBrain } from "react-icons/gi";
import styles from "../styles/Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

type Theme = "light" | "dark";

const getPreferredTheme = (): Theme => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const theme = getPreferredTheme();
    document.documentElement.dataset.theme = theme;
  }, []);

  const toggleTheme = () => {
    const currentTheme =
      document.documentElement.dataset.theme === "light" ? "light" : "dark";

    const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>
              <GiBrain size={24} />
            </span>

            <span>
              Quiz<span className={styles.logoAccent}>Builder</span>
            </span>
          </Link>

          <nav className={styles.nav}>
            <Link
              href="/quizzes"
              className={`${styles.navLink} ${
                router.pathname === "/quizzes" ||
                router.pathname === "/quizzes/[id]"
                  ? styles.active
                  : ""
              }`}
            >
              <BookOpen size={18} />
              <span>Quizzes</span>
            </Link>

            <Link
              href="/create"
              className={`${styles.navLink} ${
                router.pathname === "/create" ? styles.active : ""
              }`}
            >
              <PlusCircle size={18} />
              <span>Create Quiz</span>
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label="Toggle color theme"
              title="Toggle color theme"
            >
              <Sun size={18} className={styles.sunIcon} aria-hidden="true" />

              <Moon size={18} className={styles.moonIcon} aria-hidden="true" />
            </button>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.contentContainer}>{children}</div>
      </main>

      <footer className={styles.footer}>
        <p>
          &copy; {new Date().getFullYear()} Quiz Builder. Designed with{" "}
          <span className={styles.heartIcon}>❤</span>
        </p>
      </footer>
    </div>
  );
}
