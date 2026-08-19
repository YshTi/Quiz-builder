import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowLeft, Plus, Trash2, Save, AlertCircle, 
  Settings, Type, FileText, CheckCircle2, CircleDot, CheckSquare 
} from 'lucide-react';
import Link from 'next/link';
import { createQuiz } from '../utils/api';
import styles from '../styles/Create.module.css';

// Schema validation using Zod
const questionSchema = z.object({
  type: z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']),
  text: z.string().min(1, 'Question text is required'),
  options: z.array(z.string()),
  correctAnswers: z.array(z.string()).min(1, 'At least one correct answer is required'),
}).refine(data => {
  if (data.type === 'CHECKBOX') {
    // Checkbox must have at least 2 options
    return data.options.length >= 2;
  }
  return true;
}, {
  message: "Checkbox questions must have at least 2 options",
  path: ["options"]
}).refine(data => {
  if (data.type === 'CHECKBOX') {
    // Options must not be empty or whitespace-only
    return data.options.every(opt => opt.trim() !== '');
  }
  return true;
}, {
  message: "Option cannot be empty",
  path: ["options"]
}).refine(data => {
  if (data.type === 'CHECKBOX') {
    // Options must be unique (trimmed, case-insensitive)
    const normalized = data.options.map(opt => opt.trim().toLowerCase());
    return new Set(normalized).size === data.options.length;
  }
  return true;
}, {
  message: "Options must be unique",
  path: ["options"]
}).refine(data => {
  if (data.type === 'CHECKBOX') {
    // Checkbox correct answers must be a subset of options
    return data.correctAnswers.every(ans => data.options.includes(ans));
  }
  return true;
}, {
  message: "Correct answers must be selected from the options list",
  path: ["correctAnswers"]
}).refine(data => {
  if (data.type === 'INPUT') {
    // Input answers must not be empty or whitespace-only
    return data.correctAnswers.every(ans => ans.trim() !== '');
  }
  return true;
}, {
  message: "Correct answer cannot be blank",
  path: ["correctAnswers"]
});

const quizSchema = z.object({
  title: z.string().min(3, 'Quiz title must be at least 3 characters'),
  questions: z.array(questionSchema).min(1, 'A quiz must contain at least 1 question'),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export default function CreateQuiz() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      questions: [
        {
          type: 'BOOLEAN',
          text: '',
          options: ['True', 'False'],
          correctAnswers: ['True'],
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  });

  const watchedQuestions = useWatch({
    control,
    name: 'questions',
  });

  const handleTypeChange = (index: number, newType: 'BOOLEAN' | 'INPUT' | 'CHECKBOX') => {
    setValue(`questions.${index}.type`, newType);
    if (newType === 'BOOLEAN') {
      setValue(`questions.${index}.options`, ['True', 'False']);
      setValue(`questions.${index}.correctAnswers`, ['True']);
    } else if (newType === 'INPUT') {
      setValue(`questions.${index}.options`, []);
      setValue(`questions.${index}.correctAnswers`, ['']);
    } else if (newType === 'CHECKBOX') {
      setValue(`questions.${index}.options`, ['Option 1', 'Option 2']);
      setValue(`questions.${index}.correctAnswers`, ['Option 1']);
    }
  };

  const handleAddCheckboxOption = (qIndex: number) => {
    const currentOptions = watchedQuestions[qIndex].options || [];
    const newOptionNumber = currentOptions.length + 1;
    const newOptionText = `Option ${newOptionNumber}`;
    setValue(`questions.${qIndex}.options`, [...currentOptions, newOptionText]);
  };

  const handleRemoveCheckboxOption = (qIndex: number, optIndex: number) => {
    const currentOptions = [...(watchedQuestions[qIndex].options || [])];
    const removedOptionText = currentOptions[optIndex];
    currentOptions.splice(optIndex, 1);
    
    setValue(`questions.${qIndex}.options`, currentOptions);

    // Also remove from correct answers if it was selected
    const currentCorrect = watchedQuestions[qIndex].correctAnswers || [];
    const updatedCorrect = currentCorrect.filter(ans => ans !== removedOptionText);
    setValue(`questions.${qIndex}.correctAnswers`, updatedCorrect.length > 0 ? updatedCorrect : [currentOptions[0] || '']);
  };

  const handleToggleCheckboxCorrectAnswer = (qIndex: number, optionText: string) => {
    const currentCorrect = [...(watchedQuestions[qIndex].correctAnswers || [])];
    const isAlreadyCorrect = currentCorrect.includes(optionText);
    
    let newCorrect;
    if (isAlreadyCorrect) {
      newCorrect = currentCorrect.filter(ans => ans !== optionText);
    } else {
      newCorrect = [...currentCorrect, optionText];
    }
    
    setValue(`questions.${qIndex}.correctAnswers`, newCorrect);
  };

  const onSubmit = async (data: QuizFormValues) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createQuiz(data);
      router.push('/quizzes');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit quiz.';
      setSubmitError(message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Quiz | QuizBuilder</title>
      </Head>
      <div className="animate-slide-up">
        <div className={styles.backWrapper}>
          <Link href="/quizzes" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formHeader}>
            <div>
              <h1 className={styles.pageTitle}>Create Custom Quiz</h1>
              <p className={styles.pageSubtitle}>Define your quiz schema, add questions and configure validations.</p>
            </div>
            <button type="submit" className="gradient-btn" disabled={submitting}>
              {submitting ? <CircleDot className={styles.spinner} size={18} /> : <Save size={18} />}
              <span>{submitting ? 'Saving Quiz...' : 'Save Quiz'}</span>
            </button>
          </div>

          {submitError && (
            <div className={styles.errorBanner}>
              <AlertCircle size={20} />
              <span>{submitError}</span>
            </div>
          )}

          {/* Quiz Details Card */}
          <div className={`${styles.card} glass-card`}>
            <div className={styles.cardHeaderIcon}>
              <Settings className={styles.headerIcon} />
              <h2>Quiz Information</h2>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="quiz-title" className={styles.label}>Quiz Title</label>
              <input
                id="quiz-title"
                type="text"
                className="input-field"
                placeholder="Enter a descriptive title (e.g. JavaScript Closures)"
                {...register('title')}
              />
              {errors.title && <p className={styles.inputError}>{errors.title.message}</p>}
            </div>
          </div>

          {/* Questions Section */}
          <div className={styles.sectionHeader}>
            <h2>Questions ({fields.length})</h2>
            <button
              type="button"
              className={styles.addBtn}
              onClick={() => append({
                type: 'BOOLEAN',
                text: '',
                options: ['True', 'False'],
                correctAnswers: ['True'],
              })}
            >
              <Plus size={16} />
              <span>Add Question</span>
            </button>
          </div>

          {errors.questions?.message && (
            <div className={styles.errorBanner} style={{ marginTop: '-12px', marginBottom: '20px' }}>
              <AlertCircle size={18} />
              <span>{errors.questions.message}</span>
            </div>
          )}

          <div className={styles.questionsContainer}>
            {fields.map((field, qIndex) => {
              const qType = watchedQuestions[qIndex]?.type;
              const qErrors = errors.questions?.[qIndex];

              return (
                <div key={field.id} className={`${styles.questionCard} glass-card`}>
                  <div className={styles.qHeader}>
                    <span className={styles.qNumber}>Question {qIndex + 1}</span>
                    <div className={styles.qActions}>
                      <button
                        type="button"
                        onClick={() => remove(qIndex)}
                        className={styles.removeBtn}
                        title="Remove Question"
                        disabled={fields.length === 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Question Text</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. What is the value of 2 + 2?"
                      {...register(`questions.${qIndex}.text`)}
                    />
                    {qErrors?.text && <p className={styles.inputError}>{qErrors.text.message}</p>}
                  </div>

                  {/* Question Type Selection */}
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Question Type</label>
                    <div className={styles.typeGrid}>
                      {(
                        [
                          { value: 'BOOLEAN', label: 'True / False', icon: CircleDot },
                          { value: 'INPUT', label: 'Short Answer Text', icon: FileText },
                          { value: 'CHECKBOX', label: 'Multiple Choice Checkbox', icon: CheckSquare }
                        ] as const
                      ).map((item) => {
                        const Icon = item.icon;
                        const isSelected = qType === item.value;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            className={`${styles.typeBtn} ${isSelected ? styles.typeBtnSelected : ''}`}
                            onClick={() => handleTypeChange(qIndex, item.value)}
                          >
                            <Icon size={18} className={styles.typeIcon} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* BOOLEAN CARD DETAILS */}
                  {qType === 'BOOLEAN' && (
                    <div className={styles.typeDetailsBox}>
                      <div className={styles.optionsTitle}>
                        <CheckCircle2 size={16} />
                        <span>Designate Correct Boolean Answer</span>
                      </div>
                      <div className={styles.booleanOptions}>
                        {['True', 'False'].map((option) => {
                          const isCorrect = watchedQuestions[qIndex]?.correctAnswers?.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              className={`${styles.boolBtn} ${isCorrect ? styles.boolBtnSelected : ''}`}
                              onClick={() => setValue(`questions.${qIndex}.correctAnswers`, [option])}
                            >
                              <div className={styles.radioDot}>
                                {isCorrect && <div className={styles.radioDotInner} />}
                              </div>
                              <span>{option}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* INPUT CARD DETAILS */}
                  {qType === 'INPUT' && (
                    <div className={styles.typeDetailsBox}>
                      <div className={styles.optionsTitle}>
                        <Type size={16} />
                        <span>Accepted Correct Text Answer</span>
                      </div>
                      <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. 4 or four (case insensitive check will apply)"
                          value={watchedQuestions[qIndex]?.correctAnswers?.[0] || ''}
                          onChange={(e) => setValue(`questions.${qIndex}.correctAnswers`, [e.target.value])}
                        />
                        {qErrors?.correctAnswers && <p className={styles.inputError}>{qErrors.correctAnswers.message}</p>}
                      </div>
                    </div>
                  )}

                  {/* CHECKBOX CARD DETAILS */}
                  {qType === 'CHECKBOX' && (
                    <div className={styles.typeDetailsBox}>
                      <div className={styles.checkboxOptionsHeader}>
                        <div className={styles.optionsTitle}>
                          <CheckSquare size={16} />
                          <span>Options & Correct Choices</span>
                        </div>
                        <button
                          type="button"
                          className={styles.addOptionBtn}
                          onClick={() => handleAddCheckboxOption(qIndex)}
                        >
                          <Plus size={14} />
                          <span>Add Option</span>
                        </button>
                      </div>

                      {qErrors?.options && (
                        <p className={styles.inputError} style={{ marginBottom: '12px' }}>
                          {qErrors.options.message}
                        </p>
                      )}

                      <div className={styles.optionsList}>
                        {(watchedQuestions[qIndex]?.options || []).map((optionText, optIndex) => {
                          const isCorrect = watchedQuestions[qIndex]?.correctAnswers?.includes(optionText);
                          return (
                            <div key={optIndex} className={styles.optionItemRow}>
                              <button
                                type="button"
                                className={`${styles.optionCheckBtn} ${isCorrect ? styles.optionCheckBtnSelected : ''}`}
                                onClick={() => handleToggleCheckboxCorrectAnswer(qIndex, optionText)}
                                title={isCorrect ? 'Mark as Incorrect' : 'Mark as Correct'}
                              >
                                <div className={styles.checkboxSquare}>
                                  {isCorrect && <Plus size={14} className={styles.checkIcon} />}
                                </div>
                              </button>

                              <input
                                type="text"
                                className={`${styles.optionInput} input-field`}
                                value={optionText}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const currentOptions = [...(watchedQuestions[qIndex].options || [])];
                                  const oldVal = currentOptions[optIndex];
                                  currentOptions[optIndex] = val;
                                  setValue(`questions.${qIndex}.options`, currentOptions);

                                  // If this was checked, rename it in correctAnswers too
                                  const currentCorrect = [...(watchedQuestions[qIndex].correctAnswers || [])];
                                  const correctIndex = currentCorrect.indexOf(oldVal);
                                  if (correctIndex !== -1) {
                                    currentCorrect[correctIndex] = val;
                                    setValue(`questions.${qIndex}.correctAnswers`, currentCorrect);
                                  }
                                }}
                                placeholder={`Option ${optIndex + 1}`}
                              />

                              <button
                                type="button"
                                className={styles.deleteOptionBtn}
                                onClick={() => handleRemoveCheckboxOption(qIndex, optIndex)}
                                title="Remove Option"
                                disabled={(watchedQuestions[qIndex]?.options || []).length <= 2}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          <div className={styles.formFooterSubmit}>
            <button type="submit" className="gradient-btn" disabled={submitting} style={{ padding: '14px 40px', fontSize: '16px' }}>
              {submitting ? <CircleDot className={styles.spinner} size={18} /> : <Save size={18} />}
              <span>{submitting ? 'Creating Quiz...' : 'Create Quiz Blueprint'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
