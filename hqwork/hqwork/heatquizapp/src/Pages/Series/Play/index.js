import { PagesWrapper } from "../../../PagesWrapper";
import { SeriesPlay } from "../../../Components/SeriesPlay";
import { useParams } from "react-router-dom";
import React from "react";

export function PlaySeriesPage(){
    const { id } = useParams()

    return(
        <PagesWrapper>
            <SeriesPlay 
                Code={id}
            />
        </PagesWrapper>
    )
}