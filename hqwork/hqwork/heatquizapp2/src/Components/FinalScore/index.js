import React from 'react'

export function FinalScore({finalScore, className}){

    return(
        <div>
            <Space
                className={"eb-question-question-final-score " + (className || "")}
                direction="vertical"
                align="center"
            >
                <p className="default-title">{finalScore}</p>
                <p className="default-gray default-small">Final score</p>
            </Space>
        </div>
    )
}