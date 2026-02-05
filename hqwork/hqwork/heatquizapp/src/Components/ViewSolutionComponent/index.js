import React, {useEffect, useState } from "react";
import {Button, Drawer} from "antd";
import { FilePdfOutlined } from '@ant-design/icons';

import './index.css'
import { useQuestions } from "../../contexts/QuestionsContext";
import { useAuth } from "../../contexts/AuthContext";
import { map31Telemetry } from "../../services/Map31Telemetry";

export function ViewSolutionComponent({question, correct}){

    const {postQuestionPDFStatistic} = useQuestions()
    const {currentPlayerKey} = useAuth()

    const [showModal, setShowModal] = useState(false)

    const {PDFURL} = question


    useEffect(() => {
       if(showModal){
            const data = new FormData()
            data.append('QuestionId', question.Id)
            data.append('Player', currentPlayerKey)
            data.append('Correct', correct)

            postQuestionPDFStatistic(data)

            // Map 31 telemetry (best-effort)
            map31Telemetry.ensureSession({ player: currentPlayerKey || null }, false);
            map31Telemetry.track({
                page: 'self_reflection',
                section: 'question_recap',
                eventName: 'solution_open',
                targetType: 'resource',
                targetId: `solution_${question.Id}`,
                url: PDFURL,
                metadata: { question_id: question.Id, correct: !!correct }
            });
            map31Telemetry.flush();
       }

    }, [showModal])

    const renderModal = () => {

        return(
            <Drawer
                open={showModal}
                onClose={() => setShowModal(false)}
                width={'50%'}
                closable={false}
                
            >
                <div className="pdf-solution-view">
                <iframe 
                    title="pdf"
                    className="pdf-solution-view-internal"
                    src={PDFURL}
                    onClick={() => window.open(PDFURL)}    
                >
                </iframe>
                </div>

            </Drawer>
        )
    }

    return(
        <div>
            <Button
                size="small"
                onClick={() => setShowModal(true)}
                icon={<FilePdfOutlined />}
            >
                Solution
            </Button> 
            {renderModal()}
        </div>

    )
}
