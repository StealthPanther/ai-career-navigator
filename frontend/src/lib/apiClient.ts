const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  // Create abort controller with 2 minute timeout for AI processing
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes

  try {
    const response = await fetch(`${API_URL}/api/upload-resume`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = 'Failed to upload resume';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      console.error('Upload error:', errorMessage);
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Upload timed out. The AI is taking longer than expected. Please try again.');
    }
    throw error;
  }
};

export const analyzeSkills = async (userId: string, targetRole: string) => {
  const formData = new FormData();
  formData.append('user_id', userId);
  formData.append('target_role', targetRole);

  const response = await fetch(`${API_URL}/api/analyze-skills`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze skills');
  }

  return response.json();
};

export const generateRoadmap = async (
  userId: string,
  targetRole: string,
  weeks: number = 12
) => {
  const formData = new FormData();
  formData.append('user_id', userId);
  formData.append('target_role', targetRole);
  formData.append('weeks', weeks.toString());

  const response = await fetch(`${API_URL}/api/generate-roadmap`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to generate roadmap');
  }

  return response.json();
};

export const getDashboard = async (userId: string) => {
  const response = await fetch(`${API_URL}/api/dashboard/${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard');
  }

  return response.json();
};

// Interview API
export const generateInterview = async (userId: string, targetRole: string, difficulty: string, questionCount: number) => {
  const response = await fetch(`${API_URL}/api/interview/generate/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      target_role: targetRole,
      difficulty,
      question_count: questionCount
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API returned ${response.status}: ${errorText}`);
  }

  return response.json();
};

export const submitInterview = async (sessionId: string, answers: any[]) => {
  const response = await fetch(`${API_URL}/api/interview/submit/${sessionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers })
  });

  if (!response.ok) {
    throw new Error('Failed to submit interview');
  }

  return response.json();
};

export const getInterviewHistory = async (userId: string) => {
  const response = await fetch(`${API_URL}/api/interview/history/${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch interview history');
  }

  return response.json();
};

export const getInterviewSession = async (sessionId: string) => {
  const response = await fetch(`${API_URL}/api/interview/session/${sessionId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch session details');
  }

  return response.json();
};

// Chat API
export const chatWithAI = async (userId: string, message: string, roadmapId?: string) => {
  const response = await fetch(`${API_URL}/api/chat/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      roadmap_id: roadmapId
    })
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
};

export const getChatHistory = async (userId: string, roadmapId?: string) => {
  const url = roadmapId
    ? `${API_URL}/api/chat/history/${userId}?roadmap_id=${roadmapId}`
    : `${API_URL}/api/chat/history/${userId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch chat history');
  }

  return response.json();
};

export const clearChatHistory = async (userId: string, roadmapId?: string) => {
  const url = roadmapId
    ? `${API_URL}/api/chat/history/${userId}?roadmap_id=${roadmapId}`
    : `${API_URL}/api/chat/history/${userId}`;

  const response = await fetch(url, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error('Failed to clear chat history');
  }

  return response.json();
};
