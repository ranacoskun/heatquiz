import React from "react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

export function LatexRenderer({latex, style, className}){

    return(
        <div
        className={className}
        style = {style}
        >
            <Latex>
            {latex}
            </Latex>
        </div>
    )
}