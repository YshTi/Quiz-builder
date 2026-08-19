import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Loader2, AlertCircle, Check, Circle, CheckSquare, Eye } from 'lucide-react';
import { fetchQuizById, Quiz } from '../../utils/api';
import styles from '../../styles/QuizDetail.module.css';

export default function QuizDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const loadQuiz = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchQuizById(id);
        setQuiz(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz details.');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader2 size={36} className={styles.spinner} />
        <p>Fetching quiz structure...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className={`${styles.errorCard} glass-card`}>
        <AlertCircle className={styles.errorIcon} size={40} />
        <h3>Failed to Load Quiz</h3>
        <p>{error || 'The requested quiz could not be found.'}</p>
        <Link href="/quizzes" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{quiz.title} | Structure Preview</title>
      </Head>
      <div className="animate-slide-up">
        <div className={styles.backWrapper}>
          <Link href="/quizzes" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className={styles.heroSection}>
          <div className={styles.previewBadge}>
            <Eye size={14} />
            <span>Read-Only Structure Mode</span>
          </div>
          <h1 className={styles.title}>{quiz.title}</h1>
          <p className={styles.metaInfo}>
            This quiz contains <strong>{quiz.questions.length}</strong> questions. Correct answers are designated for validation rules.
          </p>
        </div>

        <div className={styles.questionsList}>
          {quiz.questions.map((question, index) => {
            const isBoolean = question.type === 'BOOLEAN';
            const isInput = question.type === 'INPUT';
            const isCheckbox = question.type === 'CHECKBOX';

            return (
              <div key={question.id || index} className={`${styles.questionCard} glass-card`}>
                <div className={styles.questionHeader}>
                  <span className={styles.questionNumber}>Question {index + 1}</span>
                  <span className={`${styles.typeBadge} ${styles[question.type.toLowerCase()]}`}>
                    {question.type}
                  </span>
                </div>
                
                <h3 className={styles.questionText}>{question.text}</h3>

                {/* BOOLEAN QUESTION PREVIEW */}
                {isBoolean && (
                  <div className={styles.optionsWrapper}>
                    {['True', 'False'].map((option) => {
                      const isCorrect = question.correctAnswers.includes(option);
                      return (
                        <div 
                          key={option} 
                          className={`${styles.optionRow} ${isCorrect ? styles.correctOption : ''}`}
                        >
                          <div className={styles.radioIndicator}>
                            {isCorrect ? <Check size={14} className={styles.checkIcon} /> : <Circle size={10} />}
                          </div>
                          <span className={styles.optionLabel}>{option}</span>
                          {isCorrect && <span className={styles.badgeSuccess}>Correct Answer</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* INPUT QUESTION PREVIEW */}
                {isInput && (
                  <div className={styles.inputWrapper}>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Short answer text goes here..." 
                      disabled 
                    />
                    <div className={styles.correctAnswersBox}>
                      <span className={styles.correctAnswersLabel}>Accepted Correct Answer(s):</span>
                      <div className={styles.answersTags}>
                        {question.correctAnswers.map((ans, aIdx) => (
                          <span key={aIdx} className={styles.answerTag}>
                            {ans}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* CHECKBOX QUESTION PREVIEW */}
                {isCheckbox && (
                  <div className={styles.optionsWrapper}>
                    {question.options.map((option) => {
                      const isCorrect = question.correctAnswers.includes(option);
                      return (
                        <div 
                          key={option} 
                          className={`${styles.optionRow} ${isCorrect ? styles.correctOption : ''}`}
                        >
                          <div className={styles.checkboxIndicator}>
                            {isCorrect ? <Check size={14} className={styles.checkIcon} /> : <CheckSquare size={12} style={{ opacity: 0.2 }} />}
                          </div>
                          <span className={styles.optionLabel}>{option}</span>
                          {isCorrect && <span className={styles.badgeSuccess}>Correct Choice</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
