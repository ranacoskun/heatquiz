import axios from "axios";

/**
 * Service for LLM API calls to generate performance recaps
 * Supports OpenAI API by default, but can be extended for other providers
 */

// Get API key from environment variable
const getLLMApiKey = () => {
  const key = process.env.REACT_APP_LLM_API_KEY || process.env.REACT_APP_OPENAI_API_KEY;
  
  // Debug logging (remove in production)
  if (!key) {
    console.warn('LLM API Key not found. Checked:', {
      'REACT_APP_LLM_API_KEY': !!process.env.REACT_APP_LLM_API_KEY,
      'REACT_APP_OPENAI_API_KEY': !!process.env.REACT_APP_OPENAI_API_KEY,
      'All REACT_APP vars': Object.keys(process.env).filter(k => k.startsWith('REACT_APP_'))
    });
  }
  
  return key;
};

// Get API base URL (defaults to OpenAI)
const getLLMApiUrl = () => {
  return process.env.REACT_APP_LLM_API_URL || 'https://api.openai.com/v1/chat/completions';
};

/**
 * Generate a personalized performance recap using LLM
 * @param {Object} performanceData - Extracted performance data
 * @returns {Promise<string>} - Generated recap text
 */
export const generatePerformanceRecap = async (performanceData) => {
  const apiKey = getLLMApiKey();
  
  if (!apiKey) {
    const errorMsg = 'LLM API key not configured. Please set REACT_APP_LLM_API_KEY or REACT_APP_OPENAI_API_KEY in your .env file and restart the React dev server.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const apiUrl = getLLMApiUrl();
  const model = process.env.REACT_APP_LLM_MODEL || 'gpt-3.5-turbo';
  
  // Debug logging
  console.log('LLM Service Config:', {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    apiUrl,
    model,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 7) + '...' : 'N/A'
  });
  
  // Build the prompt
  const prompt = buildPerformancePrompt(performanceData);

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an educational assistant that provides brief, encouraging motivational messages to students. Your messages should be general, positive, and supportive. Do NOT provide specific learning advice, topic analysis, or study recommendations - only general encouragement.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error('Invalid response from LLM API');
    }
  } catch (error) {
    console.error('Error generating LLM recap:', error);
    
    if (error.response) {
      // API error response
      throw new Error(`LLM API error: ${error.response.data?.error?.message || error.response.statusText}`);
    } else if (error.request) {
      // Network error
      throw new Error('Network error: Could not reach LLM API. Please check your internet connection.');
    } else {
      // Other error
      throw new Error(`Error generating recap: ${error.message}`);
    }
  }
};

/**
 * Build the prompt for LLM based on performance data
 * @param {Object} performanceData - Extracted performance data
 * @returns {string} - Formatted prompt
 */
const buildPerformancePrompt = (performanceData) => {
  const {
    overallSuccessRate,
    totalQuestions,
    correctCount,
    topics,
    subtopics,
    difficultyLevels
  } = performanceData;

  let prompt = `Based on a student's quiz performance, provide a personalized recap. Here are the details:\n\n`;
  
  prompt += `Overall Performance: ${correctCount} out of ${totalQuestions} questions correct (${overallSuccessRate}% success rate)\n\n`;

  if (topics && Object.keys(topics).length > 0) {
    prompt += `Performance by Topic:\n`;
    Object.entries(topics).forEach(([topic, stats]) => {
      const topicSuccessRate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      prompt += `- ${topic}: ${stats.correct}/${stats.total} correct (${topicSuccessRate}%)\n`;
    });
    prompt += `\n`;
  }

  if (subtopics && Object.keys(subtopics).length > 0) {
    prompt += `Performance by Subtopic:\n`;
    Object.entries(subtopics).forEach(([subtopic, stats]) => {
      const subtopicSuccessRate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      prompt += `- ${subtopic}: ${stats.correct}/${stats.total} correct (${subtopicSuccessRate}%)\n`;
    });
    prompt += `\n`;
  }

  if (difficultyLevels && Object.keys(difficultyLevels).length > 0) {
    prompt += `Performance by Difficulty Level:\n`;
    Object.entries(difficultyLevels).forEach(([level, stats]) => {
      const levelSuccessRate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      prompt += `- ${level}: ${stats.correct}/${stats.total} correct (${levelSuccessRate}%)\n`;
    });
    prompt += `\n`;
  }

  prompt += `Please provide a brief, encouraging motivational message (1-2 short paragraphs, maximum 150 words) that:\n`;
  prompt += `1. Acknowledges their effort and overall performance\n`;
  prompt += `2. Provides general encouragement to continue learning\n`;
  prompt += `IMPORTANT: Do NOT provide specific learning advice, topic analysis, or study recommendations. `;
  prompt += `Only provide general motivation and encouragement. `;
  prompt += `Keep it brief, positive, and supportive. `;
  prompt += `Do not make claims about what they should study or how they should improve - that information is already provided in the factual data above.`;

  return prompt;
};

/**
 * Alternative: Call a backend endpoint instead of direct LLM API
 * This is more secure as it keeps the API key on the server
 * @param {Object} performanceData - Extracted performance data
 * @returns {Promise<string>} - Generated recap text
 */
export const generatePerformanceRecapViaBackend = async (performanceData) => {
  const Server = process.env.REACT_APP_API_SERVER || 'http://localhost:6001/api/';
  
  try {
    const response = await axios.post(
      `${Server}LLM/GeneratePerformanceRecap`,
      performanceData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.recap) {
      return response.data.recap;
    } else {
      throw new Error('Invalid response from backend');
    }
  } catch (error) {
    console.error('Error generating LLM recap via backend:', error);
    throw new Error(`Backend error: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Generate goal judgments for each selected goal
 * @param {Array<string>} goals - Array of goal texts
 * @param {Object} performanceData - Extracted performance data including mistakes
 * @returns {Promise<Array<{goal: string, status: string, explanation: string}>>} - Array of goal judgments
 */
export const generateGoalJudgments = async (goals, performanceData) => {
  const apiKey = getLLMApiKey();
  
  if (!apiKey) {
    const errorMsg = 'LLM API key not configured. Please set REACT_APP_LLM_API_KEY or REACT_APP_OPENAI_API_KEY in your .env file and restart the React dev server.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const apiUrl = getLLMApiUrl();
  const model = process.env.REACT_APP_LLM_MODEL || 'gpt-3.5-turbo';

  const prompt = buildGoalJudgmentPrompt(goals, performanceData);

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an educational assistant that evaluates learning goals based on quiz performance data. For each goal, determine if it was "met", "partially met", or "not yet met", and provide a one-line explanation grounded in the performance data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const content = response.data.choices[0].message.content.trim();
      return parseGoalJudgments(content, goals);
    } else {
      throw new Error('Invalid response from LLM API');
    }
  } catch (error) {
    console.error('Error generating goal judgments:', error);
    
    if (error.response) {
      throw new Error(`LLM API error: ${error.response.data?.error?.message || error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Network error: Could not reach LLM API. Please check your internet connection.');
    } else {
      throw new Error(`Error generating goal judgments: ${error.message}`);
    }
  }
};

/**
 * Generate learning pattern analysis paragraph
 * @param {Object} performanceData - Extracted performance data including question types, difficulty, and mistakes
 * @returns {Promise<string>} - Generated analysis paragraph
 */
export const generateLearningPatternAnalysis = async (performanceData) => {
  const apiKey = getLLMApiKey();
  
  if (!apiKey) {
    const errorMsg = 'LLM API key not configured. Please set REACT_APP_LLM_API_KEY or REACT_APP_OPENAI_API_KEY in your .env file and restart the React dev server.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const apiUrl = getLLMApiUrl();
  const model = process.env.REACT_APP_LLM_MODEL || 'gpt-3.5-turbo';

  const prompt = buildLearningPatternPrompt(performanceData);

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an educational assistant that analyzes learning patterns based on quiz performance. Provide a short paragraph (2-3 sentences) explaining where and how the learner struggled, based on question type, difficulty, and mistakes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error('Invalid response from LLM API');
    }
  } catch (error) {
    console.error('Error generating learning pattern analysis:', error);
    
    if (error.response) {
      throw new Error(`LLM API error: ${error.response.data?.error?.message || error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Network error: Could not reach LLM API. Please check your internet connection.');
    } else {
      throw new Error(`Error generating learning pattern analysis: ${error.message}`);
    }
  }
};

/**
 * Build prompt for goal judgment
 */
const buildGoalJudgmentPrompt = (goals, performanceData) => {
  const {
    overallSuccessRate,
    totalQuestions,
    correctCount,
    topics,
    subtopics,
    difficultyLevels,
    questionTypes,
    mistakes
  } = performanceData;

  let prompt = `Evaluate each learning goal based on the student's quiz performance. For each goal, respond with exactly one line in this format:\n`;
  prompt += `GOAL: [goal text]\n`;
  prompt += `STATUS: [met/partially met/not yet met]\n`;
  prompt += `EXPLANATION: [one-line explanation grounded in performance data]\n\n`;

  prompt += `Performance Data:\n`;
  prompt += `- Overall: ${correctCount}/${totalQuestions} correct (${overallSuccessRate}%)\n\n`;

  if (questionTypes && Object.keys(questionTypes).length > 0) {
    prompt += `Performance by Question Type:\n`;
    Object.entries(questionTypes).forEach(([type, stats]) => {
      const typeSuccessRate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      prompt += `- ${type}: ${stats.correct}/${stats.total} correct (${typeSuccessRate}%)\n`;
    });
    prompt += `\n`;
  }

  if (difficultyLevels && Object.keys(difficultyLevels).length > 0) {
    prompt += `Performance by Difficulty:\n`;
    Object.entries(difficultyLevels).forEach(([level, stats]) => {
      const levelSuccessRate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      prompt += `- ${level}: ${stats.correct}/${stats.total} correct (${levelSuccessRate}%)\n`;
    });
    prompt += `\n`;
  }

  if (topics && Object.keys(topics).length > 0) {
    prompt += `Performance by Topic:\n`;
    Object.entries(topics).forEach(([topic, stats]) => {
      const topicSuccessRate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      prompt += `- ${topic}: ${stats.correct}/${stats.total} correct (${topicSuccessRate}%)\n`;
    });
    prompt += `\n`;
  }

  if (mistakes && mistakes.length > 0) {
    prompt += `Areas of Struggle:\n`;
    mistakes.slice(0, 5).forEach((mistake, idx) => {
      prompt += `- ${mistake.topic || 'Unknown'}: ${mistake.difficulty || 'Unknown difficulty'}\n`;
    });
    prompt += `\n`;
  }

  prompt += `Goals to Evaluate:\n`;
  goals.forEach((goal, idx) => {
    prompt += `${idx + 1}. ${goal}\n`;
  });

  return prompt;
};

/**
 * Build prompt for learning pattern analysis
 */
const buildLearningPatternPrompt = (performanceData) => {
  const {
    overallSuccessRate,
    totalQuestions,
    correctCount,
    questionTypes,
    difficultyLevels,
    topics,
    mistakes
  } = performanceData;

  let prompt = `Analyze the student's learning patterns based on their quiz performance. Provide a short paragraph (2-3 sentences) explaining where and how they struggled.\n\n`;

  prompt += `Performance Summary:\n`;
  prompt += `- Overall: ${correctCount}/${totalQuestions} correct (${overallSuccessRate}%)\n\n`;

  if (questionTypes && Object.keys(questionTypes).length > 0) {
    prompt += `Performance by Question Type:\n`;
    Object.entries(questionTypes).forEach(([type, stats]) => {
      const typeSuccessRate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      prompt += `- ${type}: ${stats.correct}/${stats.total} correct (${typeSuccessRate}%)\n`;
    });
    prompt += `\n`;
  }

  if (difficultyLevels && Object.keys(difficultyLevels).length > 0) {
    prompt += `Performance by Difficulty Level:\n`;
    Object.entries(difficultyLevels).forEach(([level, stats]) => {
      const levelSuccessRate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      prompt += `- ${level}: ${stats.correct}/${stats.total} correct (${levelSuccessRate}%)\n`;
    });
    prompt += `\n`;
  }

  if (mistakes && mistakes.length > 0) {
    prompt += `Common Mistakes:\n`;
    const mistakeTopics = {};
    mistakes.forEach(mistake => {
      const topic = mistake.topic || 'Unknown';
      mistakeTopics[topic] = (mistakeTopics[topic] || 0) + 1;
    });
    Object.entries(mistakeTopics).slice(0, 5).forEach(([topic, count]) => {
      prompt += `- ${topic}: ${count} mistake(s)\n`;
    });
    prompt += `\n`;
  }

  prompt += `Provide a concise analysis focusing on:\n`;
  prompt += `1. Which question types or difficulty levels were challenging\n`;
  prompt += `2. What patterns emerge from the mistakes\n`;
  prompt += `3. What this suggests about the learner's understanding\n`;
  prompt += `Keep it to 2-3 sentences, very short and simple.`;

  return prompt;
};

/**
 * Parse goal judgments from LLM response
 */
const parseGoalJudgments = (content, goals) => {
  const judgments = [];
  const lines = content.split('\n');
  
  let currentGoal = null;
  let currentStatus = null;
  let currentExplanation = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('GOAL:')) {
      currentGoal = line.replace('GOAL:', '').trim();
    } else if (line.startsWith('STATUS:')) {
      const statusText = line.replace('STATUS:', '').trim().toLowerCase();
      if (statusText.includes('met') && !statusText.includes('not') && !statusText.includes('partially')) {
        currentStatus = 'met';
      } else if (statusText.includes('partially')) {
        currentStatus = 'partially met';
      } else {
        currentStatus = 'not yet met';
      }
    } else if (line.startsWith('EXPLANATION:')) {
      currentExplanation = line.replace('EXPLANATION:', '').trim();
      
      if (currentGoal && currentStatus && currentExplanation) {
        judgments.push({
          goal: currentGoal,
          status: currentStatus,
          explanation: currentExplanation
        });
        currentGoal = null;
        currentStatus = null;
        currentExplanation = null;
      }
    }
  }

  // Fallback: if parsing failed, create judgments with default values
  if (judgments.length === 0) {
    goals.forEach(goal => {
      judgments.push({
        goal: goal,
        status: 'not yet met',
        explanation: 'Evaluation pending'
      });
    });
  }

  return judgments;
};

/**
 * Backend versions of the new functions
 */
export const generateGoalJudgmentsViaBackend = async (goals, performanceData) => {
  const Server = process.env.REACT_APP_API_SERVER || 'http://localhost:6001/api/';
  
  try {
    const response = await axios.post(
      `${Server}LLM/GenerateGoalJudgments`,
      { goals, performanceData },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.judgments) {
      return response.data.judgments;
    } else {
      throw new Error('Invalid response from backend');
    }
  } catch (error) {
    console.error('Error generating goal judgments via backend:', error);
    throw new Error(`Backend error: ${error.response?.data?.message || error.message}`);
  }
};

export const generateLearningPatternAnalysisViaBackend = async (performanceData) => {
  const Server = process.env.REACT_APP_API_SERVER || 'http://localhost:6001/api/';
  
  try {
    const response = await axios.post(
      `${Server}LLM/GenerateLearningPatternAnalysis`,
      performanceData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.analysis) {
      return response.data.analysis;
    } else {
      throw new Error('Invalid response from backend');
    }
  } catch (error) {
    console.error('Error generating learning pattern analysis via backend:', error);
    throw new Error(`Backend error: ${error.response?.data?.message || error.message}`);
  }
};