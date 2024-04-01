export type TreeNode = {
    type: 'node';
    value: number;
    name: string;
    children: Tree[];
  };
  export type TreeLeaf = {
    type: 'leaf';
    name: string;
    value: number;
  };
  
  export type Tree = TreeNode | TreeLeaf;
  
  export const data: Tree = {
    type: 'node',
    name: "boss",
    value: 0,
    children: [
      {type: 'leaf', name:"Sport Complex", value: 1.1},
      {type: 'leaf', name:"Jogging Track", value: 0.95},
      {type: 'leaf', name:"Gym", value: 0.4},
      {type: 'leaf', name:"Fitness Corner", value: 1.45},
      {type: 'leaf', name:"Park", value: 12.5},
      {type: 'leaf', name:"Library", value: 1.75},
      {type: 'leaf', name:"Club House", value: 1.45},
      {type: 'leaf', name:"Void Deck", value: 3.9},
      {type: 'leaf', name:"Shelter", value: 0.55},
      {type: 'leaf', name:"Resident Cornet", value: 0.45},
      {type: 'leaf', name:"Precint Pavilion", value: 0.4},
      {type: 'leaf', name:"Corridor", value: 0.55},
      {type: 'leaf', name:"Senior Centre", value: 0.25},
      {type: 'leaf', name:"Resident Committee", value: 0.65},
      {type: 'leaf', name:"Family & Friends Home", value: 1.4},
      {type: 'leaf', name:"Community Centre", value: 1.8},
      {type: 'leaf', name:"Supermarket", value: 6.25},
      {type: 'leaf', name:"Shops at town centre", value: 2.65},
      {type: 'leaf', name:"Shopping Centre/Complex", value: 35.05},
      {type: 'leaf', name:"Others", value: 0.5},
      {type: 'leaf', name:"Market/Stall", value: 5.5},
      {type: 'leaf', name:"HDB Neighbourhood centre", value: 0.9},
      {type: 'leaf', name:"Hawker centre", value: 4.85},
      {type: 'leaf', name:"Food Services", value: 1},
      {type: 'leaf', name:"Food Court", value: 1.4},
      {type: 'leaf', name:"Eating House/Coffee Shop", value: 9.95},
      {type: 'leaf', name:"Convenience Store", value: 0.65},
      {type: 'leaf', name:"Community Hub", value: 0.7},
      {type: 'leaf', name:"Religious", value: 1.4}]
  }
  