import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getVacancies } from '../api/hhApi';
import type { Vacancy } from '../types/vacancy';

interface VacanciesState {
  vacancies: Vacancy[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  searchText: string;
  selectedCity: string | null;
  skills: string[];
  isMockData: boolean;
}

const initialState: VacanciesState = {
  vacancies: [],
  loading: false,
  totalPages: 0,
  currentPage: 1,
  searchText: '',
  selectedCity: null,
  skills: ['TypeScript', 'React', 'Redux'],
  isMockData: false,
};

export const fetchVacancies = createAsyncThunk(
  'vacancies/fetch',
  async (_, { getState }) => {
    const state = getState() as { vacancies: VacanciesState };
    const { currentPage, searchText, selectedCity, skills } = state.vacancies;
    const response = await getVacancies(
      currentPage - 1,
      6,
      searchText,
      selectedCity || '',
      skills
    );
    return response;
  }
);

const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
      state.currentPage = 1;
    },
    setSelectedCity: (state, action: PayloadAction<string | null>) => {
      state.selectedCity = action.payload;
      state.currentPage = 1;
    },
    setSkills: (state, action: PayloadAction<string[]>) => {
      state.skills = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVacancies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVacancies.fulfilled, (state, action) => {
        state.loading = false;
        state.vacancies = action.payload.items;
        state.totalPages = Math.min(action.payload.pages, 50);
        state.isMockData = action.payload.isMock || false;
      })
      .addCase(fetchVacancies.rejected, (state) => {
        state.loading = false;
        state.vacancies = [];
        state.totalPages = 0;
      });
  },
});

export const {
  setCurrentPage,
  setSearchText,
  setSelectedCity,
  setSkills,
} = vacanciesSlice.actions;

export default vacanciesSlice.reducer;