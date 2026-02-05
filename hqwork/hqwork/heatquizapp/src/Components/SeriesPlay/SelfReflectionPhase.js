import React, { useState, useEffect } from "react";
import { Card, Space, Typography, Progress, Spin, Alert, Button, Row, Col, Tag, Divider } from "antd";
import { CheckCircleOutlined, TrophyOutlined, BulbOutlined, ReloadOutlined, RobotOutlined, FilePdfOutlined, PlayCircleOutlined, ExclamationCircleOutlined, AimOutlined, CloseCircleOutlined, StarFilled, ClockCircleOutlined, AreaChartOutlined } from '@ant-design/icons';
import { generateGoalJudgments, generateGoalJudgmentsViaBackend, generateLearningPatternAnalysis, generateLearningPatternAnalysisViaBackend } from "../../services/LLMService";
import { getPdfTitle, getVideoTitle } from "../../services/ResourceTitles";
import { map31Telemetry } from "../../services/Map31Telemetry";
import { useAuth } from "../../contexts/AuthContext";
import { LatexRenderer } from "../LatexRenderer";
import { DisplayClickableQuestionAnswers } from "./DisplayClickableQuestionAnswers";
import { ViewSolutionComponent } from "../ViewSolutionComponent";
import { CLICKABLE_QUESTION_PARAMETER, DIAGRAM_QUESTION_PARAMETER, ENERGY_BALANCE_QUESTION_PARAMETER, FBD_QUESTION_PARAMETER, KEYBOARD_QUESTION_PARAMETER, MULTIPLE_CHOICE_QUESTION_PARAMETER, PV_DIAGRAM_QUESTION_PARAMETER } from "../../Pages/Questions/List/constants";

const { Title, Text, Paragraph } = Typography;

export function SelfReflectionPhase({ totalQuestions, correctCount, playedElements, goals = [], seriesStatistics, seriesElements = [] }) {
    const { currentPlayerKey } = useAuth();
    const [goalJudgments, setGoalJudgments] = useState([]);
    const [learningPatternAnalysis, setLearningPatternAnalysis] = useState(null);
    const [loadingSelfReflection, setLoadingSelfReflection] = useState(false);
    const [selfReflectionError, setSelfReflectionError] = useState(null);
    const pageStartRef = React.useRef(Date.now());
    
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
            map31Telemetry.ensureSession({ player: currentPlayerKey || null });
            map31Telemetry.track({
                page: 'self_reflection',
                section: 'goal_progress',
                eventName: 'llm_generate_start',
                targetType: 'llm',
                targetId: 'goal_judgments'
            });
            // Generate goal judgments
            let judgments;
            try {
                judgments = await generateGoalJudgmentsViaBackend(goals, performanceData);
            } catch (backendError) {
                console.log('Backend endpoint not available, using direct API call');
                judgments = await generateGoalJudgments(goals, performanceData);
            }
            setGoalJudgments(judgments);
            map31Telemetry.track({
                page: 'self_reflection',
                section: 'goal_progress',
                eventName: 'llm_generate_success',
                targetType: 'llm',
                targetId: 'goal_judgments'
            });

            // Generate learning pattern analysis
            map31Telemetry.track({
                page: 'self_reflection',
                section: 'learning_pattern_analysis',
                eventName: 'llm_generate_start',
                targetType: 'llm',
                targetId: 'learning_pattern_analysis'
            });
            let analysis;
            try {
                analysis = await generateLearningPatternAnalysisViaBackend(performanceData);
            } catch (backendError) {
                console.log('Backend endpoint not available, using direct API call');
                analysis = await generateLearningPatternAnalysis(performanceData);
            }
            setLearningPatternAnalysis(analysis);
            map31Telemetry.track({
                page: 'self_reflection',
                section: 'learning_pattern_analysis',
                eventName: 'llm_generate_success',
                targetType: 'llm',
                targetId: 'learning_pattern_analysis'
            });
        } catch (error) {
            console.error('Error generating self-reflection:', error);
            setSelfReflectionError(error.message || 'Failed to generate self-reflection. Please try again.');
            map31Telemetry.track({
                page: 'self_reflection',
                section: 'goal_progress',
                eventName: 'llm_generate_fail',
                targetType: 'llm',
                targetId: 'self_reflection',
                metadata: { message: error?.message || String(error) }
            });
        } finally {
            setLoadingSelfReflection(false);
            map31Telemetry.flush();
        }
    };

    // Auto-generate self-reflection when goals and playedElements are available
    useEffect(() => {
        if (goals && goals.length > 0 && playedElements && playedElements.length > 0 && !loadingSelfReflection && goalJudgments.length === 0) {
            generateSelfReflection();
        }
    }, [goals, playedElements]);

    useEffect(() => {
        map31Telemetry.ensureSession({
            player: currentPlayerKey || null,
            isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : null,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        }, true);

        map31Telemetry.track({
            page: 'self_reflection',
            section: 'performance_summary',
            eventName: 'page_view'
        });

        const onVisibility = () => {
            if (document.visibilityState === 'hidden') {
                map31Telemetry.flush();
            }
        };
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            const durationMs = Date.now() - pageStartRef.current;
            map31Telemetry.track({
                page: 'self_reflection',
                section: 'performance_summary',
                eventName: 'page_exit',
                durationMs
            });
            map31Telemetry.endSession({ totalDurationMs: durationMs });
            map31Telemetry.flush();
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    // Don't auto-generate - let user choose to use it

    return (
        <Card
            style={{
                width: '100%',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                borderTop: `4px solid ${assessment.color}`
            }}
        >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {/* Overall Performance Summary - Compact at Top */}
                <div style={{ textAlign: 'center', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <Title level={3} style={{ marginBottom: '12px' }}>Your Performance</Title>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '32px', color: assessment.color }}>
                            {assessment.icon}
                        </div>
                        <div>
                            <Text strong style={{ fontSize: '18px', color: assessment.color }}>
                                {correctCount}/{totalQuestions} ({percentage}%)
                            </Text>
                            <div style={{ marginTop: '4px' }}>
                                <Progress 
                                    percent={percentage} 
                                    strokeColor={assessment.color}
                                    format={() => `${percentage}%`}
                                    style={{ width: '120px' }}
                                    size="small"
                                />
                            </div>
                        </div>
                    </div>
                    <Text style={{ fontSize: '13px', color: assessment.color, marginTop: '8px', display: 'block' }}>
                        {assessment.message}
                    </Text>
                </div>

                {/* Self-Reflection Section */}
                <div>
                    <Title level={3} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                        <AimOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                        Reflect on Your Performance
                    </Title>

                    {/* Goal Progress Section */}
                    {goals && goals.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                            <Title level={4} style={{ marginBottom: '8px' }}>Goal Progress</Title>
                            
                            {loadingSelfReflection && (
                                <Card style={{ marginBottom: '12px' }}>
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
                                    style={{ marginBottom: '12px' }}
                                />
                            )}

                            {goalJudgments.length > 0 && !loadingSelfReflection && (
                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <Text type="secondary" style={{ fontSize: '11px', fontStyle: 'italic', marginBottom: '4px' }}>
                                        <RobotOutlined style={{ marginRight: '4px' }} />
                                        AI-generated reflection questions
                                    </Text>
                                    {goalJudgments.map((judgment, index) => (
                                        <Card 
                                            key={index}
                                            size="small"
                                            style={{ 
                                                borderLeft: '3px solid #1890ff'
                                            }}
                                        >
                                            <Space align="start" style={{ width: '100%' }}>
                                                <div style={{ flex: 1 }}>
                                                    <Text strong style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                                                        {judgment.goal}
                                                    </Text>
                                                    {(() => {
                                                        const parts = judgment.explanation.split('|||');
                                                        const factualPart = parts[0]?.trim() || '';
                                                        const questionPart = parts[1]?.trim() || '';
                                                        
                                                        return (
                                                            <div>
                                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                    {factualPart}
                                                                </Text>
                                                                {questionPart && (
                                                                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e8e8e8' }}>
                                                                        <Text strong style={{ fontSize: '12px', color: '#1890ff', display: 'block' }}>
                                                                            {questionPart}
                                                                        </Text>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </Space>
                                        </Card>
                                    ))}
                                </Space>
                            )}
                        </div>
                    )}

                    {/* Learning Pattern Analysis Section */}
                    <div style={{ marginBottom: '16px' }}>
                        <Title level={4} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                            <BulbOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                            Learning Pattern Analysis
                        </Title>
                        
                        {loadingSelfReflection && !learningPatternAnalysis && (
                            <Card size="small">
                                <Space>
                                    <Spin />
                                    <Text>Analyzing your learning patterns...</Text>
                                </Space>
                            </Card>
                        )}

                        {learningPatternAnalysis && !loadingSelfReflection && (
                            <Card 
                                size="small"
                                style={{ 
                                    backgroundColor: '#f0f7ff',
                                    borderLeft: '3px solid #1890ff'
                                }}
                            >
                                <Paragraph style={{ marginBottom: 0, fontSize: '13px', lineHeight: '1.5' }}>
                                    {learningPatternAnalysis}
                                </Paragraph>
                            </Card>
                        )}
                    </div>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                {/* Question Recap Section */}
                {playedElements && playedElements.length > 0 && (
                    <div>
                        <Title level={3} style={{ marginBottom: '12px', marginTop: '8px' }}>Question Recap</Title>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            {playedElements.map((element, index) => {
                                const { Question, Correct, Score, Time, Answers } = element;
                                const isCorrect = Correct === true || Correct === "true" || Correct === 1;
                                
                                // Get stats from seriesStatistics
                                let questionStats = null;
                                if (seriesStatistics && seriesStatistics.ElementStats && seriesElements[index]) {
                                    const elementId = seriesElements[index].Id;
                                    questionStats = seriesStatistics.ElementStats.find(stat => stat.Id === elementId);
                                }

                                // Calculate stats
                                const xp = Math.trunc(parseFloat(Score) * 10);
                                const timeTaken = Math.ceil(Time / 1000); // Convert to seconds
                                const successRate = questionStats ? Math.round((questionStats.TotalSuccessPlay / (questionStats.TotalPlay + 1)) * 100) : 0;
                                const medianTime = questionStats ? questionStats.MedianPlayTime : 0;

                                // Extract topic and subtopic
                                let topicName = null;
                                let subtopicName = null;
                                let pdfLink = null;
                                let videoLink = null;

                                if (Question.Extension) {
                                    topicName = Question.Extension.Topic || Question.Extension.topic || null;
                                    subtopicName = Question.Extension.Sub_Topic || Question.Extension.sub_Topic || Question.Extension.SubTopic || Question.Extension.subTopic || null;
                                    pdfLink = Question.Extension.Link_Pdf || Question.Extension.link_Pdf || Question.Extension.LinkPdf || Question.Extension.linkPdf || null;
                                    videoLink = Question.Extension.Link_Videos || Question.Extension.link_Videos || Question.Extension.LinkVideos || Question.Extension.linkVideos || null;
                                }

                                if (!topicName && Question.Subtopic) {
                                    const subtopic = Question.Subtopic;
                                    const topic = subtopic.Topic || subtopic.topic;
                                    topicName = topic?.Name || topic?.name || topic?.Code || topic?.code || 'Unknown Topic';
                                    subtopicName = subtopic?.Name || subtopic?.name || subtopic?.Code || subtopic?.code || 'Unknown Subtopic';
                                }

                                // Render question preview based on type
                                const renderQuestionPreview = () => {
                                    const { Type } = Question;
                                    
                                    if (Type === KEYBOARD_QUESTION_PARAMETER) {
                                        return renderKeyboardQuestionPreview(element, index);
                                    } else if (Type === CLICKABLE_QUESTION_PARAMETER) {
                                        return renderClickableQuestionPreview(element, index);
                                    } else if (Type === MULTIPLE_CHOICE_QUESTION_PARAMETER) {
                                        return renderMultipleChoiceQuestionPreview(element, index);
                                    } else if (Type === ENERGY_BALANCE_QUESTION_PARAMETER || 
                                               Type === DIAGRAM_QUESTION_PARAMETER || 
                                               Type === FBD_QUESTION_PARAMETER || 
                                               Type === PV_DIAGRAM_QUESTION_PARAMETER) {
                                        return renderImageBasedQuestionPreview(element, index);
                                    }
                                    return null;
                                };

                                return (
                                    <Card
                                        key={index}
                                        size="small"
                                        style={{
                                            borderLeft: `3px solid ${isCorrect ? '#52c41a' : '#ff4d4f'}`
                                        }}
                                    >
                                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                            {/* Header with question number and status */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Text strong style={{ fontSize: '14px' }}>
                                                        {index + 1}. {Question.Code || `Question ${index + 1}`}
                                                    </Text>
                                                    {isCorrect ? (
                                                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                                                    ) : (
                                                        <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />
                                                    )}
                                                </div>
                                                {(topicName || subtopicName) && (
                                                    <Space wrap size={[4, 4]}>
                                                        {topicName && <Tag style={{ fontSize: '11px' }}>{topicName}</Tag>}
                                                        {subtopicName && <Tag color="blue" style={{ fontSize: '11px' }}>{subtopicName}</Tag>}
                                                    </Space>
                                                )}
                                            </div>

                                            {/* Question Preview */}
                                            <div style={{ marginTop: '6px' }}>
                                                {renderQuestionPreview()}
                                            </div>

                                            {/* Stats */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '6px' }}>
                                                <Space size="small">
                                                    <StarFilled style={{ color: '#faad14' }} />
                                                    <Text>{xp} XP</Text>
                                                </Space>
                                                <Space size="small">
                                                    <ClockCircleOutlined />
                                                    <Text>{timeTaken}s</Text>
                                                </Space>
                                                {successRate > 0 && (
                                                    <Space size="small">
                                                        <AreaChartOutlined style={{ color: '#52c41a' }} />
                                                        <Text>{successRate}%</Text>
                                                    </Space>
                                                )}
                                                {medianTime > 0 && (
                                                    <Space size="small">
                                                        <ClockCircleOutlined style={{ color: '#1890ff' }} />
                                                        <Text type="secondary">Median: {medianTime}s</Text>
                                                    </Space>
                                                )}
                                            </div>

                                            {/* Solution and Review Materials (only for incorrect) */}
                                            {!isCorrect && (
                                                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f0f0f0' }}>
                                                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                        {Question.PDFURL && (
                                                            <ViewSolutionComponent 
                                                                question={Question}
                                                                correct={false}
                                                            />
                                                        )}
                                                        
                                                        {(pdfLink || videoLink) && (
                                                            <div>
                                                                <Text strong style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                                                                    Review Materials:
                                                                </Text>
                                                                <Space wrap size={[6, 6]}>
                                                                    {pdfLink && (
                                                                        <Button
                                                                            size="small"
                                                                            icon={<FilePdfOutlined />}
                                                                            onClick={() => {
                                                                                map31Telemetry.track({
                                                                                    page: 'self_reflection',
                                                                                    section: 'question_recap',
                                                                                    eventName: 'resource_open',
                                                                                    targetType: 'resource',
                                                                                    targetId: `question_pdf_${index}`,
                                                                                    url: pdfLink,
                                                                                    metadata: { resource_type: 'pdf', title: getPdfTitle(pdfLink, 'PDF') }
                                                                                });
                                                                                map31Telemetry.flush();
                                                                                window.open(pdfLink, '_blank', 'noopener,noreferrer');
                                                                            }}
                                                                        >
                                                                            {getPdfTitle(pdfLink, 'PDF')}
                                                                        </Button>
                                                                    )}
                                                                    {videoLink && (
                                                                        <Button
                                                                            size="small"
                                                                            icon={<PlayCircleOutlined />}
                                                                            onClick={() => {
                                                                                map31Telemetry.track({
                                                                                    page: 'self_reflection',
                                                                                    section: 'question_recap',
                                                                                    eventName: 'resource_open',
                                                                                    targetType: 'resource',
                                                                                    targetId: `question_video_${index}`,
                                                                                    url: videoLink,
                                                                                    metadata: { resource_type: 'video', title: getVideoTitle(videoLink, 'Video') }
                                                                                });
                                                                                map31Telemetry.flush();
                                                                                window.open(videoLink, '_blank', 'noopener,noreferrer');
                                                                            }}
                                                                        >
                                                                            {getVideoTitle(videoLink, 'Video')}
                                                                        </Button>
                                                                    )}
                                                                </Space>
                                                            </div>
                                                        )}
                                                    </Space>
                                                </div>
                                            )}
                                        </Space>
                                    </Card>
                                );
                            })}
                        </Space>
                    </div>
                )}

            </Space>
        </Card>
    );
}

// Question Preview Rendering Functions
const renderKeyboardQuestionPreview = (element, index) => {
    if (!element) return null;

    const { Question, Answers, Correct } = element;
    const { Base_ImageURL, Code, Latex, Answers: correctAnswers } = Question;
    const isCorrect = Correct === true || Correct === "true" || Correct === 1;

    const reducedLatex = Answers && Answers[0] && Answers[0].List 
        ? Answers[0].List.reduce((a, b) => a += ' ' + (b.code === '*' ? '\\cdot' : b.code), '') || '-'
        : '-';

    return (
        <Space size="large" align="start">
            {Base_ImageURL && (
                <div>
                    <img 
                        src={Base_ImageURL}
                        alt={Code}
                        style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '4px' }}
                    />
                </div>
            )}
            <div>
                {Latex && <LatexRenderer latex={Latex} />}
                <div style={{ marginTop: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Your answer: </Text>
                    <LatexRenderer latex={"$$" + reducedLatex + "$$"} />
                </div>
                {!isCorrect && correctAnswers && correctAnswers.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                        <Text type="secondary" style={{ fontSize: '12px', color: '#52c41a' }}>Correct answer(s): </Text>
                        {correctAnswers.map((a, ai) => {
                            const answerReduced = a.AnswerElements
                                ?.sort((c, d) => c.Id > d.Id ? 1 : -1)
                                .reduce((acc, b) => acc += ' ' + (b.TextPresentation || (b.Value === '*' ? '\\cdot' : b.Value)), '') || '-';
                            return (
                                <div key={ai}>
                                    <LatexRenderer latex={"$$" + answerReduced + "$$"} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Space>
    );
};

const renderClickableQuestionPreview = (element, index) => {
    if (!element) return null;

    const { Question, Answers } = element;

    return (
        <Row gutter={[8, 8]}>
            <Col xs={24} sm={12}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Your answer(s)</Text>
                <DisplayClickableQuestionAnswers 
                    Question={Question}
                    Answers={Answers}
                />
            </Col>
            <Col xs={24} sm={12}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Correct answer(s)</Text>
                <DisplayClickableQuestionAnswers 
                    Question={Question}
                />
            </Col>
        </Row>
    );
};

const renderMultipleChoiceQuestionPreview = (element, index) => {
    if (!element) return null;

    const { Question, Answers } = element;
    const { Base_ImageURL, Code, Choices, Latex } = Question;

    return (
        <Space size="large" align="start">
            {Base_ImageURL && (
                <div>
                    <img 
                        src={Base_ImageURL}
                        alt={Code}
                        style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '4px' }}
                    />
                </div>
            )}
            <div>
                {Latex && <LatexRenderer latex={Latex} />}
                {Choices && (
                    <div style={{ marginTop: '8px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Selected: </Text>
                        {Answers && Answers.length > 0 ? (
                            <Text>{Answers.map((a, i) => Choices.findIndex(c => c.Id === a.Id) + 1).join(', ')}</Text>
                        ) : (
                            <Text type="secondary">None</Text>
                        )}
                    </div>
                )}
            </div>
        </Space>
    );
};

const renderImageBasedQuestionPreview = (element, index) => {
    if (!element) return null;

    const { Question } = element;
    const { Base_ImageURL, Code, QuestionText } = Question;

    return (
        <Space size="large" align="start">
            {Base_ImageURL && (
                <div>
                    <img 
                        src={Base_ImageURL}
                        alt={Code}
                        style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '4px' }}
                    />
                </div>
            )}
            {QuestionText && (
                <div>
                    <LatexRenderer latex={QuestionText} />
                </div>
            )}
        </Space>
    );
};
