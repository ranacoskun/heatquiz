export function validateChoices(choices){
    if(!choices) return false;

    if(!choices.length) return false;

    const value = choices.map(c => c.Type).reduce((r, c) => r += c, 0)
    if(value < 4) return false;

    return true
}