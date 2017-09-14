const d3Hierarchy = require('d3-hierarchy')


const toD3Tree = (is, rootNodeId, callback) => {
  console.log('---From cx to d3 tree ----')

  const networks = {}

  is.on('data', networkElement => {

    const label = networkElement.label

    if (!(label in networks)) {
      networks[label] = [{name: rootNodeId, parent: ''}]
    }

    if (networkElement.element === 'edge') {

      const edge = networkElement.edge
      if (edge.sourceId === rootNodeId){
        console.log("The root node has parent. You must specify other node as 'root' parameter")
      }
      networks[label].push({
        name: edge.sourceId,
        parent: edge.targetId,
      })
    }
  })

  is.on('end', () => {

    console.log('---END of stream ----')

    for (let network in networks) {
      console.log('--- Calling strat3  ----')

      console.log(networks[network])

      const net = d3Hierarchy.stratify()
        .id(d => d.name)
        .parentId(d => d.parent)(networks[network])

      callback(net)
    }
  })
}

const fromD3Tree = (tree, label, callback) => {
  // TODO: data.represents
  // TODO: attribute
  // TODO: interaction of edges
  console.log('--- d3 tree 2 CX ----');
  // console.log(tree);

  // breadth first 
  let node_queue = [tree];
  for (let i = 0; i < node_queue.length; i++) {  // length will change during iteration.
    let node = node_queue[i];
    let node_id = node.id;
    let data = node.data;
    callback({
      label: label,
      element: 'node',
      node: {
        id: node_id,
        name: data.name,
        represents: "",
      },
    });
    callback({
      label: label,
      element: 'edge',
      edge: {
        id: i.toString(),
        sourceId: node_id,
        targetId: node.data.parent,
        interaction: "",
      },
    });
    Array.prototype.push.apply(node_queue, node.children);
    // for (let nodeAttr in data) {
    //   let type = typeof data[nodeAttr];
    //   callback({
    //     label: label,
    //     element: 'nodeAttribute',
    //     nodeAttribute: {
    //       nodeId: id,
    //       name: nodeAttr,
    //       value: data[nodeAttr].toString(),
    //       type: type,
    //     },
    //   });
    // }
  }
  // for (let edge of cy.elements('edge').toArray()) {
  //   let id = this.stripId(edge.data().id);
  //   let data = edge.data();
  //   callback({
  //     label: label,
  //     element: 'edge',
  //     edge: {
  //       id: id,
  //       sourceId: this.stripId(data.source),
  //       targetId: this.stripId(data.target),
  //       interaction: data.interaction,
  //     },
  //   });
  //   delete data.id;
  //   delete data.source;
  //   delete data.target;
  //   delete data.interaction;
  //   for (let edgeAttr in data) {
  //     let type = typeof data[edgeAttr];
  //     callback({
  //       label: label,
  //       element: 'edgeAttribute',
  //       edgeAttribute: {
  //         edgeId: id,
  //         name: edgeAttr,
  //         value: data[edgeAttr].toString(),
  //         type: type,
  //       },
  //     });
  //   }
  // }

  // for (let networkAttr in model.data) {
  //   let type = typeof model.data[networkAttr];
  //   callback({
  //     label: label,
  //     element: 'networkAttribute',
  //     networkAttribute: {
  //       name: networkAttr,
  //       value: model.data[networkAttr].toString(),
  //       type: type,
  //     },
  //   });
  // }
}


module.exports.toD3Tree = toD3Tree
module.exports.fromD3Tree = fromD3Tree
