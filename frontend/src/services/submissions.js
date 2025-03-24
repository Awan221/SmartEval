import api from './api';

export const getSubmissions = async (params = {}) => {
  try {
    const response = await api.get('/submissions/', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Failed to fetch submissions' };
  }
};

export const getSubmission = async (id) => {
  try {
    const response = await api.get(`/submissions/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Failed to fetch submission' };
  }
};

export const createSubmission = async (submissionData) => {
  try {
    const formData = new FormData();
    
    // Add exam ID
    formData.append('exam', submissionData.examId);
    
    // Add file
    formData.append('file', submissionData.file);
    
    const response = await api.post('/submissions/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Failed to create submission' };
  }
};

export const evaluateSubmission = async (id) => {
  try {
    const response = await api.post(`/submissions/${id}/evaluate/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Failed to evaluate submission' };
  }
};