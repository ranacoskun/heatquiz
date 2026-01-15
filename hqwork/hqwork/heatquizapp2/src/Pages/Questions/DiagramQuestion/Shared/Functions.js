import { RELATION_TYPE } from "./Constants"

export const getRandomVerticalValue = () => {
    return Math.floor(Math.random() * 100)
}

export const checkSectionIsLinear = (s, next_s) => {
    const {x, y2, c1x, c2x, c1y, c2y } = s
    const {x: next_x, y1,} = next_s

    const angle_x_c1 = convertRadToDegrees(Math.atan2(y2 - c1y, x - c1x))
    const angle_c2_next_x = convertRadToDegrees(Math.atan2(c2y - y1, c2x - next_x))
    const angle_section = convertRadToDegrees(Math.atan2(y2-y1, x - next_x))
    
    const isLinear = (Math.abs(angle_x_c1 - angle_c2_next_x)<0.75 && Math.abs(angle_x_c1.toFixed(1) - angle_section)<0.75)
    
    return isLinear
}

export const checkMaxMinimum = (s, next_s) => {
    const {y2:y1, c1y, c2y} = s
    const {y1:y2} = next_s

    const derivative = (t) => {
        const r = 
        (3*Math.pow((1-t),2)) * (c1y-y1)
        +
        (6*t*(1-t)) * (c2y-c1y)
        +
        (3*Math.pow(t,2)) * (y2-c2y)

        return Math.trunc(r)
    }

    const derivative2 = (t) => {
        const r = 
        
        (6*(1-t)) * (c2y-2*c1y+y1)
        +
        (6*t) * (y2-2*c2y+c1y)

        return Math.trunc(r)
    }

    const oppositeSigns = (a,b) => ((a ^ b) < 0)

    let steps_array = Array.from({length:20}, (value, index) => index*0.05)
    const derivatives = steps_array.map((t) => [t, derivative(t), derivative2(t)])
    
    const possible_local_extermes = derivatives
    .map((v, i) => {
        const prev_v = derivatives[i-1]

        if(prev_v && oppositeSigns(prev_v[1], v[1])){
            return ({index:i, der2: v[2], der1: v[1], t:v[0]})
        }

        return null
    }).filter((a) => a)

    return possible_local_extermes
}

export const convertRadToDegrees = (r) => {
    return (r * 180/Math.PI)
}

export const  computePointInCanvas = (e, plotRef) => {
    const {clientX, clientY} = e

    if(!plotRef) return

    const boundingRect = plotRef.current.getBoundingClientRect();
        return {
            x: Math.floor(clientX - boundingRect.left),
            y: Math.floor(clientY - boundingRect.top)
        }
}

export const claculateStartEndSlopes = (section, next_section) => {
    const m_c1 = (section.y2 - section.c1y)/(section.x - section.c1x) 

    const m_c2 = (section.c2y - next_section.y1)/(section.c2x - next_section.x) 

    return ({m_c1, m_c2})
}

export const claculateStartEndAngles = (section, next_section) => {
    const {m_c1, m_c2} =  claculateStartEndSlopes(section, next_section)

    const a_c1 = Math.trunc(convertRadToDegrees(Math.atan2(m_c1, 1)))
    const a_c2 = Math.trunc(convertRadToDegrees(Math.atan2(m_c2, 1)))

    return ({a_c1, a_c2})
}

export const getClosestPointOnLine = (y_start, m, x, y) => {
    const line_formula = (px) => (y_start + m * px)
    const inverse_line_formula = (y) => ((y - y_start)/m)

    const intersection_p_x = [x, line_formula(x)]
    const intersection_p_y = [inverse_line_formula(y), y]

    const delat_x = intersection_p_y[0] - x
    const delat_y = intersection_p_x[1] - y

    const alpha = Math.atan2(delat_y, delat_x)

    const beta = Math.PI/2 - alpha
    const L = delat_x * Math.tan(beta)

    const nearst_point = 
    [x +
    Math.cos(beta)* L,
        
    y +
    Math.sin(beta)* L
    ]

    return nearst_point

}

export const drawLine = (ctx, x1, y1, x2, y2, color, width=1,  dashed = false) => {
    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    if(dashed) ctx.setLineDash([5, 3])

    ctx.stroke();
    ctx.setLineDash([])
}

export const drawCircle = (ctx, x,y, r, color, fillColor) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);

    ctx.strokeStyle = color|| '#007399';
    ctx.fillStyle = fillColor|| '#007399';
    ctx.lineWidth = 1 

    ctx.fill();
    ctx.stroke();
}

export const drawRectangle = (ctx, x,y, w, h, color, fillColor) => {
    ctx.beginPath();

    ctx.strokeStyle = color|| 'green';
    ctx.fillStyle = fillColor|| '#CBF1CB'

    ctx.fillRect(x , y, w, h);
}

export const drawText = (ctx, x,y, text, color, font) => {
    ctx.font = font|| "10px Arial";
    ctx.fillStyle = color || '#cccccc'
    ctx.fillText(text, x, y);
}

export const drawCurve = (ctx,
    x1,y1, x2, y2,
    c1x, c1y, c2x, c2y,
    color, width = 1) => {

    ctx.beginPath();
    ctx.lineWidth = width 

    ctx.moveTo(x1, y1);
    ctx.strokeStyle = color || '#006080';
    ctx.bezierCurveTo(
        c1x, c1y,

        c2x, c2y,

        x2, y2);
    ctx.stroke();
}

export const drawCurveOneCP = (
    ctx,
    x1,y1, x2, y2,
    cx, cy,
    color, width) => 
{
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cx, cy, x2, y2)
    ctx.stroke();
}


export const getPositionRelationsLabels = (positionRelations) => {
        
    const keys = Object.keys(positionRelations).sort((a,b) => b-a)
    let options = []
    for(const [i, k] of keys.entries()){
        const pr_data= positionRelations[k]

        const equal_options = pr_data.flatMap((d, i) => 
        pr_data.slice(i+1).map( w => {
            if(d.section_x == w.section_x) return null

            return ({
                text:d.key + ' = ' + w.key,
                section1Index: d.sectionIndex,
                section2Index: w.sectionIndex,
                relation: '=',
                RelationType: RELATION_TYPE.POSITION,
                RelationValue:'=',
                RelationValue2:d.value2,
                RelationValue3:w.value2,

                First:d.section,
                Other: w.section
            })
        }).filter((a) => a))

        const lower_positions_pre = keys.slice(i+1).map((kk) => positionRelations[kk]).flat()

        let lower_positions =  pr_data.flatMap((d) => lower_positions_pre.map( w =>{
            if(d.section_x == w.section_x) return null
            return ({
                text:d.key + ' > ' + w.key,
                section1Index: d.sectionIndex,
                section2Index: w.sectionIndex,
                relation: '>',
                RelationType: RELATION_TYPE.POSITION,
                RelationValue:'>',
                RelationValue2:d.value2,
                RelationValue3:w.value2,
                First:d.section,
                Other: w.section
            })          
        }).filter((a) => a))

        if(equal_options.length || lower_positions.length) options = [...options, ...equal_options, ...lower_positions]
    }

    return options


}

export const getSlopesRelationsLabels = (gradientSortingRelations) => {
    const keys = Object.keys(gradientSortingRelations).sort((a,b) => b-a)
    let options = []
    for(const [i, k] of keys.entries()){
        const pr_data= gradientSortingRelations[k]

        const equal_options = pr_data.flatMap((d, i) => 
        pr_data.slice(i+1).map( w => {
            if(d.section_x == w.section_x) return null

            return ({
                text:d.key + ' = ' + w.key,
                section1Index: d.sectionIndex,
                section2Index: w.sectionIndex,
                relation: '=',
                RelationType: RELATION_TYPE.SLOPE,
                RelationValue:'=',
                RelationValue2:d.value2,
                RelationValue3:w.value2,
                First:d.section,
                Other: w.section
            })
        }).filter((a) => a))

        const lower_slopes_pre = keys.slice(i+1).map((kk) => gradientSortingRelations[kk]).flat()

        let lower_slopes =  pr_data.flatMap((d) => lower_slopes_pre.map( w =>{
            if(d.section_x == w.section_x) return null
            return ({
                text:d.key + ' > ' + w.key,
                section1Index: d.sectionIndex,
                section2Index: w.sectionIndex,
                relation: '>',
                RelationType: RELATION_TYPE.SLOPE,
                RelationValue:'>',
                RelationValue2:d.value2,
                RelationValue3:w.value2,

                First:d.section,
                Other: w.section
            })         
        }).filter((a) => a))

        if(equal_options.length || lower_slopes.length) options = [...options, ...equal_options, ...lower_slopes]
    }

    return options


}

export const getInvertedSlopesRelationsLabels = (gradientInvertedRelations) => {
    const keys = Object.keys(gradientInvertedRelations)

    let options = []

    for(let key of keys){
        const pos_data = gradientInvertedRelations[key].positive
        const neg_data = gradientInvertedRelations[key].negative

        for(let pd of pos_data){
            const new_options = neg_data.map((n) => ({
                text: pd.key + ' inverse of ' + n.key,
                FirstId: pd.section.Id,
                OtherId: n.section.Id,
                relation: 'invert',
                RelationType: RELATION_TYPE.INVERSE_SLOPE,
                RelationValue:'=',
                First:pd.section,
                Other: n.section
            }))

            options = [...options, ...new_options]
        }
    }

    return options

}
export const gradePlot = (originalPlot, answerPlot) => {
    const sectionEvaluationParams = [
        'IsStartPositionLabelSelected',
        'IsEndPositionLabelSelected',
        'IsPositionRelationLabelSelected',

        'IsGradientStartLabelSelected',
        'IsGradientEndLabelSelected',
        'IsRatioOfGradientsLabelSelected',

        'IsLinearLabelSelected',
        'IsMaximumSelected',
        'IsMinimumSelected',
    ]

    const sectionEvaluationFunctions = {
        'IsStartPositionLabelSelected': (originalSection, section) => {     
            const {marginY2Neg, marginY2Pos} = originalSection

            if((section.Labels.positionStart - originalSection.positionStart) > marginY2Pos) return false
            if((originalSection.positionStart - section.Labels.positionStart) > marginY2Neg) return false

            return true
        },

        'IsEndPositionLabelSelected': (originalSection, section, originalNextSection) => {           
            const {marginY1Neg, marginY1Pos} = originalNextSection

            if((section.Labels.positionEnd - originalSection.positionEnd) > marginY1Pos) return false
            if((originalSection.positionEnd - section.Labels.positionEnd) > marginY1Neg) return false

            return true     
        },

        'IsPositionRelationLabelSelected': (originalSection, section) => {                
            return (section.Labels.positionRelation === originalSection.positionRelation)
        },

        'IsGradientStartLabelSelected': (originalSection, section) => {                
            return (section.Labels.gradientStart === originalSection.gradientStart)
        }, 

        'IsGradientEndLabelSelected': (originalSection, section) => {                
            return (section.Labels.gradientEnd === originalSection.gradientEnd)
        },  

        'IsRatioOfGradientsLabelSelected': (originalSection, section) => {                
            return (section.Labels.ratioOfGradients === originalSection.ratioOfGradients)
        },

        'IsLinearLabelSelected': (originalSection, section) => {                
            return (section.Labels.linear === originalSection.linear)
        },   

        'IsMaximumSelected': (originalSection, section) => {                
            return (section.Labels.hasMaximum && originalSection.IsMaximumSelected)
        },   

        'IsMinimumSelected': (originalSection, section) => {                
            return (section.Labels.hasMinimum === originalSection.IsMinimumSelected)
        },          

    }
    
    let plotSectionRatings = []
    let plotRelationRatings = []

    let plotPoints = 0
    let fullPoints = 0

    const {Relations: originalRelations, Sections} = originalPlot
    const {Relations: answerRelations, Sections: answerSections} = answerPlot

    //Loop over sections
    for(let [i, s] of Sections.slice(0, Sections.length-1).entries()){
        if(s.IsFrozen) {
            plotSectionRatings.push([])
            continue
        }

        const a_s = answerSections[i]  
        const next_s = Sections[i+1]

        const points = sectionEvaluationParams.map((p) => {
             if(!s[p]) return null
             const r = sectionEvaluationFunctions[p](s, a_s, next_s)

             return [p, r]
         }).filter(a => a)

        fullPoints += points.length
        const newPoints = points.filter((a) => a[1]).length
        plotPoints += newPoints

        plotSectionRatings.push(points)
    }

    //Loop over relations
    for(let r of originalRelations){
        //firstId, otherId, type, value

        const exists = answerRelations.some(a => 
            a.First.Id === r.FirstId 
            &&
            a.Other.Id === r.OtherId 
            &&
            a.RelationType === r.RelationType 
            &&
            a.RelationValue === r.RelationValue 
            &&
            a.RelationValue2 === r.RelationValue2 
            &&
            a.RelationValue3 === r.RelationValue3 
            )
        
        plotRelationRatings.push([exists, r])

        fullPoints += 1
        if(exists)  plotPoints += 1
    }

    return [plotPoints, fullPoints, plotSectionRatings, plotRelationRatings]
}