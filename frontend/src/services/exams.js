import api from './api';

export const getExams = async (params = {}) => {
  try {
    const response = await api.get('/exams/', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Failed to fetch exams' };
  }
};

export const getExam = async (id) => {
  try {
    const response = await api.get(`/exams/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Failed to fetch exam' };
  }
};

export const createExam = async (examData) => {
  try {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(examData).forEach(key => {
      if (key !== 'file') {
        formData.append(key, examData[key]);
      }
    });
    
    // Add file if it exists
    if (examData.file) {
      formData.append('file', examData.file);
    }
    
    const response = await api.post('/exams/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Failed to create exam' };
  }
};

export const updateExam = async (id, examData) => {
  try {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(examData).forEach(key => {
      if (key !== 'file') {
        formData.append(key, examData[key]);
      }
    });
    
    // Add file if it exists
    if (examData.file) {
      formData.append('file', examData.file);
    }
    
    const response = await api.put(`/exams/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Failed to update exam' };
  }
};

export const deleteExam = async (id) => {
  try {
    await api.delete(`/exams/${id}/`);
    return true;
  } catch (error) {
    throw error.response?.data || { detail: 'Failed to delete exam' };
  }
};

export const publishExam = async (id) => {
  try {
    const response = await api.post(`/exams/${id}/publish/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Failed to publish exam' };
  }
};

export const unpublishExam = async (id) => {
  try {
    const response = await api.post(`/exams/${id}/unpublish/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Failed to unpublish exam' };
  }
};