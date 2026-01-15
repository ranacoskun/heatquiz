import React from "react";
import Tex2SVG from "react-hook-mathjax";

export function SVGLatexRenderer({latex, className, style}){

    return(
            <Tex2SVG display="inline" latex={latex} className={className || ""} style = {style || {}}/>
    )
}