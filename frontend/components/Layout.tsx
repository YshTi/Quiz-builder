import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BrainCircuit, BookOpen, PlusCircle } from 'lucide-react';
import styles from '../styles/Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.navContainer}>
          <Link href="/quizzes" className={styles.logo}>
            <BrainCircuit className={styles.logoIcon} />
            <span>Quiz<span className={styles.logoAccent}>Builder</span></span>
          </Link>
          <nav className={styles.nav}>
            <Link 
              href="/quizzes" 
              className={`${styles.navLink} ${
                router.pathname === '/quizzes' || router.pathname === '/quizzes/[id]' 
                  ? styles.active 
                  : ''
              }`}
            >
              <BookOpen size={18} />
              <span>Quizzes</span>
            </Link>
            <Link 
              href="/create" 
              className={`${styles.navLink} ${router.pathname === '/create' ? styles.active : ''}`}
            >
              <PlusCircle size={18} />
              <span>Create Quiz</span>
            </Link>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.contentContainer}>
          {children}
        </div>
      </main>
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Quiz Builder. Designed with &hearts;</p>
      </footer>
    </div>
  );
}
