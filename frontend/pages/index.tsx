import Head from "next/head";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen, PlusCircle } from "lucide-react";
import {
  HiOutlineClipboardDocumentCheck,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { MdOutlineCategory } from "react-icons/md";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>QuizBuilder - Create Custom Interactive Quizzes</title>
        <meta
          name="description"
          content="Build customized quizzes with dynamic form controls, multiple-choice questions, text inputs, and boolean choices."
        />
      </Head>
      <div className={`${styles.hero} animate-slide-up`}>
        <div className={styles.badge}>
          <Sparkles size={14} className={styles.badgeIcon} />
          <span>Interactive Quiz Creation Platform</span>
        </div>
        <h1 className={styles.title}>
          Design Quizzes That{" "}
          <span className={styles.gradientText}>Engage & Educate</span>
        </h1>
        <p className={styles.subtitle}>
          Create tailored questionnaires in seconds. Supported question types
          include Boolean, Short Text Answers, and Checkbox Multiple-Choice with
          instant answer keys.
        </p>
        <div className={styles.actions}>
          <Link href="/quizzes" className="btn btn-primary">
            <BookOpen size={18} />
            <span>Explore Dashboard</span>
            <ArrowRight size={16} />
          </Link>
          <Link href="/create" className="btn btn-secondary">
            <PlusCircle size={18} />
            <span>Create New Quiz</span>
          </Link>
        </div>

        <div className={styles.grid}>
          <div className="glass-card styleCard">
            <div className={styles.cardIconWrapper}>
              <HiOutlineClipboardDocumentCheck size={26} />
            </div>
            <h3>Intelligent Schema</h3>
            <p>
              Define rules and save structured answers instantly to a persistent
              local SQLite backend.
            </p>
          </div>
          <div className="glass-card styleCard">
            <div className={styles.cardIconWrapper}>
              <MdOutlineCategory size={26} />
            </div>
            <h3>Diverse Types</h3>
            <p>
              Seamlessly mix and match True/False, open-ended text inputs, and
              multi-choice checkboxes.
            </p>
          </div>
          <div className="glass-card styleCard">
            <div className={styles.cardIconWrapper}>
              <HiOutlineSparkles size={26} />
            </div>
            <h3>Glassmorphic UI</h3>
            <p>
              Designed with premium modern animations, glowing highlights, and
              clear feedback loops.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
