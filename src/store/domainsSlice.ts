import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DomainsState {
  searchTerm: string;
  statusFilter: string | null;
}

const initialState: DomainsState = {
  searchTerm: '',
  statusFilter: null,
};

export const domainsSlice = createSlice({
  name: 'domains',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string | null>) => {
      state.statusFilter = action.payload;
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.statusFilter = null;
    },
  },
});

export const { setSearchTerm, setStatusFilter, clearFilters } = domainsSlice.actions;

export const selectSearchTerm = (state: { domains: DomainsState }) => state.domains.searchTerm;
export const selectStatusFilter = (state: { domains: DomainsState }) => state.domains.statusFilter;

export default domainsSlice.reducer; 