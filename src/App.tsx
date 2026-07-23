import { useEffect } from 'react';
import { Container } from '@mantine/core';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchVacancies, setCurrentPage, setSearchText, setSelectedCity, setSkills } from './store/vacanciesSlice';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CitySelect } from './components/CitySelect';
import { SkillsFilter } from './components/SkillsFilter';
import { VacancyCard } from './components/VacancyCard';
import { Pagination } from './components/Pagination';
import styles from './App.module.css';

function App() {
  const dispatch = useAppDispatch();
  const { vacancies, loading, totalPages, currentPage, searchText, selectedCity, skills, isMockData } = useAppSelector(
    (state) => state.vacancies
  );

  useEffect(() => {
    dispatch(fetchVacancies());
  }, [dispatch, currentPage, searchText, selectedCity, skills]);

  const handleSearchChange = (value: string) => {
    dispatch(setSearchText(value));
  };

  const handleCityChange = (value: string | null) => {
    dispatch(setSelectedCity(value));
  };

  const handleSkillsChange = (newSkills: string[]) => {
    dispatch(setSkills(newSkills));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

   return (
    <div className={styles.app}>
      <Header />
      <div className={styles.divider}></div>
      <Container className={styles.container}>
        <div className={styles.content}>
          <div className={styles.contentTitle}>
          <h1 className={styles.title}>Список вакансий</h1>
          <p className={styles.subtitle}>по профессии Frontend-разработчик</p>
          </div>
          <div className={styles.filtersRow}>
            <SearchBar value={searchText} onChange={handleSearchChange} />
          </div>
        </div>
          {isMockData && (
            <div className={styles.warningBanner}>
              ⚠️ Сервис временно недоступен.
            </div>
          )}
        <div className={styles.main}>
          <div className={styles.leftsection}>
            <div className={styles.moduleskills}>
              <SkillsFilter skills={skills} onSkillsChange={handleSkillsChange} />
            </div>
            <div className={styles.modulecity}>
              <CitySelect value={selectedCity} onChange={handleCityChange} />
            </div>
          </div>

          <div className={styles.rightsection}>
            {loading ? (
              <div className={styles.loaderWrapper}>
                <div className={styles.loader} />
              </div>
            ) : vacancies.length === 0 ? (
              <div className={styles.emptyWrapper}>
                <p className={styles.emptyText}>Вакансии не найдены</p>
              </div>
            ) : (
              <div className={styles.vacanciesList}>
                {vacancies.map((vacancy) => (
                  <VacancyCard key={vacancy.id} vacancy={vacancy} />
                ))}
              </div>
            )}
            <div className={styles.pagination}>  
            {totalPages > 1 && (
              <Pagination total={totalPages} current={currentPage} onChange={handlePageChange} />
            )}
            </div>
          </div>
          
        </div>
      </Container>
    </div>
  );
}

export default App;