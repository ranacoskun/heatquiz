
export const getRandomSeriesElements = (elements, randomSize) => {
    let finalElements = []

    let randomIds = getRandom_Pools(elements, randomSize)
        
    finalElements = randomIds.map((Id) => {
        return elements.filter((e) => e.Id === Id)[0]
    })

    return finalElements
}

export function getRandom_Pools(elements, size) {
    let selectedIds = []

    //sort questions by pools 
    const elementsByPoolNumber = elements.reduce((groups, item) => {
        const group = (groups[item.PoolNumber] || []);
        group.push(item);
        groups[item.PoolNumber] = group;
        return groups;
      }, {});
    
    //Query question pools
    let n_pools = Object.keys(elementsByPoolNumber).length
    let pool_keys = Object.keys(elementsByPoolNumber)

    for (let i = 0; i<size; i++){
        let pool_index = (i%n_pools)
        let q_array = elementsByPoolNumber[pool_keys[pool_index]]

        //get a random question from that loop that was not selected
        let randomId = null
 
        while(!randomId || selectedIds.includes(randomId)){
            randomId = q_array[Math.floor(Math.random()*q_array.length)]
        }

        selectedIds.push(randomId.Id)
    }

    return selectedIds
}