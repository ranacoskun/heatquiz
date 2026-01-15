
const Algebrite = require('algebrite')


//Function check if the answer is the correct answer
export const checkKeyboardAnswerIsCorrect = (answer, possibleAnswers, isEnergyBalance) => {
    let currentAnswer = answer.List.reduce((b,a) => b += a.char, '')

    let _possibleAnswers = possibleAnswers
    .sort((a,b) => a.Id > b.Id ? 1 : -1)
    .map((a, i) => {
        let correct = false

        if(isEnergyBalance){
            //Get Index of =
            let CAnswer_Equal_Index = currentAnswer.indexOf('=')
            let CAnswer_Before = currentAnswer.substring(0, CAnswer_Equal_Index)
            let CAnswer_After = currentAnswer.substring(CAnswer_Equal_Index + 1, currentAnswer.length)

            let KAnswer = a.AnswerElements.reduce((b,a) => b += a.IsInteger ? a.TextPresentation : a.Value, '')
            let KAnswer_Equal_Index = KAnswer.indexOf('=')
            let KAnswer_Before = KAnswer.substring(0, KAnswer_Equal_Index)
            let KAnswer_After = KAnswer.substring(KAnswer_Equal_Index + 1, KAnswer.length)
                        
            let CEquivalent_Answer = "(" + CAnswer_Before + ")" + "-(" + CAnswer_After + ")"
            let KEquivalent_Answer = "(" + KAnswer_Before + ")" + "-(" + KAnswer_After  + ")"
                        
            correct = (SafeSimplify(`(${KEquivalent_Answer})-(${CEquivalent_Answer})`)) === '0'

            if(!correct){
                correct = (SafeSimplify(`(${KEquivalent_Answer})+(${CEquivalent_Answer})`)) === '0'
            }
        }
        else{
            correct = (SafeSimplify(`(${a.AnswerElements.reduce((b,a) => b += a.IsInteger ? a.TextPresentation : a.Value, '')})-(${currentAnswer})`)) === '0'
        }

        return({
            correct: correct, 
            index: i
        })
    })

    let finaCorrect = false

    for(let a of _possibleAnswers){
        finaCorrect = finaCorrect || a.correct
    }

    return({
        answerStatus: finaCorrect,
        possibleAnswers: _possibleAnswers.filter(a => a.correct).map((a) => a.index),
    })

}

export const checkKeyboardAnswerIsCorrectEnergyBalanceQuestionTermsOnly = (answer, possibleAnswers, isFlipped) => {
    let currentAnswer = answer.List.reduce((b,a) => b += a.char, '')

    let _possibleAnswers = possibleAnswers
    .sort((a,b) => a.Id > b.Id ? 1 : -1)
    .map((a, i) => {
        let correct = false

        if(!isFlipped){
            // A - B =? 0
            correct = (SafeSimplify(`(${a.AnswerElements.reduce((b,a) => b += a.IsInteger ? a.TextPresentation : a.Value, '')})-(${currentAnswer})`)) === '0'
        }
        else{
            // -A - B =? 0 => A + B =? 0
            correct = (SafeSimplify(`(${a.AnswerElements.reduce((b,a) => b += a.IsInteger ? a.TextPresentation : a.Value, '')})+(${currentAnswer})`)) === '0'
        }
        
        return({
            correct: correct, 
            index: i,
        })
    })

    let finaCorrect = false

    for(let a of _possibleAnswers){
        finaCorrect = finaCorrect || a.correct
    }

    return({
        answerStatus: finaCorrect,
        possibleAnswers: _possibleAnswers.filter(a => a.correct).map((a) => a.index),
    })

}


//Function to verify the validity of a keyboard question answer 
//This function does not check if the answer is the correct answer
export const validateKeyboardAnswer = (answer, isEnergyBalance) => {
        
    if(!answer.List.length){
        
        return "Answer cannot be empty"
    }

    if(answer.echoNumber){
        return "Please close brackts"
    }

    if(['*','-','+','/', '='].includes(answer.List.slice(-1)[0].code)){
      
        return "Last charachter cannot be an operand"
    }

    if(isEnergyBalance){
        let answerReduced = answer.List.reduce((b,a) => b += a.char, '')


        let equalCount = 0
        for(let c of answerReduced){
            if(c === '='){
                equalCount = equalCount + 1
            }
        }

        if(equalCount !== 1){
            return  "You should add one 'Equal =' operand"
        }

    }

    return null
}

//Function to simplify and solve mathematical algebraic expressions
export const SafeSimplify = (text) => {
    try {
        return Algebrite.run(text)
    } catch (error) {
        return ''
    }
}