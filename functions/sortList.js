export const sortCollectionList = (data, sortedBy, reverse) => {
    if(!data || data.length <= 0) return
    let sortedData;
    if(sortedBy === 1) { // by date
      sortedData = data.sort((a, b) => a.creationDate > b.creationDate)
    } else { // by name
      sortedData = data.sort((a, b) => a.key.toLowerCase().localeCompare(b.key.toLowerCase())) // Sort by name
      if(sortedBy !== 0) // by name + itemcount
        sortedData = data.sort((a, b) => a.itemCount < b.itemCount)
    }
    if(reverse)
      sortedData = sortedData.reverse()
    return sortedData
}

export const sortItemList = (data, sortedBy, reverse) => {
    if(!data || data.length <= 0) return
    let sortedData;
    if(sortedBy === 1) { // by date
      sortedData = data.sort((a, b) => a.added > b.added)
    } else { // by name
      sortedData = data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) // Sort by name
      if(sortedBy !== 0) // by name + itemcount
        sortedData = data.sort((a, b) => a.amount < b.amount)
    }
    if(reverse)
      sortedData = sortedData.reverse()
    return sortedData
}
