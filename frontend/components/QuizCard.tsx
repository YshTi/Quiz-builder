import Link from 'next/link';
import { Trash2, Calendar, HelpCircle } from 'lucide-react';
import { QuizSummary } from '../utils/api';
import styles from '../styles/QuizCard.module.css';

interface QuizCardProps {
  quiz: QuizSummary;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function QuizCard({ quiz, onDelete, isDeleting }: QuizCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${quiz.title}"?`)) {
      onDelete(quiz.id);
    }
  };

  const formattedDate = new Date(quiz.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/quizzes/${quiz.id}`} className={`${styles.card} glass-card`}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{quiz.title}</h3>
        <button 
          onClick={handleDelete} 
          className={styles.deleteBtn}
          title="Delete Quiz"
          disabled={isDeleting}
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <HelpCircle size={15} className={styles.icon} />
          <span>{quiz.questionCount} {quiz.questionCount === 1 ? 'Question' : 'Questions'}</span>
        </div>
        <div className={styles.metaItem}>
          <Calendar size={15} className={styles.icon} />
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.viewLink}>
          View Quiz Details
          <span className={styles.arrow}>&rarr;</span>
        </span>
      </div>
    </Link>
  );
}
