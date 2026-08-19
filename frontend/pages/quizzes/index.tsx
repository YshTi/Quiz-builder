import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { PlusCircle, HelpCircle, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchQuizzes, deleteQuiz, QuizSummary } from '../../utils/api';
import QuizCard from '../../components/QuizCard';
import styles from '../../styles/Quizzes.module.css';

export default function QuizzesDashboard() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuizzes();
      setQuizzes(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load quizzes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const fetchInitial = async () => {
      try {
        const data = await fetchQuizzes();
        if (!ignore) {
          setQuizzes(data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load quizzes.');
          setLoading(false);
        }
      }
    };
    fetchInitial();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete the quiz.';
      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard | QuizBuilder</title>
        <meta name="description" content="View and manage all available quizzes in the QuizBuilder application." />
      </Head>
      <div className="animate-slide-up">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Quiz Dashboard</h1>
            <p className={styles.subtitle}>Select a quiz to review its structure, or create a brand new one.</p>
          </div>
          <Link href="/create" className="gradient-btn">
            <PlusCircle size={18} />
            <span>Create Quiz</span>
          </Link>
        </div>

        {loading ? (
          <div className={styles.loaderWrapper}>
            <Loader2 size={36} className={styles.spinner} />
            <p>Loading quizzes...</p>
          </div>
        ) : error ? (
          <div className={`${styles.errorCard} glass-card`}>
            <AlertCircle className={styles.errorIcon} size={40} />
            <h3>Database Connection Issue</h3>
            <p>{error}</p>
            <button onClick={() => loadQuizzes()} className={styles.retryBtn}>
              <RefreshCw size={16} />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : quizzes.length === 0 ? (
          <div className={`${styles.emptyCard} glass-card`}>
            <HelpCircle className={styles.emptyIcon} size={48} />
            <h3>No Quizzes Found</h3>
            <p>It looks like there are no quizzes in the SQLite database yet.</p>
            <Link href="/create" className="gradient-btn">
              <PlusCircle size={18} />
              <span>Create Your First Quiz</span>
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onDelete={handleDelete}
                isDeleting={deletingId === quiz.id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
