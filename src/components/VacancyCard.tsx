import type { Vacancy } from '../types/vacancy';
import styles from './VacancyCard.module.css';

interface VacancyCardProps {
  vacancy: Vacancy;
}

const getWorkFormatTag = (vacancy: Vacancy) => {
  const schedule = vacancy.schedule?.name?.toLowerCase() || '';
  if (schedule.includes('удален') || schedule.includes('remote')) {
    return { label: 'Можно удалённо', className: 'tagRemote' };
  }
  if (schedule.includes('гибрид') || schedule.includes('mixed')) {
    return { label: 'Гибрид', className: 'tagHybrid' };
  }
  return { label: 'Офис', className: 'tagOffice' };
};

const formatSalary = (salary: Vacancy['salary']) => {
  if (!salary) return 'Зарплата не указана';
  const from = salary.from ? `${salary.from.toLocaleString()} ${salary.currency}` : '';
  const to = salary.to ? `${salary.to.toLocaleString()} ${salary.currency}` : '';
  if (from && to) return `${from} – ${to}`;
  if (from) return `от ${from}`;
  if (to) return `до ${to}`;
  return 'Зарплата не указана';
};

export const VacancyCard = ({ vacancy }: VacancyCardProps) => {
  const workFormat = getWorkFormatTag(vacancy);

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.cardInfo}>
          <h3 className={styles.vacancyTitle}>{vacancy.name}</h3>

          <div className={styles.salaryRow}>
            <span className={styles.salary}>{formatSalary(vacancy.salary)}</span>
            <span className={styles.experience}>
              {vacancy.experience?.name || 'Опыт не указан'}
            </span>
          </div>

          <p className={styles.company}>{vacancy.employer?.name || 'Компания не указана'}</p>

          <div className={styles.tagsRow}>
            <span className={`${styles.tag} ${styles[workFormat.className]}`}>
              {workFormat.label}
            </span>
          </div>

          
          <p className={styles.city}>{vacancy.area?.name || 'Город не указан'}</p>
        </div>

        <div className={styles.cardActions}>
          <button className={styles.watchBtn}>Смотреть вакансию</button>
          <a
            href={vacancy.alternate_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.respondBtn}
          >
            Откликнуться
          </a>
        </div>
      </div>
    </div>
  );
};