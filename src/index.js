module.exports = function solveSudoku(matrix) {
  const numbers = [1,2,3,4,5,6,7,8,9];
  const length = numbers.length;
  const unresolved = [];
  const _path = [];
  const _matrix = [...matrix];

  const clear = () => {
      if(unresolved.length > 0){
          unresolved.pop();
          return clear()
      }
      return true
  };

  const possible = (i, j, matrix) => {
      let [l,m] = [Math.floor(i/3)*3, Math.floor(j/3)*3];
      const _coll = new Set(numbers.map((x, i) => matrix[i][j]));
      const _row = new Set(matrix[i]);
      const square = new Set(matrix.slice(l, l + 3).reduce((sub, arr) => [...sub, ...arr.slice(m, m + 3)], []));
      const excludes = [..._row, ..._coll, ...square];
      return numbers.filter((x, ind) => excludes.indexOf(x) < 0)
  };

  const checkMatrix = (matrix, i =0, j =0) => {
      if(matrix[i][j] === 0){
          return false;
      }
      return j < length - 1? checkMatrix(matrix, i, j + 1):
          i < length - 1? checkMatrix(matrix, i + 1, 0):
              true;
  };

  const findUnresolved = (matrix = _matrix, i = 0, j = 0) =>{
      if(matrix[i][j] === 0){
           unresolved.push([[i,j], possible(i, j, matrix)]);
      }
      return j < length - 1? findUnresolved(matrix, i, j + 1):
          i < length - 1? findUnresolved(matrix, i + 1, 0):
             true;
  };

  const addToPath = (unresolved, path = _path) => {
      const sorted = unresolved.sort((a, b) => a[1].length - b[1].length);
      path.push(sorted[0])
  };

  const checkValues = (values) => {
      for(let value of values){
          if(!value[1].length){
              return false
          }
      }
      return true
  };

  const nextIndex = (matrix, deep, path = _path) => {
      const i = path[deep][0][0];
      const j = path[deep][0][1];
      const previous =  matrix[i][j];
      const values = path[deep][1];
      const index = values.indexOf(previous);
      if(index < values.length -1){
          return index + 1
      }
      return false
  };

  const resolving = (matrix = _matrix, back = false) => {
      if(checkMatrix(matrix)){
          return matrix
      }
      const deep = _path.length - 1;
      let index = 0;
      if(back){
          index = nextIndex(matrix, deep);
          if(!index){
              let keys = _path.pop()[0];
              matrix[keys[0]][keys[1]] = 0;
              return resolving(matrix, true)
          }
      }
      const value = _path[deep][1][index];
      const keys = _path[deep][0];
      matrix[keys[0]][keys[1]] =  value;
      clear();
      findUnresolved();
      if(checkValues(unresolved)){
          addToPath(unresolved, _path);
          return  resolving(_matrix, false);
      }else{
          return resolving(_matrix, true)
      }
  };

  findUnresolved();
  addToPath(unresolved);
  return resolving();
};