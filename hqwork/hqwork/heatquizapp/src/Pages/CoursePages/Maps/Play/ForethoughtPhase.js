import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Form, Input, Space, Typography, Spin, Tag, Divider, Row, Col, Checkbox, Progress, Tooltip } from "antd";
import { RocketOutlined, CheckCircleOutlined, BookOutlined, FilePdfOutlined, PlayCircleOutlined, LinkOutlined, ReadOutlined, CheckOutlined, BulbOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { pdfjs } from 'react-pdf';
import { getPdfTitle, getVideoTitle } from "../../../../services/ResourceTitles";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Configure PDF.js worker - use local file from public folder to avoid CORS issues
// The worker file is now in public/pdf.worker.min.js
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL || ''}/pdf.worker.min.js`;

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Helper function to get YouTube thumbnail URL
const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return null;
};

// PDF Thumbnail Component
const PDFThumbnail = ({ url }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        const renderThumbnail = async () => {
            try {
                setLoading(true);
                setError(false);
                const loadingTask = pdfjs.getDocument({ url, httpHeaders: { 'Access-Control-Allow-Origin': '*' } });
                const pdf = await loadingTask.promise;
                
                if (pdf.numPages > 0) {
                    const page = await pdf.getPage(1);
                    const viewport = page.getViewport({ scale: 0.5 });
                    const canvas = canvasRef.current;
                    if (canvas) {
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        const context = canvas.getContext('2d');
                        await page.render({ canvasContext: context, viewport }).promise;
                    }
                }
                setLoading(false);
            } catch (err) {
                console.error('Error loading PDF:', err);
                setError(true);
                setLoading(false);
            }
        };

        renderThumbnail();
    }, [url]);

    if (error || loading) {
        return (
            <div style={{ 
                width: '80px', 
                height: '60px', 
                backgroundColor: '#f0f0f0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '4px'
            }}>
                {loading ? <Spin size="small" /> : <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />}
            </div>
        );
    }

    return (
        <canvas 
            ref={canvasRef}
            style={{ 
                width: '80px', 
                height: 'auto', 
                maxHeight: '60px',
                borderRadius: '4px',
                objectFit: 'cover'
            }}
        />
    );
};

// Video Thumbnail Component
const VideoThumbnail = ({ url }) => {
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Check if it's a YouTube video
        const ytThumbnail = getYouTubeThumbnail(url);
        if (ytThumbnail) {
            setThumbnailUrl(ytThumbnail);
            setLoading(false);
            return;
        }

        // For other videos, try to capture a frame
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.preload = 'metadata';
        
        video.onloadedmetadata = () => {
            video.currentTime = 1; // Seek to 1 second
        };

        video.onseeked = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
                setThumbnailUrl(thumbnail);
                setLoading(false);
            } catch (err) {
                console.error('Error capturing video frame:', err);
                setError(true);
                setLoading(false);
            }
        };

        video.onerror = () => {
            setError(true);
            setLoading(false);
        };

        video.src = url;

        return () => {
            video.src = '';
        };
    }, [url]);

    if (error || (loading && !thumbnailUrl)) {
        return (
            <div style={{ 
                width: '80px', 
                height: '60px', 
                backgroundColor: '#f0f0f0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '4px'
            }}>
                {loading ? <Spin size="small" /> : <PlayCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
            </div>
        );
    }

    if (thumbnailUrl) {
        return (
            <img 
                src={thumbnailUrl}
                alt="Video thumbnail"
                style={{ 
                    width: '80px', 
                    height: '60px', 
                    objectFit: 'cover',
                    borderRadius: '4px'
                }}
                onError={() => setError(true)}
            />
        );
    }

    return null;
};

export function ForethoughtPhase({ onComplete, mapElementName, topicsSubtopics, isLoadingTopics, preparationResources }) {
    const [form] = Form.useForm();
    const [selectedGoals, setSelectedGoals] = useState([]);
    const [showOptionalSections, setShowOptionalSections] = useState(false);

    // Get the topic to use in goals - use mapElementName (quiz title) as the topic
    const quizTopic = mapElementName || 'this quiz';

    // Predefined goals with [TOPIC] placeholder - categorized for better UX
    const predefinedGoals = [
        { text: `Understand the core concepts behind ${quizTopic}.`, category: 'understanding' },
        { text: `Solve typical problems related to ${quizTopic}.`, category: 'application' },
        { text: 'Follow a clear problem-solving approach.', category: 'process' },
        { text: 'Check how well I understand the material.', category: 'assessment' },
        { text: 'Avoid mistakes I made before.', category: 'improvement' },
        { text: 'Identify topics I need to review before class.', category: 'preparation' }
    ];

    const handleGoalChange = (checkedValues) => {
        setSelectedGoals(checkedValues);
    };

    // Calculate completion progress for visual feedback
    const calculateProgress = () => {
        let progress = 0;
        
        if (topicsSubtopics && topicsSubtopics.length > 0) progress += 33;
        if (selectedGoals.length > 0) progress += 33;
        if (showOptionalSections) progress += 34;
        
        return progress;
    };

    const handleSubmit = () => {
        const formValues = form.getFieldsValue();
        // Map selected goal indices to actual goal text
        const goals = selectedGoals.map(index => predefinedGoals[index].text);
        // Add custom goal if provided
        if (formValues.customGoal && formValues.customGoal.trim()) {
            goals.push(formValues.customGoal.trim());
        }
        onComplete({
            goals: goals,
            expectations: formValues.expectations || '',
            strategies: formValues.strategies || ''
        });
    };

    const canProceed = selectedGoals.length > 0 || form.getFieldValue('customGoal');

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '16px',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh'
        }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: '700px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                bodyStyle={{ padding: '20px' }}
            >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {/* Header with Progress Indicator */}
                    <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                        <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: '#e6f4ff',
                            marginBottom: '12px'
                        }}>
                            <RocketOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                        </div>
                        <Title level={3} style={{ margin: '0 0 6px 0', fontSize: '20px' }}>
                            Quiz Preparation
                        </Title>
                        {mapElementName && (
                            <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                                {mapElementName}
                            </Text>
                        )}
                        <Progress 
                            percent={calculateProgress()} 
                            showInfo={false} 
                            strokeColor="#52c41a"
                            style={{ maxWidth: '200px', margin: '0 auto' }}
                            size="small"
                        />
                        <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>
                            Quick setup • Takes less than 2 minutes
                        </Text>
                    </div>

                    {/* Topics Recap Section */}
                    {(topicsSubtopics && topicsSubtopics.length > 0) && (
                        <>
                            <Divider style={{ margin: '12px 0' }} />
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#fafafa',
                                borderRadius: '6px',
                                border: '1px solid #e8e8e8'
                            }}>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    marginBottom: '10px'
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '6px',
                                        backgroundColor: '#e6f4ff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '10px',
                                        flexShrink: 0
                                    }}>
                                        <ReadOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                                    </div>
                                    <Title level={5} style={{ margin: 0, color: '#1890ff', fontSize: '14px' }}>
                                        Before You Begin
                                    </Title>
                                </div>
                                
                                <Text style={{ 
                                    fontSize: '13px', 
                                    color: '#595959', 
                                    marginBottom: '10px',
                                    display: 'block'
                                }}>
                                    Topics you should know:
                                </Text>

                                {isLoadingTopics ? (
                                    <div style={{ textAlign: 'center', padding: '12px' }}>
                                        <Spin size="small" />
                                    </div>
                                ) : (
                                    <div style={{ 
                                        padding: '10px',
                                        backgroundColor: '#f0f7ff',
                                        borderRadius: '6px',
                                        border: '1px solid #bae0ff'
                                    }}>
                                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                            {topicsSubtopics.map((item, index) => (
                                                <div 
                                                    key={index}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '8px 10px',
                                                        backgroundColor: '#ffffff',
                                                        borderRadius: '4px',
                                                        border: '1px solid #d9d9d9'
                                                    }}
                                                >
                                                    <CheckOutlined 
                                                        style={{ 
                                                            fontSize: '14px',
                                                            color: '#52c41a',
                                                            marginRight: '10px',
                                                            flexShrink: 0
                                                        }} 
                                                    />
                                                    <Text style={{ 
                                                        fontSize: '13px',
                                                        fontWeight: 500,
                                                        color: '#262626',
                                                        flex: 1
                                                    }}>
                                                        {item.topic}
                                                    </Text>
                                                </div>
                                            ))}
                                        </Space>
                                    </div>
                                )}
                            </div>
                            <Divider style={{ margin: '12px 0' }} />
                        </>
                    )}

                    {/* Preparation Materials Section */}
                    {preparationResources && (preparationResources.pdfs.length > 0 || preparationResources.videos.length > 0) && (
                        <>
                            <Divider style={{ margin: '12px 0' }} />
                            <div>
                                <Title level={5} style={{ marginBottom: '8px', fontSize: '14px' }}>
                                    <BookOutlined style={{ marginRight: '6px', color: '#1890ff', fontSize: '14px' }} />
                                    Preparation Materials
                                </Title>
                                
                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    {/* PDF Resources */}
                                    {preparationResources.pdfs.length > 0 && (
                                        <div>
                                            <Text strong style={{ fontSize: '12px', color: '#666', marginBottom: '6px', display: 'block' }}>
                                                PDF Documents
                                            </Text>
                                            <Row gutter={[8, 8]}>
                                                {preparationResources.pdfs.map((pdf, index) => (
                                                    <Col xs={24} sm={12} key={index}>
                                                        <Card
                                                            hoverable
                                                            size="small"
                                                            style={{
                                                                border: '1px solid #d9d9d9',
                                                                borderRadius: '4px'
                                                            }}
                                                            bodyStyle={{ padding: '8px 12px' }}
                                                            onClick={() => window.open(pdf.url, '_blank', 'noopener,noreferrer')}
                                                        >
                                                            <Space size="small" style={{ width: '100%' }}>
                                                                <PDFThumbnail url={pdf.url} />
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <Text strong style={{ fontSize: '12px', display: 'block' }}>
                                                                        {pdf.title || getPdfTitle(pdf.url, 'PDF Document')}
                                                                    </Text>
                                                                    <Text type="secondary" style={{ fontSize: '11px' }}>
                                                                        {pdf.source === 'map' ? 'Map Resource' : 'Question Resource'}
                                                                    </Text>
                                                                </div>
                                                                <LinkOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
                                                            </Space>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    )}

                                    {/* Video Resources */}
                                    {preparationResources.videos.length > 0 && (
                                        <div>
                                            <Text strong style={{ fontSize: '12px', color: '#666', marginBottom: '6px', display: 'block' }}>
                                                Video Resources
                                            </Text>
                                            <Row gutter={[8, 8]}>
                                                {preparationResources.videos.map((video, index) => (
                                                    <Col xs={24} sm={12} key={index}>
                                                        <Card
                                                            hoverable
                                                            size="small"
                                                            style={{
                                                                border: '1px solid #d9d9d9',
                                                                borderRadius: '4px'
                                                            }}
                                                            bodyStyle={{ padding: '8px 12px' }}
                                                            onClick={() => window.open(video.url, '_blank', 'noopener,noreferrer')}
                                                        >
                                                            <Space size="small" style={{ width: '100%' }}>
                                                                <VideoThumbnail url={video.url} />
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <Text strong style={{ fontSize: '12px', display: 'block' }}>
                                                                        {video.title || getVideoTitle(video.url, 'Video Resource')}
                                                                    </Text>
                                                                    <Text type="secondary" style={{ fontSize: '11px' }}>
                                                                        {video.source === 'map' ? 'Map Resource' : 'Question Resource'}
                                                                    </Text>
                                                                </div>
                                                                <LinkOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
                                                            </Space>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    )}
                                </Space>
                            </div>
                            <Divider style={{ margin: '12px 0' }} />
                        </>
                    )}

                    <Form form={form} layout="vertical">
                        {/* Goals Section - Required */}
                        <div style={{
                            padding: '14px',
                            backgroundColor: '#f6ffed',
                            borderRadius: '6px',
                            border: '1px solid #b7eb8f',
                            marginBottom: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <CheckCircleOutlined style={{ marginRight: '8px', color: '#52c41a', fontSize: '16px' }} />
                                <Title level={5} style={{ margin: 0, fontSize: '14px', color: '#389e0d' }}>
                                    Set Your Goals
                                </Title>
                                <Tag color="green" style={{ marginLeft: '8px', fontSize: '11px' }}>
                                    Required
                                </Tag>
                            </div>
                            <Text type="secondary" style={{ fontSize: '12px', marginBottom: '12px', display: 'block' }}>
                                Select at least one goal to personalize your learning experience:
                            </Text>
                            
                            <Checkbox.Group
                                value={selectedGoals}
                                onChange={handleGoalChange}
                                style={{ width: '100%' }}
                            >
                                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                    {predefinedGoals.map((goal, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: '10px 12px',
                                                backgroundColor: selectedGoals.includes(index) ? '#e6f7ff' : '#ffffff',
                                                borderRadius: '6px',
                                                border: `1px solid ${selectedGoals.includes(index) ? '#91caff' : '#e8e8e8'}`,
                                                transition: 'all 0.2s ease',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                                const newSelection = selectedGoals.includes(index)
                                                    ? selectedGoals.filter(i => i !== index)
                                                    : [...selectedGoals, index];
                                                handleGoalChange(newSelection);
                                            }}
                                        >
                                            <Checkbox 
                                                value={index}
                                                style={{ 
                                                    fontSize: '13px',
                                                    lineHeight: '1.6',
                                                    margin: 0,
                                                    width: '100%'
                                                }}
                                            >
                                                {goal.text}
                                            </Checkbox>
                                        </div>
                                    ))}
                                </Space>
                            </Checkbox.Group>

                            {/* Custom Goal Input */}
                            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #d9f7be' }}>
                                <Text strong style={{ fontSize: '12px', color: '#595959', display: 'block', marginBottom: '6px' }}>
                                    Or write your own goal:
                                </Text>
                                <Form.Item name="customGoal" style={{ marginBottom: 0 }}>
                                    <Input
                                        placeholder="e.g., Focus on time management during the quiz"
                                        size="middle"
                                        prefix={<BulbOutlined style={{ color: '#faad14' }} />}
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        {/* Optional Sections - Collapsible */}
                        <div style={{
                            padding: '12px',
                            backgroundColor: '#fafafa',
                            borderRadius: '6px',
                            border: '1px solid #e8e8e8'
                        }}>
                            <div 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setShowOptionalSections(!showOptionalSections)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ThunderboltOutlined style={{ marginRight: '8px', color: '#faad14', fontSize: '14px' }} />
                                    <Text strong style={{ fontSize: '13px' }}>
                                        Additional Preparation (Optional)
                                    </Text>
                                    <Tag color="default" style={{ marginLeft: '8px', fontSize: '11px' }}>
                                        Optional
                                    </Tag>
                                </div>
                                <Text type="secondary" style={{ fontSize: '11px' }}>
                                    {showOptionalSections ? 'Hide' : 'Show'}
                                </Text>
                            </div>

                            {showOptionalSections && (
                                <div style={{ marginTop: '12px' }}>
                                    <Form.Item 
                                        name="expectations"
                                        label={<Text style={{ fontSize: '12px' }}>What do you expect to learn?</Text>}
                                        style={{ marginBottom: '10px' }}
                                    >
                                        <TextArea
                                            rows={2}
                                            placeholder="e.g., I expect to understand the relationship between temperature and pressure"
                                            size="middle"
                                        />
                                    </Form.Item>

                                    <Form.Item 
                                        name="strategies"
                                        label={<Text style={{ fontSize: '12px' }}>Your strategy for this quiz</Text>}
                                        style={{ marginBottom: 0 }}
                                    >
                                        <TextArea
                                            rows={2}
                                            placeholder="e.g., I'll read each question twice and check my calculations"
                                            size="middle"
                                        />
                                    </Form.Item>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                            <Button
                                type="default"
                                size="middle"
                                onClick={() => {
                                    // Allow skipping with minimal data
                                    onComplete({
                                        goals: selectedGoals.length > 0 
                                            ? selectedGoals.map(index => predefinedGoals[index].text)
                                            : ['Complete the quiz'],
                                        expectations: '',
                                        strategies: ''
                                    });
                                }}
                                style={{
                                    flex: 1,
                                    height: '40px'
                                }}
                            >
                                Skip Setup
                            </Button>
                            <Tooltip title={!canProceed ? "Please select at least one goal or write your own" : ""}>
                                <Button
                                    type="primary"
                                    size="middle"
                                    block
                                    icon={<RocketOutlined />}
                                    onClick={handleSubmit}
                                    disabled={!canProceed}
                                    style={{
                                        flex: 2,
                                        height: '40px',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Start Quiz {selectedGoals.length > 0 && `(${selectedGoals.length} goal${selectedGoals.length > 1 ? 's' : ''})`}
                                </Button>
                            </Tooltip>
                        </div>
                    </Form>
                </Space>
            </Card>
        </div>
    );
}
