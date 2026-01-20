import React, { useState, useEffect } from "react";
import { Card, Space, Typography, Progress, Spin, Alert, Button, Row, Col, Tag, Divider, Checkbox } from "antd";
import { CheckCircleOutlined, TrophyOutlined, BulbOutlined, ReloadOutlined, RobotOutlined, FilePdfOutlined, PlayCircleOutlined, ExclamationCircleOutlined, AimOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { generateGoalJudgments, generateGoalJudgmentsViaBackend, generateLearningPatternAnalysis, generateLearningPatternAnalysisViaBackend } from "../../services/LLMService";
import { getPdfTitle, getVideoTitle } from "../../services/ResourceTitles";

const { Title, Text, Paragraph } = Typography;

export function SelfReflectionPhase({ totalQuestions, correctCount, playedElements, goals = [] }) {
    const [incorrectAnswersData, setIncorrectAnswersData] = useState(null);
    const [goalJudgments, setGoalJudgments] = useState([]);
    const [learningPatternAnalysis, setLearningPatternAnalysis] = useState(null);
    const [loadingSelfReflection, setLoadingSelfReflection] = useState(false);
    const [selfReflectionError, setSelfReflectionError] = useState(null);
    
    // Calculate percentage
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    // Determine overall assessment
    const getAssessment = () => {
        if (percentage >= 90) {
            return {
                message: "Excellent work! You've demonstrated a strong understanding of the material.",
                color: "#52c41a",
                icon: <TrophyOutlined />
            };
        } else if (percentage >= 70) {
            return {
                message: "Good job! You're on the right track. Keep up the great work!",
                color: "#1890ff",
                icon: <CheckCircleOutlined />
            };
        } else if (percentage >= 50) {
            return {
                message: "You're making progress! Review the areas where you struggled and try again.",
                color: "#faad14",
                icon: <BulbOutlined />
            };
        } else {
            return {
                message: "Don't give up! Take time to review the material and practice more.",
                color: "#ff4d4f",
                icon: <BulbOutlined />
            };
        }
    };

    const assessment = getAssessment();

    // Extract incorrect answers data for review section
    const extractIncorrectAnswersData = () => {
        if (!playedElements || playedElements.length === 0) {
            return null;
        }

        const incorrectTopicsMap = {}; // { topicName: { subtopics: Set, pdfs: Set, videos: Set, count: number } }
        const incorrectQuestions = []; // Store full question objects for reference

        console.log('SelfReflection - extractIncorrectAnswersData called with', playedElements.length, 'playedElements');
        console.log('SelfReflection - Full playedElements array:', playedElements);

        playedElements.forEach((element, index) => {
            const { Question, Correct } = element;

            // Debug: Log the element structure
            console.log(`SelfReflection - Element ${index + 1}:`, {
                hasQuestion: !!Question,
                QuestionId: Question?.Id,
                Correct: Correct,
                CorrectType: typeof Correct,
                CorrectValue: Correct,
                FullElement: element
            });

            // Only process incorrect answers
            // Handle both boolean and string "true"/"false" cases
            const isCorrect = Correct === true || Correct === "true" || Correct === 1;
            
            if (!Question || isCorrect) {
                if (Question && isCorrect) {
                    console.log(`SelfReflection - Skipping correct answer for Question ID: ${Question.Id} (Correct=${Correct})`);
                } else if (!Question) {
                    console.log(`SelfReflection - Skipping element ${index + 1} - No Question object`);
                }
                return;
            }

            // Debug: Log full Question object structure
            console.log(`SelfReflection - Processing incorrect answer ${index + 1}:`, {
                QuestionId: Question.Id,
                QuestionCode: Question.Code,
                HasExtension: !!Question.Extension,
                Extension: Question.Extension,
                ExtensionKeys: Question.Extension ? Object.keys(Question.Extension) : [],
                HasSubtopic: !!Question.Subtopic,
                Subtopic: Question.Subtopic
            });

            // Extract topic/subtopic (using Extension data if available)
            let topicName = null;
            let subtopicName = null;
            let pdfLink = null;
            let videoLink = null;

            // Check Extension data (handle both PascalCase and camelCase property names)
            if (Question.Extension) {
                const ext = Question.Extension;
                // Try both PascalCase and camelCase property names
                topicName = ext.Topic || ext.topic || null;
                subtopicName = ext.Sub_Topic || ext.sub_Topic || ext.SubTopic || ext.subTopic || null;
                pdfLink = ext.Link_Pdf || ext.link_Pdf || ext.LinkPdf || ext.linkPdf || null;
                videoLink = ext.Link_Videos || ext.link_Videos || ext.LinkVideos || ext.linkVideos || null;

                console.log(`SelfReflection - Extension data for Q${Question.Id}:`, {
                    topicName,
                    subtopicName,
                    pdfLink,
                    videoLink
                });
            }

            // Fallback to QuestionBase data if Extension doesn't have topic
            if (!topicName && Question.Subtopic) {
                const subtopic = Question.Subtopic;
                const topic = subtopic.Topic || subtopic.topic;
                topicName = topic?.Name || topic?.name || topic?.Code || topic?.code || 'Unknown Topic';
                subtopicName = subtopic?.Name || subtopic?.name || subtopic?.Code || subtopic?.code || 'Unknown Subtopic';
                console.log(`SelfReflection - Using QuestionBase data for Q${Question.Id}:`, { topicName, subtopicName });
            }

            if (topicName) {
                // Initialize topic if not exists
                if (!incorrectTopicsMap[topicName]) {
                    incorrectTopicsMap[topicName] = {
                        subtopics: new Set(),
                        pdfs: new Set(),
                        videos: new Set(),
                        count: 0
                    };
                }

                // Add subtopic
                if (subtopicName) {
                    incorrectTopicsMap[topicName].subtopics.add(subtopicName);
                }

                // Add PDF/video links from extension
                if (pdfLink && pdfLink.trim() !== '') {
                    incorrectTopicsMap[topicName].pdfs.add(pdfLink);
                }
                if (videoLink && videoLink.trim() !== '') {
                    incorrectTopicsMap[topicName].videos.add(videoLink);
                }

                // Increment count
                incorrectTopicsMap[topicName].count++;
                incorrectQuestions.push(Question);
            } else {
                console.warn(`SelfReflection - No topic found for incorrect Question ID: ${Question.Id}`);
            }
        });

        console.log('SelfReflection - Final incorrectTopicsMap:', incorrectTopicsMap);

        // Convert to display format
            const topics = Object.keys(incorrectTopicsMap).map(topicName => ({
                topic: topicName,
                subtopics: Array.from(incorrectTopicsMap[topicName].subtopics),
                pdfs: Array.from(incorrectTopicsMap[topicName].pdfs).map(url => ({
                    url: url,
                    type: 'pdf',
                    title: getPdfTitle(url, 'PDF')
                })),
                videos: Array.from(incorrectTopicsMap[topicName].videos).map(url => ({
                    url: url,
                    type: 'video',
                    title: getVideoTitle(url, 'Video')
                })),
                incorrectCount: incorrectTopicsMap[topicName].count
            }));

        return {
            topics: topics,
            totalIncorrect: incorrectQuestions.length
        };
    };

    // Extract performance data from playedElements
    const extractPerformanceData = () => {
        if (!playedElements || playedElements.length === 0) {
            return null;
        }

        const topics = {};
        const subtopics = {};
        const difficultyLevels = {};
        const questionTypes = {};
        const mistakes = [];

        playedElements.forEach((element) => {
            const { Question, Correct } = element;
            
            if (!Question) return;

            // Extract question type
            const questionType = Question.Type || 'Unknown';
            if (!questionTypes[questionType]) {
                questionTypes[questionType] = { correct: 0, incorrect: 0, total: 0 };
            }
            questionTypes[questionType].total++;
            if (Correct) {
                questionTypes[questionType].correct++;
            } else {
                questionTypes[questionType].incorrect++;
            }

            // Extract topic and subtopic
            // Priority: Use Extension data if available (for CourseMap 31), otherwise use QuestionBase data
            let topicName = null;
            let subtopicName = null;
            
            if (Question.Extension && Question.Extension.Topic) {
                // Use extension data (from QuestionMap31Extension table)
                topicName = Question.Extension.Topic;
                subtopicName = Question.Extension.Sub_Topic || null;
            } else if (Question.Subtopic) {
                // Fallback to QuestionBase data
                const subtopic = Question.Subtopic;
                const topic = subtopic.Topic;
                subtopicName = subtopic.Name || subtopic.Code || 'Unknown Subtopic';
                topicName = topic?.Name || topic?.Code || 'Unknown Topic';
            }

            if (topicName) {
                // Update topic stats
                if (!topics[topicName]) {
                    topics[topicName] = { correct: 0, incorrect: 0, total: 0 };
                }
                topics[topicName].total++;
                if (Correct) {
                    topics[topicName].correct++;
                } else {
                    topics[topicName].incorrect++;
                }

                // Update subtopic stats (only if subtopic exists)
                if (subtopicName) {
                    if (!subtopics[subtopicName]) {
                        subtopics[subtopicName] = { correct: 0, incorrect: 0, total: 0 };
                    }
                    subtopics[subtopicName].total++;
                    if (Correct) {
                        subtopics[subtopicName].correct++;
                    } else {
                        subtopics[subtopicName].incorrect++;
                    }
                }
            }

            // Extract difficulty level
            const difficultyName = Question.LevelOfDifficulty?.Name || 'Unknown Difficulty';
            
            if (!difficultyLevels[difficultyName]) {
                difficultyLevels[difficultyName] = { correct: 0, incorrect: 0, total: 0 };
            }
            difficultyLevels[difficultyName].total++;
            if (Correct) {
                difficultyLevels[difficultyName].correct++;
            } else {
                difficultyLevels[difficultyName].incorrect++;
            }

            // Track mistakes
            const isCorrect = Correct === true || Correct === "true" || Correct === 1;
            if (!isCorrect) {
                mistakes.push({
                    topic: topicName || 'Unknown',
                    subtopic: subtopicName || null,
                    difficulty: difficultyName,
                    questionType: questionType
                });
            }
        });

        return {
            overallSuccessRate: percentage,
            totalQuestions,
            correctCount,
            topics,
            subtopics,
            difficultyLevels,
            questionTypes,
            mistakes
        };
    };

    // Generate self-reflection data (goal judgments and learning pattern analysis)
    const generateSelfReflection = async () => {
        const performanceData = extractPerformanceData();
        
        if (!performanceData) {
            setSelfReflectionError('No performance data available');
            return;
        }

        if (!goals || goals.length === 0) {
            setSelfReflectionError('No goals available');
            return;
        }

        setLoadingSelfReflection(true);
        setSelfReflectionError(null);

        try {
            // Generate goal judgments
            let judgments;
            try {
                judgments = await generateGoalJudgmentsViaBackend(goals, performanceData);
            } catch (backendError) {
                console.log('Backend endpoint not available, using direct API call');
                judgments = await generateGoalJudgments(goals, performanceData);
            }
            setGoalJudgments(judgments);

            // Generate learning pattern analysis
            let analysis;
            try {
                analysis = await generateLearningPatternAnalysisViaBackend(performanceData);
            } catch (backendError) {
                console.log('Backend endpoint not available, using direct API call');
                analysis = await generateLearningPatternAnalysis(performanceData);
            }
            setLearningPatternAnalysis(analysis);
        } catch (error) {
            console.error('Error generating self-reflection:', error);
            setSelfReflectionError(error.message || 'Failed to generate self-reflection. Please try again.');
        } finally {
            setLoadingSelfReflection(false);
        }
    };

    // Extract incorrect answers data when playedElements changes
    useEffect(() => {
        if (playedElements && playedElements.length > 0) {
            const incorrectData = extractIncorrectAnswersData();
            setIncorrectAnswersData(incorrectData);
        }
    }, [playedElements]);

    // Auto-generate self-reflection when goals and playedElements are available
    useEffect(() => {
        if (goals && goals.length > 0 && playedElements && playedElements.length > 0 && !loadingSelfReflection && goalJudgments.length === 0) {
            generateSelfReflection();
        }
    }, [goals, playedElements]);

    // Don't auto-generate - let user choose to use it

    // Get status badge color
    const getStatusColor = (status) => {
        if (status === 'met') return '#52c41a';
        if (status === 'partially met') return '#faad14';
        return '#ff4d4f';
    };

    // Get status badge text
    const getStatusText = (status) => {
        if (status === 'met') return 'Met';
        if (status === 'partially met') return 'Partially Met';
        return 'Not Yet';
    };

    // Filter goals by status
    const metGoals = goalJudgments.filter(g => g.status === 'met');
    const partiallyMetGoals = goalJudgments.filter(g => g.status === 'partially met');
    const notMetGoals = goalJudgments.filter(g => g.status === 'not yet met');

    return (
        <Card
            style={{
                width: '100%',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                borderTop: `4px solid ${assessment.color}`
            }}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Self-Reflection Section - At the Top */}
                <div>
                    <Title level={3} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                        <AimOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                        Self Reflection
                    </Title>

                    {/* Goal Progress Section */}
                    {goals && goals.length > 0 && (
                        <div style={{ marginBottom: '24px' }}>
                            <Title level={4} style={{ marginBottom: '12px' }}>Goal Progress</Title>
                            
                            {loadingSelfReflection && (
                                <Card style={{ marginBottom: '16px' }}>
                                    <Space>
                                        <Spin />
                                        <Text>Analyzing your goals...</Text>
                                    </Space>
                                </Card>
                            )}

                            {selfReflectionError && (
                                <Alert
                                    message="Could not generate goal analysis"
                                    description={selfReflectionError}
                                    type="warning"
                                    action={
                                        <Button 
                                            size="small" 
                                            icon={<ReloadOutlined />}
                                            onClick={generateSelfReflection}
                                        >
                                            Retry
                                        </Button>
                                    }
                                    closable
                                    onClose={() => setSelfReflectionError(null)}
                                    style={{ marginBottom: '16px' }}
                                />
                            )}

                            {goalJudgments.length > 0 && !loadingSelfReflection && (
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    {goalJudgments.map((judgment, index) => (
                                        <Card 
                                            key={index}
                                            style={{ 
                                                borderLeft: `3px solid ${getStatusColor(judgment.status)}`,
                                                backgroundColor: judgment.status === 'met' ? '#f6ffed' : 
                                                               judgment.status === 'partially met' ? '#fffbe6' : '#fff1f0'
                                            }}
                                        >
                                            <Space align="start" style={{ width: '100%' }}>
                                                <Checkbox checked={judgment.status === 'met'} disabled />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                                                        <Text strong style={{ marginRight: '8px' }}>{judgment.goal}</Text>
                                                        <Tag color={getStatusColor(judgment.status)}>
                                                            {getStatusText(judgment.status)}
                                                        </Tag>
                                                    </div>
                                                    <Text type="secondary" style={{ fontSize: '13px' }}>
                                                        {judgment.explanation}
                                                    </Text>
                                                </div>
                                            </Space>
                                        </Card>
                                    ))}
                                </Space>
                            )}
                        </div>
                    )}

                    {/* Learning Pattern Analysis Section */}
                    <div style={{ marginBottom: '24px' }}>
                        <Title level={4} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                            <BulbOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                            Learning Pattern Analysis
                        </Title>
                        
                        {loadingSelfReflection && !learningPatternAnalysis && (
                            <Card>
                                <Space>
                                    <Spin />
                                    <Text>Analyzing your learning patterns...</Text>
                                </Space>
                            </Card>
                        )}

                        {learningPatternAnalysis && !loadingSelfReflection && (
                            <Card 
                                style={{ 
                                    backgroundColor: '#f0f7ff',
                                    borderLeft: '3px solid #1890ff'
                                }}
                            >
                                <Paragraph style={{ marginBottom: 0, fontSize: '14px', lineHeight: '1.6' }}>
                                    {learningPatternAnalysis}
                                </Paragraph>
                            </Card>
                        )}
                    </div>
                </div>

                <Divider />

                {/* Mistakes Section */}
                {incorrectAnswersData && incorrectAnswersData.topics.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                        <Title level={4} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                            <CloseCircleOutlined style={{ marginRight: '8px', color: '#ff4d4f' }} />
                            Mistakes
                        </Title>
                        <Paragraph type="secondary" style={{ marginBottom: '12px', fontSize: '13px' }}>
                            You answered <Text strong style={{ color: '#ff4d4f' }}>{incorrectAnswersData.totalIncorrect}</Text> question(s) incorrectly. 
                            Review these topics and resources to improve your understanding.
                        </Paragraph>

                        <Row gutter={[12, 12]}>
                            {incorrectAnswersData.topics.map((topicData, index) => (
                                <Col xs={24} sm={12} key={index}>
                                    <Card 
                                        size="small"
                                        style={{ 
                                            borderLeft: '3px solid #ff4d4f',
                                            backgroundColor: '#fff1f0',
                                            height: '100%'
                                        }}
                                    >
                                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                            {/* Topic header with count */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                                <Title level={5} style={{ margin: 0, color: '#ff4d4f', fontSize: '14px' }}>
                                                    {topicData.topic}
                                                </Title>
                                                <Tag color="red" style={{ fontSize: '11px', margin: 0 }}>
                                                    {topicData.incorrectCount} incorrect
                                                </Tag>
                                            </div>

                                            {/* Subtopics */}
                                            {topicData.subtopics.length > 0 && (
                                                <div style={{ marginTop: '4px' }}>
                                                    <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: '2px' }}>
                                                        Subtopics:
                                                    </Text>
                                                    <Space wrap size={[4, 4]}>
                                                        {topicData.subtopics.map((subtopic, subIndex) => (
                                                            <Tag key={subIndex} color="orange" style={{ fontSize: '11px', margin: 0 }}>
                                                                {subtopic}
                                                            </Tag>
                                                        ))}
                                                    </Space>
                                                </div>
                                            )}

                                            {/* PDF and Video Resources */}
                                            {(topicData.pdfs.length > 0 || topicData.videos.length > 0) && (
                                                <div style={{ marginTop: '8px' }}>
                                                    <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                                        Resources:
                                                    </Text>
                                                    <Row gutter={[4, 4]}>
                                                        {/* PDF Cards */}
                                                        {topicData.pdfs.map((pdf, pdfIndex) => (
                                                            <Col xs={24} sm={12} key={`pdf-${index}-${pdfIndex}`}>
                                                                <Card
                                                                    size="small"
                                                                    hoverable
                                                                    style={{
                                                                        border: '1px solid #ffccc7',
                                                                        borderRadius: '4px',
                                                                        backgroundColor: '#fff',
                                                                        padding: '4px'
                                                                    }}
                                                                    bodyStyle={{ padding: '8px' }}
                                                                    onClick={() => window.open(pdf.url, '_blank', 'noopener,noreferrer')}
                                                                >
                                                                    <Space size="small">
                                                                        <FilePdfOutlined style={{ fontSize: '14px', color: '#ff4d4f' }} />
                                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                                                <Text strong style={{ fontSize: '11px', display: 'block' }}>
                                                                                    {pdf.title || getPdfTitle(pdf.url, 'PDF')}
                                                                                </Text>
                                                                        </div>
                                                                    </Space>
                                                                </Card>
                                                            </Col>
                                                        ))}
                                                        {/* Video Cards */}
                                                        {topicData.videos.map((video, videoIndex) => (
                                                            <Col xs={24} sm={12} key={`video-${index}-${videoIndex}`}>
                                                                <Card
                                                                    size="small"
                                                                    hoverable
                                                                    style={{
                                                                        border: '1px solid #ffccc7',
                                                                        borderRadius: '4px',
                                                                        backgroundColor: '#fff',
                                                                        padding: '4px'
                                                                    }}
                                                                    bodyStyle={{ padding: '8px' }}
                                                                    onClick={() => window.open(video.url, '_blank', 'noopener,noreferrer')}
                                                                >
                                                                    <Space size="small">
                                                                        <PlayCircleOutlined style={{ fontSize: '14px', color: '#1890ff' }} />
                                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                                            <Text strong style={{ fontSize: '11px', display: 'block' }}>
                                                                                {video.title || getVideoTitle(video.url, 'Video')}
                                                                            </Text>
                                                                        </div>
                                                                    </Space>
                                                                </Card>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </div>
                                            )}

                                            {/* Show message if no resources available */}
                                            {topicData.pdfs.length === 0 && topicData.videos.length === 0 && (
                                                <Text type="secondary" style={{ fontSize: '11px', fontStyle: 'italic' }}>
                                                    No additional resources available.
                                                </Text>
                                            )}
                                        </Space>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}

                <Divider />

                {/* Which Goals You Achieve Section */}
                {goalJudgments.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                        <Title level={4} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                            <TrophyOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                            Which Goals You Achieve
                        </Title>
                        
                        {metGoals.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong style={{ color: '#52c41a', fontSize: '14px' }}>Met ({metGoals.length})</Text>
                                <Space direction="vertical" size="small" style={{ width: '100%', marginTop: '8px' }}>
                                    {metGoals.map((judgment, index) => (
                                        <Card key={index} size="small" style={{ backgroundColor: '#f6ffed', borderLeft: '3px solid #52c41a' }}>
                                            <Space>
                                                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                                <Text>{judgment.goal}</Text>
                                            </Space>
                                        </Card>
                                    ))}
                                </Space>
                            </div>
                        )}

                        {partiallyMetGoals.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                                <Text strong style={{ color: '#faad14', fontSize: '14px' }}>Partially Met ({partiallyMetGoals.length})</Text>
                                <Space direction="vertical" size="small" style={{ width: '100%', marginTop: '8px' }}>
                                    {partiallyMetGoals.map((judgment, index) => (
                                        <Card key={index} size="small" style={{ backgroundColor: '#fffbe6', borderLeft: '3px solid #faad14' }}>
                                            <Space>
                                                <BulbOutlined style={{ color: '#faad14' }} />
                                                <Text>{judgment.goal}</Text>
                                            </Space>
                                        </Card>
                                    ))}
                                </Space>
                            </div>
                        )}

                        {notMetGoals.length > 0 && (
                            <div>
                                <Text strong style={{ color: '#ff4d4f', fontSize: '14px' }}>Not Yet Met ({notMetGoals.length})</Text>
                                <Space direction="vertical" size="small" style={{ width: '100%', marginTop: '8px' }}>
                                    {notMetGoals.map((judgment, index) => (
                                        <Card key={index} size="small" style={{ backgroundColor: '#fff1f0', borderLeft: '3px solid #ff4d4f' }}>
                                            <Space>
                                                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                                                <Text>{judgment.goal}</Text>
                                            </Space>
                                        </Card>
                                    ))}
                                </Space>
                            </div>
                        )}
                    </div>
                )}

                <Divider />

                {/* Overall Performance Summary */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', color: assessment.color, marginBottom: '8px' }}>
                        {assessment.icon}
                    </div>
                    <Title level={3} style={{ marginBottom: '8px' }}>Your Performance</Title>
                    <div style={{ marginBottom: '16px' }}>
                        <Text strong style={{ fontSize: '24px', color: assessment.color }}>
                            Your Success Rate: {correctCount}/{totalQuestions}
                        </Text>
                        <div style={{ marginTop: '12px' }}>
                            <Progress 
                                percent={percentage} 
                                strokeColor={assessment.color}
                                format={() => `${percentage}%`}
                                style={{ maxWidth: '300px', margin: '0 auto' }}
                            />
                        </div>
                    </div>
                    <Paragraph 
                        style={{ 
                            fontSize: '16px', 
                            color: assessment.color,
                            fontWeight: '500',
                            marginBottom: '24px'
                        }}
                    >
                        {assessment.message}
                    </Paragraph>
                </div>

            </Space>
        </Card>
    );
}
