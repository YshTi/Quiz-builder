import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  PlusCircle,
  HelpCircle,
  Loader2,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import {
  fetchQuizzes,
  deleteQuiz,
  QuizSummary,
} from '../../utils/api';

import QuizCard from '../../components/QuizCard';
import ConfirmModal from '../../components/ConfirmModal';

import styles from '../../styles/Quizzes.module.css';

const DESKTOP_PAGE_SIZE = 6;
const COMPACT_PAGE_SIZE = 4;

export default function QuizzesDashboard() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quizToDelete, setQuizToDelete] =
    useState<QuizSummary | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DESKTOP_PAGE_SIZE);

  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchQuizzes();
      setQuizzes(data);
      setCurrentPage(1);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load quizzes.',
      );
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
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load quizzes.',
          );

          setLoading(false);
        }
      }
    };

    fetchInitial();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');

    const updatePageSize = () => {
      setPageSize(
        mediaQuery.matches
          ? COMPACT_PAGE_SIZE
          : DESKTOP_PAGE_SIZE,
      );

      setCurrentPage(1);
    };

    updatePageSize();

    mediaQuery.addEventListener('change', updatePageSize);

    return () => {
      mediaQuery.removeEventListener('change', updatePageSize);
    };
  }, []);

  const totalPages = Math.max(
    1,
    Math.ceil(quizzes.length / pageSize),
  );

  const paginatedQuizzes = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return quizzes.slice(startIndex, endIndex);
  }, [quizzes, currentPage, pageSize]);

  const handleDeleteRequest = (id: string) => {
    const quiz = quizzes.find((item) => item.id === id);

    if (!quiz) {
      return;
    }

    setQuizToDelete(quiz);
  };

  const handleCancelDelete = () => {
    if (deletingId) {
      return;
    }

    setQuizToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!quizToDelete) {
      return;
    }

    const id = quizToDelete.id;

    setDeletingId(id);

    try {
      await deleteQuiz(id);

      setQuizzes((currentQuizzes) => {
        const updatedQuizzes = currentQuizzes.filter(
          (quiz) => quiz.id !== id,
        );

        const updatedTotalPages = Math.max(
          1,
          Math.ceil(updatedQuizzes.length / pageSize),
        );

        setCurrentPage((page) =>
          Math.min(page, updatedTotalPages),
        );

        return updatedQuizzes;
      });

      setQuizToDelete(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete the quiz.',
      );
    } finally {
      setDeletingId(null);
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) =>
      Math.min(totalPages, page + 1),
    );
  };

  return (
    <>
      <Head>
        <title>Dashboard | QuizBuilder</title>

        <meta
          name="description"
          content="View and manage all available quizzes in the QuizBuilder application."
        />
      </Head>

      <div className="animate-slide-up">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              Quiz Dashboard
            </h1>

            <p className={styles.subtitle}>
              Select a quiz to review its structure, or create a
              brand new one.
            </p>
          </div>

          <Link
            href="/create"
            className="btn btn-primary"
          >
            <PlusCircle size={18} />
            <span>Create Quiz</span>
          </Link>
        </div>

        {loading ? (
          <div className={styles.loaderWrapper}>
            <Loader2
              size={36}
              className={styles.spinner}
            />

            <p>Loading quizzes...</p>
          </div>
        ) : error ? (
          <div
            className={`${styles.errorCard} glass-card`}
          >
            <AlertCircle
              className={styles.errorIcon}
              size={40}
            />

            <h3>Database Connection Issue</h3>

            <p>{error}</p>

            <button
              type="button"
              onClick={loadQuizzes}
              className="btn btn-secondary"
            >
              <RefreshCw size={16} />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : quizzes.length === 0 ? (
          <div
            className={`${styles.emptyCard} glass-card`}
          >
            <HelpCircle
              className={styles.emptyIcon}
              size={48}
            />

            <h3>No Quizzes Found</h3>

            <p>
              It looks like there are no quizzes in the SQLite
              database yet.
            </p>

            <Link
              href="/create"
              className="btn btn-primary"
            >
              <PlusCircle size={18} />
              <span>Create Your First Quiz</span>
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {paginatedQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onDelete={handleDeleteRequest}
                  isDeleting={deletingId === quiz.id}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                className={styles.pagination}
                aria-label="Quiz pagination"
              >
                <button
                  type="button"
                  className={styles.paginationButton}
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className={styles.pageNumbers}>
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`${styles.pageButton} ${
                        page === currentPage
                          ? styles.pageButtonActive
                          : ''
                      }`}
                      onClick={() => setCurrentPage(page)}
                      aria-current={
                        page === currentPage
                          ? 'page'
                          : undefined
                      }
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className={styles.paginationButton}
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={quizToDelete !== null}
        title="Delete quiz?"
        message={
          quizToDelete
            ? `Are you sure you want to delete "${quizToDelete.title}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete Quiz"
        cancelLabel="Cancel"
        isLoading={deletingId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}