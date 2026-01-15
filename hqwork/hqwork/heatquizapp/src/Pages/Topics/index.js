import React, { useEffect, useState } from "react";
import { PagesWrapper } from "../../PagesWrapper";
import { useTopics } from "../../contexts/TopicsContext";
import { useDatapools } from "../../contexts/DatapoolsContext";
import { Button, Divider, Dropdown, List, Popconfirm, Skeleton, Space, message } from "antd";
import {PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined} from '@ant-design/icons';

import './Topics.css'
import { EditTopicName } from "./EditTopicName";
import { EditSubtopicName } from "./EditSubtopicName";
import { ViewSubtopicQuestions } from "./ViewSubtopicQuestions";
import { AddTopic } from "./AddTopic";
import { AddSubtopic } from "./AddSubtopic";
import { ErrorComponent } from "../../Components/ErrorComponent";
import { beautifyDate, handleResponse } from "../../services/Auxillary";

export function Topics(){

    const {
        topics, errorGetTopics, isLoadingTopics, getAllTopics,
        removeTopic, 
        removeSubtopic
    
    } = useTopics()
    const {selectedDatapool} = useDatapools()

    const [showAddTopicModal, setShowAddTopicModal] = useState(false)
    const [showAddSubtopicModal, setShowAddSubtopicModal] = useState(false)

    const [showEditTopicNameModal, setShowEditTopicNameModal] = useState(false)
    const [selectedTopic, setSelectedTopic] = useState({})

    const [showEditSubtopicNameModal, setShowEditSubtopicNameModal] = useState(false)
    const [selectedSubtopic, setSelectedSubtopic] = useState({})

    const [showViewSubtopicQuestionsModal, setShowViewSubtopicQuestionsModal] = useState(false)

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        getAllTopics()
    }, [selectedDatapool])

    
    const topicActionList = (t) => [
        {
            key: 'edit_topic_name',
            label: 'Edit name ',
            icon: <EditOutlined/>,
            onClick: () => {
                setShowEditTopicNameModal(true)
                setSelectedTopic(t)
            }
        },
        {
            key: 'add_subtopic',
            label: 'Add subtopic',
            icon: <PlusOutlined />,
            onClick: () => {
                setSelectedTopic(t)
                setShowAddSubtopicModal(true)
            }
        },
        !t.Subtopics.reduce((r, c) => r += c.Questions.length, 0)
        &&
        {
            key: 'delete_topic',
            label: 
            <Popconfirm
                title="Remove topic"
                description="Are you sure to delete this topic?"
                        onConfirm={() => {

                            removeTopic(t)
                            .then(r => handleResponse(
                                r,
                                messageApi,
                                'Removed',
                                1,
                                () => getAllTopics()))
                        }}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
                placement="right"
            >
            
                Delete
            </Popconfirm>,
            icon: <DeleteOutlined />,
            onClick: () => {
               
            }
        }
    ]

    const subtopicActionList = (s, t) => [{
        key: 'edit_subtopic_name',
        label: 'Edit name ',
        icon: <EditOutlined/>,
        onClick: () => {
            setShowEditSubtopicNameModal(true)
            setSelectedSubtopic(s)
        }
    },
    s.Questions.length
    &&
    {
        key: 'view_questions',
        label: 'View questions',
        icon: <EyeOutlined />,
        onClick: () => {
            setShowViewSubtopicQuestionsModal(true)
            setSelectedSubtopic({...s, Topic: t})
        }
    },
    !s.Questions.length
    &&
    {
        key: 'delete_subtopic',
        label: 
        <Popconfirm
                title="Remove subtopic"
                description="Are you sure to delete this subtopic?"
                        onConfirm={() => {

                            removeSubtopic(s)
                            .then(r => handleResponse(
                                r,
                                messageApi,
                                'Removed',
                                1,
                                () => getAllTopics()))
                        }}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
                placement="right"
            >
        Delete
        </Popconfirm>,
        
        icon: <DeleteOutlined />,
        onClick: () => {}
    }]

    return(
        <PagesWrapper>
            {contextHolder}

            <Divider orientation="left">
            
                <Space>
                    <span className="page-title">
                        Topics
                    </span>
                    <Button
                        type={'default'}
                        onClick={() => setShowAddTopicModal(true)}
                    >
                        <PlusOutlined style={{color:'green'}}/>
                        New topic
                    </Button>
                </Space>
            </Divider>


            {isLoadingTopics && <Skeleton/>}

            {errorGetTopics && !isLoadingTopics && 
                <ErrorComponent 
                    error={errorGetTopics}
                    onReload={() => getAllTopics()}
                />
            }
            
            {!isLoadingTopics && topics &&
               <List
                dataSource={topics}
                renderItem={(t, ti) => {
                    const {Id, Name, AddedByName, DateCreated, Subtopics} = t
                    return(
                        <div key={Id}>
                                <Space align="start">
                                            <Space align="start" className="topics-list-info-column">
                                                <p className="default-gray">{ti+1}</p>
                                                <Space direction="vertical" align="start">
                                                    <Dropdown
                                                        menu={{
                                                            items:topicActionList(t),
                                                            title:'Actions'
                                                        }}
                                                    >
                                                        <p className="default-title hoverable">{Name}</p>
                                                    </Dropdown>
                                                    <Space size={'0'} direction="vertical">
                                                        <small className="default-gray">{AddedByName}</small>
                                                        <small className="default-gray">{beautifyDate(DateCreated)}</small>
                                                    </Space>
    
                                                </Space>
                                                
                                            </Space>  
                                            <div>
                                                <br/>
                                                {Subtopics.map((s) => 
                                                {
                                                    const {Id, Name, Questions} = s

                                                    return(
                                                        <div key={Id}>
                                                                <Dropdown
                                                                    menu={{
                                                                        items:subtopicActionList(s, t),
                                                                        title:'Actions'
                                                                    }}
                                                                >
                                                                    <p className="hoverable-plus">
                                                                        {Name}
                                                                    </p>
                                                                </Dropdown>
                                                                <small className="default-gray">
                                                                    {Questions.length} {' '} questions
                                                                </small>
                                                                <br/>
                                                                <br/>
                                                        </div>)
                                                }
                                                )}
                                            </div> 
                                        </Space>
                                        <Divider />
                                    </div>
                    )
                }}
               />
            }

            <AddTopic 
                open={showAddTopicModal}
                onClose={() => setShowAddTopicModal(false)}
                reloadData={() => getAllTopics()}
            />

            <AddSubtopic 
                open={showAddSubtopicModal}
                onClose={() => setShowAddSubtopicModal(false)}
                topic={selectedTopic}
                reloadData={() => getAllTopics()}
            />


            <EditTopicName 
                open={showEditTopicNameModal}
                onClose={() => setShowEditTopicNameModal(false)}
                topic={selectedTopic}
                reloadData={() => getAllTopics()}
            />

            <EditSubtopicName 
                open={showEditSubtopicNameModal}
                onClose={() => setShowEditSubtopicNameModal(false)}
                subtopic={selectedSubtopic}
                reloadData={() => getAllTopics()}
            />

            <ViewSubtopicQuestions 
                open={showViewSubtopicQuestionsModal}
                onClose={() => setShowViewSubtopicQuestionsModal(false)}
                subtopic={selectedSubtopic}
                reloadData={() => getAllTopics()}
            />
        </PagesWrapper>
    )
}