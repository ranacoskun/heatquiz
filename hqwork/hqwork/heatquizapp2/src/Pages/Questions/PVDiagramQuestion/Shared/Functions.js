import { POINT_RAD, RELATION_GRADIENT, RELATION_X_POSITION, RELATION_Y_POSITION, SNIPPING_MARGIN, CONDITION_POSITION,CONDITION_SHAPE, RELATION_X_POSITION_NUM, RELATION_Y_POSITION_NUM, RELATION_GRADIENT_NUM } from "./Constants"

export const conformPoints = (allPoints) => {
    let newPoints = []

    for(let [pi, p] of allPoints.entries())
    {
        let _p = ({...p})
        let nextP = allPoints[pi+1]

        if(!nextP) nextP = allPoints[0]
        const {x, y} = nextP

        _p.cx = (_p.x + x) * 0.5
        _p.cy = (_p.y + y) * 0.5

        newPoints.push(_p)
    }

    return newPoints
}

const getCenterOfPoints = (points) => {
    const x = points.map(p => p.x).reduce((r, c) => r += c, 0) / points.length
    const y = points.map(p => p.y).reduce((r, c) => r += c, 0) / points.length
    return ({x, y})
}

export const randomizePoints = (allPoints, width, height) => {
    let newPoints = []
    
    const center = getCenterOfPoints(allPoints)

    const {x: xCenter, y: yCenter} = center

    const radius = Math.min(width, height)/4 * (1 - 0.25 * Math.random())

    const pheta_0 = Math.random() * Math.PI

    const pheta = (Math.PI * 2) /(allPoints.length)

    const hStep = height/(allPoints.length + 10)

    for(let [pi, p] of allPoints.entries())
    {
        let _p = ({...p})

        const pPheta = -pheta*pi + pheta_0
        const pX = Math.cos(pPheta) * radius
        const pY = Math.sin(pPheta) * radius + Math.random() * hStep - Math.random() * hStep

        _p.x =  xCenter + pX
        _p.y = yCenter + pY

        //check limits
        if(_p.x < 0) _p.x = 20;
        if(_p.x > width) _p.x = width - 20;

        if(_p.y < 0) _p.y = 20;
        if(_p.y > height) _p.y = height - 20;

        newPoints.push(_p)
    }

    return newPoints
}

export const getHoveredPoint = (allPoints, mouseCoordinates) => {
    const {x: mx, y: my} = mouseCoordinates

    //get first point that aligns with the mouse
    for (let [pi, p] of allPoints.entries()) {
        const {x, y, groupIndex, pointIndex} = p
        const marginX = Math.abs(x - mx) 
        const marginY = Math.abs(y - my)

        if((marginX <= POINT_RAD) && (marginY <= POINT_RAD)){
            return [{pointIndex, groupIndex}];
        } 
    } 

    return null;
}


const getSlopNext = (p, nextP) => {
    let m = null

    const {x, y} = p

    if(nextP){
        const {x: nx, y: ny} = nextP
        
        m = (ny - y)/(nx - x)
    }
    
    return m
}

//nearest y 
const f_nearest_y = (m, x_0, y_0, px) => m * (px - x_0) + y_0; // f = m*x + y_0 ; y_0 = y of current point

export const snippingPoint = (movedPointIndex, allPoints, mPoint, closedLoop) => {
    const {x, y} = mPoint

    let nextP = allPoints[movedPointIndex + 1]

    if(!nextP && closedLoop) nextP = allPoints[0];

    //same x 
    const sameXPoints = allPoints.map((p, pi) => {
        if(pi === movedPointIndex) return null;

        const {x: ox} = p 

        if(Math.abs(ox - x) < SNIPPING_MARGIN) return pi;

        return null
    }).filter(a => !Object.is(a, null))

    //same y 
    const sameYPoints = allPoints.map((p, pi) => {
        if(pi === movedPointIndex) return null;

        const {y: oy} = p 

        if(Math.abs(oy - y) < SNIPPING_MARGIN) return pi;

        return null
    }).filter(a => !Object.is(a, null))

    //same slop
    let sameMPoints = []

    if(nextP && false){

        const {x: x_0, y: y_0} = nextP

        sameMPoints = allPoints.map((cp, pi) => {
            if(pi === movedPointIndex) return null;
            if(!closedLoop && ((pi + 1) === allPoints.length))  return null;
    
            let _nextP = allPoints[pi + 1]
        
            if(!_nextP && closedLoop) _nextP = allPoints[0]
            
            let _m = getSlopNext(cp, _nextP)
            
            //make comparison
            let nearestY = f_nearest_y(_m, x_0, y_0, x)
    
            if(Math.abs(nearestY - y) < SNIPPING_MARGIN) return ({nearestY: nearestY, pi: pi});
    
            return null
    
        }).filter(a => !Object.is(a, null))
    }
    
    return({
        sameXPoints,
        sameYPoints,
        sameMPoints
    })
}


export const snippingCPPoint = (movedCPPointIndex, allPoints, mPoint, closedLoop) => {
    const {x: px, y: py} = mPoint

    const currentPoint = allPoints[movedCPPointIndex]
    let nextPoint = allPoints[movedCPPointIndex + 1]

    if(!nextPoint && closedLoop) nextPoint = allPoints[0];
    if(!nextPoint) return null;  

    const {x, y} = currentPoint
    const {x: ox, y: oy} = nextPoint

    //line
    const m = (oy - y) / (ox - x)
    let nearestY = f_nearest_y(m, x, y, px)

    const withXMargin = (Math.abs(px - x) < SNIPPING_MARGIN)

    if((Object.is(nearestY, NaN) || Object.is(Math.abs(nearestY), Infinity)) && withXMargin) return Infinity;

    if(Math.abs(nearestY - py) < SNIPPING_MARGIN) return nearestY;

    return null
}

export const calculateFinalSnippingPoint = (snippedPoint, allPoints, mPoint) => {
    const {sameXPoints, sameYPoints, sameMPoints} = snippedPoint
    
    let x = mPoint.x;
    let y = mPoint.y;
    
    //X
    if(sameXPoints.length){
        const firstIndex = sameXPoints[0]
        x = allPoints[firstIndex].x
    } 

    //Y
    if(sameYPoints.length){
        const firstIndex = sameYPoints[0]
        y = allPoints[firstIndex].y
    }

    //Slop
    if(sameMPoints.length){
        const firstElement = sameMPoints[0]
        const {nearestY} = firstElement 
        y = nearestY
    }

    return ({x,y})
}

export const calculateFinalSnippingCPPoint = (snippedPoint, basePoint, mPoint) => {
    const {x, y} = mPoint
    const {x: bx} = basePoint

    if(Object.is(snippedPoint, Infinity)) return ({x: bx, y})

    if(snippedPoint) return ({x, y:snippedPoint})

    return mPoint
}

const checkIsLine = (m, p) => {
    const {x: x_0, y: y_0, cx, cy} = p

    //Vertical
    if(Object.is(NaN, m) || Object.is(Math.abs(m), Infinity)){
        //cx should be equal to x_0
        return (cx === x_0)
    }


    const nearestY = f_nearest_y(m, x_0, y_0, cx)
    return (Math.abs(nearestY - cy) < 1);
}

const checkIsUp = (m, p, nextP) => {
    const {x: x_0, y: y_0, cx, cy} = p
    const {y: y_2} = nextP

    //Vertical
    if(Object.is(NaN, m) || Object.is(Math.abs(m), Infinity)){
        //cx should be equal to x_0
        if(y_2 > y_0)//downward
        {
            return (cx < x_0) // cp left of line
        } 
        else if (y_2 < y_0) //upward
        {
            return (cx > x_0) // cp left of line
        }
        else{
            return false
        }
    }

    const nearestY = f_nearest_y(m, x_0, y_0, cx)

    const isUp = (cy < nearestY) // < since in canvas 0 is above and +y is downward

    return (isUp);
}

export const generateListsForRelations = (allPoints, closedLoop, pointsOnly, height, realQuestion) => {

    //Line / Up / Down
    const pointsShape = pointsOnly ? [] : allPoints.map((p, pi) => {
        const {Id} = p
        const key = realQuestion ? Id : pi

        let nextP = allPoints[pi + 1]

        if(!nextP && closedLoop) nextP = allPoints[0]
        if(!nextP) return null

        const m = getSlopNext(p, nextP)

        //check is line
        const isLine = checkIsLine(m, p)

        if(isLine) return ({key, shape:'Line'})

        //check is up/down
        const isUp = checkIsUp(m, p, nextP)
        if(isUp) return ({key, shape:'Up'})
        else return ({key, shape:'Down'})
    }).filter(a => a)

    //X
    let pointsXPosition = allPoints.map((p, pi) => {
        const {Id} = p
        const key = realQuestion ? Id : pi

        const {x} = p

        return {key, value: x}
    })

    //Y
    let pointsYPosition = allPoints.map((p, pi) => {
        const {Id} = p
        const key = realQuestion ? Id : pi

        const {y} = p

        return {key, value: (height - y)}
    })

    //Slope
    let pointsSlope =  pointsOnly ? [] : allPoints.map((p, pi) => {
        const {Id} = p
        const key = realQuestion ? Id : pi

        let nextP = allPoints[pi + 1]

        if(!nextP && closedLoop) nextP = allPoints[0]
        if(!nextP) return null

        const m =  -getSlopNext(p, nextP) // Flip slope since canvas have y+ downward
        let state = (m === 0) ? 'horizontal' : 'positive';

        if(Object.is(m, NaN) || Object.is(Math.abs(m), Infinity)) state = 'vertical'
        else if(m < 0) state = 'negative';

        return {key, value: Math.abs(m), state: state}
    }).filter(a => a)

    return({
        pointsShape,
        pointsXPosition,
        pointsYPosition,
        pointsSlope
    })
}

export const createRelations = (relations, pointsOnly) => {
    const {pointsXPosition, pointsYPosition, pointsSlope} = relations

    //X
    let xRelations = Object.groupBy(pointsXPosition, ({value}) => value)

    const xKeys = Object.keys(xRelations).map(k => Number(k)).sort((a,b) => a - b).map(r => "" + r)

    let xRelationsFinal = []

    for(let [ki, k] of xKeys.entries()){
        const data = xRelations[k]

        const otherKeys = xKeys.slice(ki+1)

        //Equals
        for(let [di, d] of data.entries()){
            const {key: k1} = d

            const otherDs = data.slice(di + 1)

            xRelationsFinal = [...xRelationsFinal, ...otherDs.map((x, xi) => {
                const {key: k2} = x
                return({
                    relation: '=',
                    type:RELATION_X_POSITION,
                    firstIndex: k1,
                    secondIndex: k2
                })
            })]
        }

        //Larger
        const otherPoints = otherKeys.map((kk, kki) => {
            return (xRelations[kk].map(a => a.key))
        }).flat()

        const largerRelation = data.map((d) => {
            const {key: k1} = d
            
            return otherPoints.map((x) => {
                return({
                    relation: '<',
                    type:RELATION_X_POSITION,
                    firstIndex: k1,
                    secondIndex: x
                })
            })
        }).flat()

        xRelationsFinal = [...xRelationsFinal, ...largerRelation]
    } 
    
    //Y
    let yRelations = Object.groupBy(pointsYPosition, ({value}) => value)

    const yKeys = Object.keys(yRelations).map(k => Number(k)).sort((a,b) => a - b).map(r => "" + r)

    let yRelationsFinal = []

    for(let [ki, k] of yKeys.entries()){
        const data = yRelations[k]

        const otherKeys = yKeys.slice(ki+1)

        //Equals
        for(let [di, d] of data.entries()){
            const {key: k1} = d

            const otherDs = data.slice(di + 1)

            yRelationsFinal = [...yRelationsFinal, ...otherDs.map((x, xi) => {
                const {key: k2} = x
                return({
                    relation: '=',
                    type:RELATION_Y_POSITION,
                    firstIndex: k1,
                    secondIndex: k2
                })
            })]
        }

        //Larger
        const otherPoints = otherKeys.map((kk, kki) => {
            return (yRelations[kk].map(a => a.key))
        }).flat()

        const largerRelation = data.map((d) => {
            const {key: k1} = d
            
            return otherPoints.map((x) => {
                return({
                    relation: '<',
                    type:RELATION_Y_POSITION,
                    firstIndex: k1,
                    secondIndex: x
                })
            })
        }).flat()

        yRelationsFinal = [...yRelationsFinal, ...largerRelation]
    }
    
    //M
    let mRelations = Object.groupBy(pointsSlope, ({value}) => value)

    const mKeys = Object.keys(mRelations).map(k => Number(k)).sort((a,b) => a - b).map(r => "" + r)
    
    let mRelationsFinal = []

    for(let [ki, k] of mKeys.entries()){
        if(pointsOnly) continue;
        
        const data = mRelations[k]

        const otherKeys = mKeys.slice(ki+1)

        //Equals
        for(let [di, d] of data.entries()){
            const {key: k1} = d

            const otherDs = data.slice(di + 1)

            mRelationsFinal = [...mRelationsFinal, ...otherDs.map((x, xi) => {
                const {key: k2} = x
                return({
                    relation: '=',
                    type:RELATION_GRADIENT,
                    firstIndex: k1,
                    secondIndex: k2
                })
            })]
        }

        //Larger
        const otherPoints = otherKeys.map((kk, kki) => {
            return (mRelations[kk].map(a => a.key))
        }).flat()

        const largerRelation = data.map((d) => {
            const {key: k1} = d
            
            return otherPoints.map((x) => {
                return({
                    relation: '<',
                    type:RELATION_GRADIENT,
                    firstIndex: k1,
                    secondIndex: x
                })
            })
        }).flat()

        mRelationsFinal = [...mRelationsFinal, ...largerRelation]
    } 

    return({
        xRelationsFinal,
        yRelationsFinal,
        mRelationsFinal
    })
}

export const getNameForRelation = (type) => {
    const map = {
        [RELATION_X_POSITION]: 'X-position',
        [RELATION_Y_POSITION]: 'Y-position',
        [RELATION_GRADIENT]: 'Gradient',
    }

    return map[type]
}

export const getNameForRelationNum = (type) => {
    const map = {
        [RELATION_X_POSITION_NUM]: 'X-position',
        [RELATION_Y_POSITION_NUM]: 'Y-position',
        [RELATION_GRADIENT_NUM]: 'Gradient',
    }

    return map[type]
}

export const getTypeForRelation = (type) => {
    const map = {
        [RELATION_X_POSITION]: RELATION_X_POSITION_NUM,
        [RELATION_Y_POSITION]: RELATION_Y_POSITION_NUM,
        [RELATION_GRADIENT]: RELATION_GRADIENT_NUM,
    }

    return map[type]
}

const checkPositionCorrect = (referenceP, answerP) => {
    const {x: ax, y: ay} = answerP
    const {X: rx, Y: ry, MarginX, MarginY} = referenceP

    let xStatus = Math.abs(ax - rx) <= MarginX 
    let yStatus = Math.abs(ay - ry) <= MarginY 
    
    const status = xStatus && yStatus

    return status
}

const shiftArrayByOne = (points) => {
    if (points.length <= 1) {
        return points;
    }
    let elem1 = points.shift();
    points.push(elem1);

    return points
}

const getShiftedPointsArray = (points, shiftIndex) => {
    let shiftedPoints = [...points]
    for(let i = 1; i < shiftIndex; i++){
        shiftedPoints = shiftArrayByOne(shiftedPoints)
    }

    return shiftedPoints
}

export const evaluateQuestionAnswer = (group) => {
    /*const {IsPermutableScoreEvaluation} = originalQuestion

    if(IsPermutableScoreEvaluation){
        let potenitalArrangements = []
        let evaluationArray = []

        for(let i = 0; i < answerPoints.length; i++){
            const arr = getShiftedPointsArray(answerPoints, i)

            potenitalArrangements.push(arr)
        }

        for(let j = 0; j < potenitalArrangements.length; j++){
            const arr = potenitalArrangements[j]

            const finalEvaluation = evaluateQuestionAnswerSingleRun(originalQuestion, arr, list, relations)

            evaluationArray.push({
                points: arr,
                finalEvaluation
            })
        }

        const scoresArray = evaluationArray.map(a => a.finalEvaluation.totalPoints)
        const maxScore = Math.max(...scoresArray)
        const maxScoreIndex = scoresArray.findIndex(maxScore)

        const bestArrangement = evaluationArray[maxScoreIndex]

        const {finalEvaluation, points} = bestArrangement

        return({
            IsPermutableScoreEvaluation: true,
            finalEvaluation,
            points
        })

    }
    else{
        const finalEvaluation = evaluateQuestionAnswerSingleRun(originalQuestion, answerPoints, list, relations)

        return ({
            IsPermutableScoreEvaluation: false,
            finalEvaluation
        })
    }*/

    const finalEvaluation = evaluateQuestionAnswerSingleRun(group)

    return ({
        IsPermutableScoreEvaluation: false,
        finalEvaluation
    })
}

const evaluateQuestionAnswerSingleRun = (group) => {
    const {Points, points:answerPoints, Relations, relationsList: list, relationsFinal: relations} = group

    const {xRelationsFinal, yRelationsFinal, mRelationsFinal} = relations
    const {pointsShape, pointsSlope} = list

    //Points - positions/shapes
    const scorePointsPositionsShapes = Points.map((p, pi) => {
        const {IsPoistionConsiderable, IsShapeConsiderable, CurveShape: correctShape, PositionComment, ShapeComment,} = p

        const answerP = answerPoints[pi]

        let nextP = Points[pi + 1]
        if(!nextP) nextP = Points[0]

        let result = ({
            ...p,
            checks: []
        })

        //check position
        if(IsPoistionConsiderable){
            const status = checkPositionCorrect(p, answerP)

            result.checks.push({
                type: CONDITION_POSITION,
                status,
                comment: PositionComment
            })
        }

        //check shape
        if(IsShapeConsiderable){
            const {Name: n1} = p
            const {Name: n2} = nextP

            const answerShape = pointsShape[pi].shape

            const status = (correctShape === answerShape)

            result.checks.push({
                type: CONDITION_SHAPE + " ( " + n1 + "-" + n2 + ": " + correctShape + " )",
                status,
                comment: ShapeComment
            })
        }

        return result
    })

    //Relations
    //X
    const answerXRelations = Relations.filter(r => r.Type === RELATION_X_POSITION_NUM)

    let scoreRelations = answerXRelations
    .map((r, ri) => {
        const {FirstPointId, SecondPointId, Value} = r

        //check Ids && Type
        let potenialRelation = xRelationsFinal.find(ar => {
            const {firstIndex, secondIndex} = ar

            const potenial = ((firstIndex === FirstPointId) && (secondIndex === SecondPointId))
            
            return potenial
        })

        let status = false

        if(potenialRelation){
            const {relation: relationValue} = potenialRelation
            
            status = (Value === relationValue)
        }

        let result = ({
            ...r,
            status
        })

        return result
    })

    //Y
    const answerYRelations = Relations.filter(r => r.Type === RELATION_Y_POSITION_NUM)

    scoreRelations.push(...answerYRelations
    .map((r, ri) => {
        const {FirstPointId, SecondPointId, Value} = r

        //check Ids && Type
        let potenialRelation = yRelationsFinal.find(ar => {
            const {firstIndex, secondIndex} = ar

            const potenial = ((firstIndex === FirstPointId) && (secondIndex === SecondPointId))
            
            return potenial
        })

        let status = false

        if(potenialRelation){
            const {relation: relationValue} = potenialRelation
            
            status = (Value === relationValue)
        }

        let result = ({
            ...r,
            status
        })

        return result
    }))

    //Gradient
    const answerMRelations = Relations.filter(r => r.Type === RELATION_GRADIENT_NUM)

    scoreRelations.push(...answerMRelations
    .map((r, ri) => {
        const {FirstPointId, SecondPointId, Value} = r

        //check Ids && Type
        let potenialRelation = mRelationsFinal.find(ar => {
            const {firstIndex, secondIndex} = ar

            const potenial = ((firstIndex === FirstPointId) && (secondIndex === SecondPointId))
            
            return potenial
        })

        let status = false

        if(potenialRelation){
            const {relation: relationValue} = potenialRelation
            
            status = (Value === relationValue)
        }

        let result = ({
            ...r,
            status
        })

        return result
    }))

    let maxPoints = scorePointsPositionsShapes.reduce((r,c) => {
        const n = c.checks.length

        r = r + n

        return r
    }, 0)

    maxPoints = maxPoints + scoreRelations.length

    let totalPoints = scorePointsPositionsShapes.reduce((r,c) => {
        const n = c.checks.filter(a => a.status).length

        r = r + n

        return r
    }, 0)

    totalPoints = totalPoints + scoreRelations.filter(a => a.status).length

    return({
        scorePointsPositionsShapes,
        scoreRelations,
        maxPoints,
        totalPoints
    })
}

const getAngleFromSlope = (dx, dy) => {
    let _pheta = Math.atan2(dy, dx)

    if(_pheta < 0) _pheta = _pheta + Math.PI * 2
        
    return _pheta
}

const rotatePoint = (x, y, pheta) => {
    const _x = x * Math.cos(pheta) + y * Math.sin(pheta)
    const _y = -x * Math.sin(pheta) + y * Math.cos(pheta)

    return ({x: _x, y: _y})
}

export const limitCPPoint = (limitation, movedCPPointIndex, allPoints, mPoint, closedLoop) => {
    const point = allPoints[movedCPPointIndex]
    let nextPoint = allPoints[movedCPPointIndex + 1]
        
    if(!nextPoint && closedLoop) nextPoint = allPoints[0];
    if(!nextPoint) return mPoint

    const {x: x1, y: y1} = point
    const {x: x2, y: y2} = nextPoint
    const {x: mx, y: my} = mPoint

    const dx = (x2 - x1)
    const dy = (y2 - y1)

    const pheta = getAngleFromSlope(dx, dy)

    let x = (mx - x1) // move reference point
    let y = (my - y1) // move reference point

    let x2_base = (x2 - x1) // move reference point
    let y2_base = (y2 - y1) // move reference point

    const x_rotated = x * Math.cos(pheta) + y * Math.sin(pheta)
    const y_rotated = -x * Math.sin(pheta) + y * Math.cos(pheta)

    const x1_rotated = 0

    const x2_rotated = x2_base * Math.cos(pheta) + y2_base * Math.sin(pheta)
    
    //Limit x values
    const limited_x = Math.min(Math.max(x_rotated, x1_rotated /* MIN */), x2_rotated /* MAX */)

    //Limit y values
    const limited_y = Math.min(Math.max(y_rotated, -limitation /* MIN */), limitation /* MAX */)

    //Un rotate
    let {x: final_x, y: final_y} =  rotatePoint(limited_x, limited_y, -pheta) 

    //Un base
    final_x = final_x + x1
    final_y = final_y + y1

    return({
        x: final_x, 
        y: final_y
    })
}