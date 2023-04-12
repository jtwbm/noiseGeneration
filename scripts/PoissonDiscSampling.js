const attempts = 25;
const radius = 20;
const cellWidth = radius / Math.sqrt(2); // 2 dimensions

const grid = [];
const activePoints = [];
const pointsAttempts = [];

let gridColumns, gridRows;

function setup() {
  createCanvas(600, 600);
  background(55);
  strokeWeight(4);

  // initialize grid
  gridColumns = floor(width / cellWidth);
  gridRows = floor(height / cellWidth);

  grid.length = gridColumns * gridRows;
  grid.fill(-1);

  // get 1st random point
  const x = random(width);
  const y = random(height);
  const i = floor(x / cellWidth);
  const j = floor(y / cellWidth);
  const position = createVector(x, y);
  const cellIndex = i + j * gridColumns;

  // add point to grid arrays
  grid[cellIndex] = position;
  activePoints.push(position);
  pointsAttempts[cellIndex] = 1;
}

function draw() {
  background(0);
  noLoop();

  while (activePoints.length > 0) {
    const randomPointIndex = floor(random(activePoints.length));
    const position = activePoints[randomPointIndex];
    let pointFounded = false;

    for (let n = 0; n < attempts; n++) {
      // generate random point
      const candidate = p5.Vector.random2D();
      const magnitude = random(radius, radius * 2);

      candidate.setMag(magnitude);
      candidate.add(position);

      // get point index in grid
      const columnIndex = floor(candidate.x / cellWidth);
      const rowIndex = floor(candidate.y / cellWidth);
      const cellFilled = grid[columnIndex + rowIndex * gridColumns] !== -1;
      const isInsideGrid = columnIndex > -1 && rowIndex > -1 && columnIndex < gridColumns && rowIndex < gridRows;

      if (isInsideGrid && !cellFilled) {
        // check points around
        let isGoodPoint = true; // the candidate is far enough from neighbors
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const neighborIndex = (columnIndex + i) + (rowIndex + j) * gridColumns;
            const neighborPoint = grid[neighborIndex];
            if (neighborPoint === undefined || neighborPoint === -1) continue;

            const distanceBetweenPoints = p5.Vector.dist(candidate, neighborPoint);
            if (distanceBetweenPoints < radius) {
              isGoodPoint = false;
            }
          }
        }

        if (isGoodPoint) {
          // add new point
          grid[columnIndex + rowIndex * gridColumns] = candidate;
          activePoints.push(candidate);
          pointsAttempts[columnIndex + rowIndex * gridColumns] = n + 1;
        }
      }
    }

    if (!pointFounded) {
      activePoints.splice(randomPointIndex, 1);
    }
  }

  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === -1) continue;

    stroke(pointsAttempts[i] * 10);
    strokeWeight(5);
    point(grid[i].x, grid[i].y);
  }
}
