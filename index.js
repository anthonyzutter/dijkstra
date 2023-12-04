const fs = require("fs");
const filePath = "./distancias.txt";
const data = fs.readFileSync(filePath, "utf8").split("\n");

class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

class Graph {
  constructor() {
    this.nodes = {};
  }

  addEdge(source, target, weight) {
    if (!this.nodes[source]) {
      this.nodes[source] = {};
    }
    this.nodes[source][target] = weight;
  }
}

const shortestDistanceNode = (distances, visited) => {
  let shortest = null;

  for (let node in distances) {
    let currentIsShortest = shortest === null || distances[node] < distances[shortest];
    if (currentIsShortest && !visited.includes(node)) {
      shortest = node;
    }
  }
  return shortest;
};

const findShortestPath = (graph, startNode, endNode) => {
  let distances = {};
  distances[endNode] = "Infinity";
  distances = Object.assign(distances, graph[startNode]);

  let parents = { endNode: null };
  for (let child in graph[startNode]) {
    parents[child] = startNode;
  }

  let visited = [];

  let node = shortestDistanceNode(distances, visited);

  while (node) {
    let distance = distances[node];
    let children = graph[node];
    for (let child in children) {
      if (String(child) === String(startNode)) {
        continue;
      } else {
        let newdistance = distance + children[child];
        if (!distances[child] || distances[child] > newdistance) {
          distances[child] = newdistance;
          parents[child] = node;
        }
      }
    }
    visited.push(node);
    node = shortestDistanceNode(distances, visited);
  }

  let shortestPath = [endNode];
  let parent = parents[endNode];
  while (parent) {
    shortestPath.push(parent);
    parent = parents[parent];
  }
  shortestPath.reverse();

  let results = {
    distance: distances[endNode],
    path: shortestPath,
  };

  return results;
};

const graph = new Graph();

for (const entry of data) {
  const [source, target, weight] = entry.trim().split(";");
  graph.addEdge(source, target, parseInt(weight, 10));
}

const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "1) Listar os valores em Pilha\n2) Listar os valores em Fila\n3) Calcular a distância entre dois pontos(Manaus;Natal)\n",
  (option) => {
    switch (option) {
      case "1":
        const stack = new Stack();
        data.forEach((entry) => stack.push(entry.trim()));
        while (!stack.isEmpty()) {
          console.log(stack.pop());
        }
        rl.close();
        break;
      case "2":
        const queue = new Queue();
        data.forEach((entry) => queue.enqueue(entry.trim()));
        while (!queue.isEmpty()) {
          console.log(queue.dequeue());
        }
        rl.close();
        break;
      default:
        const [startNode, endNode] = option.trim().split(";");
        const result = findShortestPath(graph.nodes, startNode, endNode);
        console.log(`Distância entre ${startNode} e ${endNode}: ${result.distance}`);
        console.log(`Caminho: ${result.path}`);
        rl.close();
    }
    rl.close();
  }
);
