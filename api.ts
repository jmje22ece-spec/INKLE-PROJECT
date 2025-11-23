import axios from 'axios';

const BASE_URL = 'https://685013d7e7c42cfd17974a33.mockapi.io';

export interface TaxRecord {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  requestDate: string;
  country: string;
}

export interface Country {
  id: string;
  name: string;
}

export const taxesApi = {
  // Get all tax records
  getAll: async (): Promise<TaxRecord[]> => {
    const response = await axios.get(`${BASE_URL}/taxes`);
    return response.data;
  },

  // Update a tax record
  update: async (id: string, data: Partial<TaxRecord>): Promise<TaxRecord> => {
    const response = await axios.put(`${BASE_URL}/taxes/${id}`, data);
    return response.data;
  },
};

export const countriesApi = {
  // Get all countries
  getAll: async (): Promise<Country[]> => {
    const response = await axios.get(`${BASE_URL}/countries`);
    return response.data;
  },
};
