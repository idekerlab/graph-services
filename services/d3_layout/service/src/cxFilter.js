// For a given CX, filter the result based on attributes.


const attributeFilter = (attr, attrName, value) => {
  if (attr.n === attrName && attr.v === value) {
    return true
  } else {
    return false
  }
}

const filterByAffribute = (cx, type, attrName, value) => {

  let attributes = []
  let objects = []

  if(type === 'node') {
    const nodeAttributes = cx.filter(element => (element.nodeAttributes !== undefined))
    const graphObjects = cx.filter(element => (element.nodes !== undefined))
    attributes = nodeAttributes[0].nodeAttributes
    objects = graphObjects[0].nodes

  } else if(type === 'edge'){
    const edgeAttributes = cx.filter(element => (element.edgeAttributes !== undefined))
    const graphObjects = cx.filter(element => (element.edges !== undefined))
    attributes = edgeAttributes[0].edgeAttributes
    objects = graphObjects[0].edges
  } else {
    return []
  }

  console.log("Type = " + type)
  console.log("Name = " + attrName)
  console.log("Val = " + value)

  const filtered = new Set(
    attributes
      .filter(attr => (attributeFilter(attr, attrName, value)))
      .map(at => (at.po))
  )

  const filteredObjects = objects.filter(obj => {
    if(filtered.has(obj['@id'])) {
      return true
    } else {
      return false
    }
  })



  console.log("Filtered Size = " + filteredObjects.length)
  return filteredObjects

}

const filter = (req, res) => {

  const cx = req.body
  const attrName = req.query.name
  const value = req.query.value
  const type = req.params.type
  const filtered = filterByAffribute(cx, type, attrName, value)


  res.json(filterByAffribute(cx, type, attrName, value))
}

module.exports.filter = filter
