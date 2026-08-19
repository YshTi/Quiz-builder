import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  BrainCircuit,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Clock3,
  HelpCircle,
  ListChecks,
  Loader2,
  PlusCircle,
  RefreshCw,
  Search,
} from "lucide-react";

import { deleteQuiz, fetchQuizzes, QuizSummary } from "../../utils/api";

import ConfirmModal from "../../components/ConfirmModal";
import QuizCard from "../../components/QuizCard";
import SortDropdown, { SortOption } from "../../components/SortDropdown";

import styles from "../../styles/Quizzes.module.css";

const DESKTOP_PAGE_SIZE = 6;
const COMPACT_PAGE_SIZE = 4;
const COMPACT_MEDIA_QUERY = "(max-width: 1024px)";

function subscribeToCompactLayout(callback: () => void) {
  const mediaQuery = window.matchMedia(COMPACT_MEDIA_QUERY);

  mediaQuery.addEventListener("change", callback);

  return () => {
    mediaQuery.removeEventListener("change", callback);
  };
}

function getCompactLayoutSnapshot() {
  return window.matchMedia(COMPACT_MEDIA_QUERY).matches;
}

function getServerCompactLayoutSnapshot() {
  return false;
}

export default function QuizzesDashboard() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [quizToDelete, setQuizToDelete] = useState<QuizSummary | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");

  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const isCompactLayout = useSyncExternalStore(
    subscribeToCompactLayout,
    getCompactLayoutSnapshot,
    getServerCompactLayoutSnapshot,
  );

  const pageSize = isCompactLayout ? COMPACT_PAGE_SIZE : DESKTOP_PAGE_SIZE;

  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchQuizzes();

      setQuizzes(data);
      setCurrentPage(1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load quizzes.");
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
            err instanceof Error ? err.message : "Failed to load quizzes.",
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

  const filteredAndSortedQuizzes = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const filtered = normalizedSearch
      ? quizzes.filter((quiz) =>
          quiz.title.toLowerCase().includes(normalizedSearch),
        )
      : quizzes;

    return [...filtered].sort((firstQuiz, secondQuiz) => {
      if (sortBy === "title") {
        return firstQuiz.title.localeCompare(secondQuiz.title);
      }

      const firstDate = new Date(firstQuiz.createdAt).getTime();

      const secondDate = new Date(secondQuiz.createdAt).getTime();

      if (sortBy === "oldest") {
        return firstDate - secondDate;
      }

      return secondDate - firstDate;
    });
  }, [quizzes, searchQuery, sortBy]);

  const totalQuizzes = quizzes.length;

  const totalQuestions = useMemo(
    () => quizzes.reduce((total, quiz) => total + quiz.questionCount, 0),
    [quizzes],
  );

  const latestQuiz = useMemo(() => {
    if (quizzes.length === 0) {
      return null;
    }

    return [...quizzes].sort(
      (firstQuiz, secondQuiz) =>
        new Date(secondQuiz.createdAt).getTime() -
        new Date(firstQuiz.createdAt).getTime(),
    )[0];
  }, [quizzes]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedQuizzes.length / pageSize),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedQuizzes = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;

    const endIndex = startIndex + pageSize;

    return filteredAndSortedQuizzes.slice(startIndex, endIndex);
  }, [filteredAndSortedQuizzes, safeCurrentPage, pageSize]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);

    setCurrentPage(1);
  };

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

      const updatedQuizzes = quizzes.filter((quiz) => quiz.id !== id);

      setQuizzes(updatedQuizzes);

      const remainingFilteredCount = filteredAndSortedQuizzes.filter(
        (quiz) => quiz.id !== id,
      ).length;

      const updatedTotalPages = Math.max(
        1,
        Math.ceil(remainingFilteredCount / pageSize),
      );

      setCurrentPage((page) => Math.min(page, updatedTotalPages));

      setQuizToDelete(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to delete the quiz.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage(Math.max(1, safeCurrentPage - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(Math.min(totalPages, safeCurrentPage + 1));
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
            <h1 className={styles.title}>Quiz Dashboard</h1>

            <p className={styles.subtitle}>
              Select a quiz to review its structure, or create a brand new one.
            </p>
          </div>

          <Link href="/create" className="btn btn-primary">
            <PlusCircle size={18} aria-hidden="true" />

            <span>Create Quiz</span>
          </Link>
        </div>

        {!loading && !error && quizzes.length > 0 && (
          <>
            <section className={styles.statsGrid} aria-label="Quiz statistics">
              <div className={`${styles.statCard} glass-card`}>
                <div className={styles.statIcon}>
                  <BookOpen size={20} aria-hidden="true" />
                </div>

                <div>
                  <span className={styles.statLabel}>Total Quizzes</span>

                  <strong className={styles.statValue}>{totalQuizzes}</strong>
                </div>
              </div>

              <div className={`${styles.statCard} glass-card`}>
                <div className={styles.statIcon}>
                  <ListChecks size={20} aria-hidden="true" />
                </div>

                <div>
                  <span className={styles.statLabel}>Total Questions</span>

                  <strong className={styles.statValue}>{totalQuestions}</strong>
                </div>
              </div>

              <div className={`${styles.statCard} glass-card`}>
                <div className={styles.statIcon}>
                  <Clock3 size={20} aria-hidden="true" />
                </div>

                <div className={styles.latestStatContent}>
                  <span className={styles.statLabel}>Latest Quiz</span>

                  <strong className={styles.statText}>
                    {latestQuiz?.title ?? "—"}
                  </strong>
                </div>
              </div>
            </section>

            <div className={styles.toolbar}>
              <div className={styles.searchWrapper}>
                <Search
                  size={18}
                  className={styles.searchIcon}
                  aria-hidden="true"
                />

                <input
                  id="quiz-search"
                  name="quiz-search"
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={styles.searchInput}
                  placeholder="Search quizzes..."
                  aria-label="Search quizzes"
                />
              </div>

              <div className={styles.sortWrapper}>
                <span className={styles.sortLabel}>Sort by</span>

                <SortDropdown
                  value={sortBy}
                  onChange={(value) => {
                    setSortBy(value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </>
        )}

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
          <div className={`${styles.emptyCard} glass-card`}>
            <HelpCircle className={styles.emptyIcon} size={48} />

            <h3>No Quizzes Found</h3>

            <p>
              It looks like there are no quizzes in the SQLite database yet.
            </p>

            <Link href="/create" className="btn btn-primary">
              <PlusCircle size={18} />

              <span>Create Your First Quiz</span>
            </Link>
          </div>
        ) : filteredAndSortedQuizzes.length === 0 ? (
          <div className={`${styles.emptyCard} glass-card`}>
            <Search className={styles.emptyIcon} size={44} />

            <h3>No Matching Quizzes</h3>

            <p>
              No quizzes match &quot;
              {searchQuery}
              &quot;.
            </p>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className={styles.resultsMeta}>
              <span>
                Showing {paginatedQuizzes.length} of{" "}
                {filteredAndSortedQuizzes.length}{" "}
                {filteredAndSortedQuizzes.length === 1 ? "quiz" : "quizzes"}
              </span>
            </div>

            <div className={styles.quizListSection}>
              <div className={styles.backgroundIcons} aria-hidden="true">
                <BrainCircuit className={styles.bgIconOne} />
                <CheckSquare className={styles.bgIconTwo} />
                <HelpCircle className={styles.bgIconThree} />

                <BookOpen className={styles.bgIconFour} />
                <ListChecks className={styles.bgIconFive} />
                <Clock3 className={styles.bgIconSix} />

                <BrainCircuit className={styles.bgIconSeven} />
                <CheckSquare className={styles.bgIconEight} />
              </div>

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
                <nav className={styles.pagination} aria-label="Quiz pagination">
                  <button
                    type="button"
                    className={styles.paginationButton}
                    onClick={goToPreviousPage}
                    disabled={safeCurrentPage === 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} aria-hidden="true" />
                  </button>

                  <div className={styles.pageNumbers}>
                    {Array.from(
                      {
                        length: totalPages,
                      },
                      (_, index) => index + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`${styles.pageButton} ${
                          page === safeCurrentPage
                            ? styles.pageButtonActive
                            : ""
                        }`}
                        onClick={() => setCurrentPage(page)}
                        aria-current={
                          page === safeCurrentPage ? "page" : undefined
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
                    disabled={safeCurrentPage === totalPages}
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </nav>
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={quizToDelete !== null}
        title="Delete quiz?"
        message={
          quizToDelete
            ? `Are you sure you want to delete "${quizToDelete.title}"? This action cannot be undone.`
            : ""
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
