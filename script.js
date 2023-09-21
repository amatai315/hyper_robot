const place_size = 10;
const pieceBoardPlaceVerticalNum = 8;
const fullBoardPlaceVerticalNum = pieceBoardPlaceVerticalNum * 2;
const fullBoardHeight = place_size * fullBoardPlaceVerticalNum;
const fullBoardWidth = fullBoardHeight;
const offset = 20;
const canvasWidth = fullBoardWidth + offset * 2;
const canvasHeight = fullBoardHeight + offset * 2;
const boardBackgroundColor = "rgb(230,230,230)";
const normalPlaceLineColor = "rgb(150,150,150)";
const wallColor = "rgb(100,100,100)";
const normalPlaceLineStrokeWidth = 0.3;
const robot_num = 4;

let isAvailableBoardWithMirror = false;

class Mark {
    constructor(color, shape, x, y) {
        this.color = color;
        this.shape = shape;
        this.x = x;
        this.y = y;
    }
    get getMarkRotate90Degree() {
        const new_shape =
            this.shape == "slash" ? "backslash" :
                this.shape == "backslash" ? "slash" :
                    this.shape;
        return new Mark(this.color, new_shape, this.y, pieceBoardPlaceVerticalNum - 1 - this.x);
    }
}
class Wall {
    constructor(direction, x, y) {
        this.direction = direction;
        this.x = x;
        this.y = y;
    }
    get getWallRotate90Degree() {
        const new_direction =
            this.direction == "vertical" ? "horizontal" : "vertical";
        if (this.direction == "vertical") {
            return new Wall(new_direction, this.y, pieceBoardPlaceVerticalNum - this.x);
        } else {
            return new Wall(new_direction, this.y, pieceBoardPlaceVerticalNum - 1 - this.x);
        }
    }
}
class Board {
    constructor(color, place_mark_array, wall_array) {
        this.color = color;
        this.place_mark_array = place_mark_array;
        this.wall_array = wall_array;
    }
    get getBoardRotate90Degree() {
        return new Board(this.color,
            this.place_mark_array.map((mark) => mark.getMarkRotate90Degree),
            this.wall_array.map((wall) => wall.getWallRotate90Degree));
    }
}

const blue_board_array = [
    new Board("blue",
        [new Mark("green", "star", 3, 2), new Mark("red", "saturn", 5, 3), new Mark("blue", "sun", 2, 4), new Mark("yellow", "moon", 4, 5)],
        [new Wall("horizontal", 3, 2), new Wall("vertical", 3, 2), new Wall("vertical", 5, 3), new Wall("horizontal", 5, 4), new Wall("horizontal", 7, 4),
        new Wall("horizontal", 2, 4), new Wall("vertical", 3, 4), new Wall("vertical", 5, 5), new Wall("horizontal", 4, 6), new Wall("vertical", 2, 7)]),
    new Board("blue",
        [new Mark("green", "star", 6, 1), new Mark("red", "saturn", 3, 2), new Mark("blue", "sun", 1, 4), new Mark("yellow", "moon", 5, 6)],
        [new Wall("horizontal", 6, 1), new Wall("vertical", 6, 1), new Wall("vertical", 3, 2), new Wall("horizontal", 3, 3), new Wall("horizontal", 7, 3),
        new Wall("horizontal", 1, 4), new Wall("vertical", 2, 4), new Wall("vertical", 6, 6), new Wall("horizontal", 5, 7), new Wall("vertical", 3, 7)]),
    new Board("blue",
        [new Mark("green", "star", 2, 6), new Mark("red", "saturn", 6, 5), new Mark("blue", "sun", 5, 1), new Mark("yellow", "moon", 1, 3)],
        [new Wall("vertical", 5, 1), new Wall("horizontal", 5, 2), new Wall("vertical", 2, 3), new Wall("horizontal", 1, 4), new Wall("horizontal", 7, 4),
            new Wall("horizontal", 6, 5), new Wall("vertical", 7, 5), new Wall("horizontal", 2, 6), new Wall("vertical", 2, 6), new Wall("vertical", 4, 7)]),
    new Board("blue",
        [new Mark("green", "star", 2, 5), new Mark("red", "saturn", 6, 2), new Mark("blue", "sun", 3, 0), new Mark("yellow", "moon", 1, 5), new Mark("red", "backslash", 0, 3), new Mark("blue", "slash", 5, 6)],
        [new Wall("vertical", 3, 0), new Wall("horizontal", 3, 1), new Wall("horizontal", 7, 1), new Wall("horizontal", 6, 2), new Wall("vertical", 7, 2), new Wall("horizontal", 2, 5), new Wall("vertical", 2, 5), new Wall("horizontal", 1, 6), new Wall("vertical", 5, 7)])
];
const green_board_array = [
    new Board("green",
        [new Mark("blue", "saturn", 3, 1), new Mark("red", "moon", 6, 3), new Mark("yellow", "star", 1, 4), new Mark("green", "sun", 4, 6)],
        [new Wall("horizontal", 7, 1), new Wall("vertical", 3, 1), new Wall("horizontal", 3, 2), new Wall("horizontal", 6, 3), new Wall("vertical", 7, 3),
            new Wall("horizontal", 1, 4), new Wall("vertical", 1, 4), new Wall("vertical", 5, 6), new Wall("horizontal", 4, 7), new Wall("vertical", 6, 7)]),
    new Board("green",
        [new Mark("blue", "saturn", 1, 2), new Mark("red", "moon", 4, 1), new Mark("yellow", "star", 1, 6), new Mark("green", "sun", 6, 5)],
        [new Wall("horizontal", 4, 1), new Wall("vertical", 5, 1), new Wall("horizontal", 7, 2), new Wall("vertical", 1, 2), new Wall("horizontal", 1, 3),
            new Wall("vertical", 7, 5), new Wall("horizontal", 6, 6), new Wall("horizontal", 1, 6), new Wall("vertical", 1, 6), new Wall("vertical", 3, 7)]),
    new Board("green",
        [new Mark("blue", "saturn", 4, 1), new Mark("red", "moon", 3, 6), new Mark("yellow", "star", 1, 4), new Mark("green", "sun", 6, 5)],
        [new Wall("horizontal", 4, 1), new Wall("vertical", 5, 1), new Wall("horizontal", 7, 2), new Wall("vertical", 1, 4), new Wall("horizontal", 1, 4), new Wall("vertical", 6, 5), new Wall("horizontal", 6, 6), new Wall("vertical", 4, 6), new Wall("horizontal", 3, 7), new Wall("vertical", 6, 7)]),
    new Board("green",
        [new Mark("blue", "saturn", 4, 1), new Mark("red", "moon", 6, 4), new Mark("yellow", "star", 1, 3), new Mark("green", "sun", 5, 1), new Mark("yellow", "backslash", 2, 0), new Mark("green", "slash", 3, 6)],
        [new Wall("horizontal", 4, 1), new Wall("vertical", 5, 1), new Wall("horizontal", 5, 2), new Wall("horizontal", 7, 2), new Wall("horizontal", 1, 3), new Wall("vertical", 1, 3), new Wall("vertical", 7, 4), new Wall("horizontal", 6, 5), new Wall("vertical", 2, 7)])
];
const red_board_array = [
    new Board("red",
        [new Mark("blue", "star", 4, 1), new Mark("yellow", "saturn", 2, 2), new Mark("red", "sun", 6, 4), new Mark("green", "moon", 3, 6)],
        [new Wall("horizontal", 4, 1), new Wall("vertical", 4, 1), new Wall("vertical", 3, 2), new Wall("horizontal", 2, 3), new Wall("horizontal", 7, 2),
            new Wall("horizontal", 6, 4), new Wall("vertical", 7, 4), new Wall("vertical", 3, 6), new Wall("horizontal", 3, 7), new Wall("vertical", 6, 7)]),
    new Board("red",
        [new Mark("blue", "star", 5, 3), new Mark("yellow", "saturn", 0, 2), new Mark("red", "sun", 6, 6), new Mark("green", "moon", 1, 5)],
        [new Wall("horizontal", 7, 2), new Wall("vertical", 1, 2), new Wall("horizontal", 0, 3), new Wall("horizontal", 5, 3), new Wall("vertical", 5, 3), new Wall("vertical", 1, 5), new Wall("horizontal", 1, 6), new Wall("horizontal", 6, 6), new Wall("vertical", 7, 6), new Wall("vertical", 4, 7)]),
    new Board("red",
        [new Mark("blue", "star", 2, 5), new Mark("yellow", "saturn", 6, 1), new Mark("red", "sun", 0, 2), new Mark("green", "moon", 5, 3)],
        [new Wall("vertical", 7, 1), new Wall("horizontal", 6, 2), new Wall("horizontal", 7, 3), new Wall("horizontal", 0, 2), new Wall("vertical", 1, 2), new Wall("vertical", 5, 3), new Wall("horizontal", 5, 4), new Wall("horizontal", 2, 5), new Wall("vertical", 2, 5), new Wall("vertical", 4, 7)]),
    new Board("red",
        [new Mark("blue", "star", 1, 5), new Mark("yellow", "saturn", 2, 1), new Mark("red", "sun", 4, 3), new Mark("green", "moon", 5, 3), new Mark("yellow", "backslash", 1, 4), new Mark("blue", "backslash", 3, 6)],
        [new Wall("vertical", 3, 1), new Wall("horizontal", 2, 2), new Wall("horizontal", 4, 3), new Wall("vertical", 5, 3), new Wall("horizontal", 5, 4), new Wall("horizontal", 7, 5), new Wall("horizontal", 1, 5), new Wall("vertical", 1, 5), new Wall("vertical", 3, 7)])
];
const yellow_board_array = [
    new Board("yellow",
        [new Mark("yellow", "sun", 6, 1), new Mark("green", "saturn", 1, 2), new Mark("red", "star", 4, 3), new Mark("rainbow", "vortex", 0, 5), new Mark("blue", "moon", 2, 6)],
        [new Wall("vertical", 6, 1), new Wall("horizontal", 6, 2), new Wall("vertical", 2, 2), new Wall("horizontal", 1, 3), new Wall("horizontal", 4, 3), new Wall("vertical", 4, 3),
            new Wall("horizontal", 7, 4), new Wall("horizontal", 0, 5), new Wall("vertical", 0, 5), new Wall("horizontal", 2, 6), new Wall("vertical", 3, 6), new Wall("vertical", 5, 7)]),
    new Board("yellow",
        [new Mark("yellow", "sun", 6, 4), new Mark("green", "saturn", 2, 3), new Mark("red", "star", 5, 2), new Mark("rainbow", "vortex", 0, 2), new Mark("blue", "moon", 1, 6)],
        [new Wall("horizontal", 7, 1), new Wall("horizontal", 0, 2), new Wall("horizontal", 5, 2), new Wall("vertical", 0, 2), new Wall("vertical", 5, 2), new Wall("vertical", 3, 3), new Wall("horizontal", 2, 4), new Wall("vertical", 6, 4), new Wall("horizontal", 6, 5), new Wall("horizontal", 1, 6), new Wall("vertical", 2, 6), new Wall("vertical", 4, 7)]),
    new Board("yellow",
        [new Mark("yellow", "sun", 1, 3), new Mark("green", "saturn", 6, 4), new Mark("red", "star", 5, 6), new Mark("rainbow", "vortex", 4, 0), new Mark("blue", "moon", 2, 1)],
        [new Wall("horizontal", 4, 0), new Wall("vertical", 4, 0), new Wall("vertical", 2, 1), new Wall("horizontal", 2, 2), new Wall("vertical", 2, 3), new Wall("horizontal", 1, 4), new Wall("horizontal", 7, 3), new Wall("horizontal", 6, 4), new Wall("vertical", 7, 4), new Wall("horizontal", 5, 6), new Wall("vertical", 5, 6), new Wall("vertical", 3, 7)]),
    new Board("yellow",
        [new Mark("yellow", "sun", 1, 5), new Mark("green", "saturn", 4, 4), new Mark("red", "star", 6, 2), new Mark("rainbow", "vortex", 2, 0), new Mark("blue", "moon", 5, 4), new Mark("green", "backslash", 4, 1), new Mark("red", "backslash", 5, 6)],
        [new Wall("horizontal", 2, 0), new Wall("vertical", 2, 0), new Wall("horizontal", 7, 1), new Wall("horizontal", 6, 2), new Wall("vertical", 6, 2), new Wall("horizontal", 4, 4), new Wall("vertical", 5, 4), new Wall("horizontal", 5, 5), new Wall("vertical", 2, 5), new Wall("horizontal", 1, 6), new Wall("vertical", 3, 7)])
];



const canvas = d3
    .select("#board-svg-wrapper")
    .append("svg")
    .style("height", "100%")
    .style("width", "100%")
    .attr("viewBox", `0 0 ${canvasWidth} ${canvasHeight}`);
const board = canvas
    .append("rect")
    .attr("x", offset)
    .attr("y", offset)
    .attr("width", fullBoardWidth)
    .attr("height", fullBoardHeight)
    .attr("fill", boardBackgroundColor);
for (let i = 0; i < fullBoardPlaceVerticalNum + 1; i++) {
    canvas
        .append("line")
        .attr("x1", offset + place_size * i)
        .attr("y1", offset)
        .attr("x2", offset + place_size * i)
        .attr("y2", offset + fullBoardHeight)
        .attr("stroke", normalPlaceLineColor)
        .attr("stroke-width", normalPlaceLineStrokeWidth);
    canvas
        .append("line")
        .attr("x1", offset)
        .attr("y1", offset + place_size * i)
        .attr("x2", offset + fullBoardHeight)
        .attr("y2", offset + place_size * i)
        .attr("stroke", normalPlaceLineColor)
        .attr("stroke-width", normalPlaceLineStrokeWidth);
}
const board_stroke = canvas
    .append("rect")
    .attr("x", offset)
    .attr("y", offset)
    .attr("width", fullBoardWidth)
    .attr("height", fullBoardHeight)
    .attr("fill", "rgba(0,0,0,0)")
    .attr("stroke", wallColor)
    .attr("stroke-width", 2);
const board_center = canvas
    .append("rect")
    .attr("x", offset + place_size * (pieceBoardPlaceVerticalNum - 1))
    .attr("y", offset + place_size * (pieceBoardPlaceVerticalNum - 1))
    .attr("width", place_size * 2)
    .attr("height", place_size * 2)
    .attr("fill", wallColor);
function getPlaceCoordinateFullBoard(element, quadrant) {
    let x = element.x;
    if (quadrant == 0 || quadrant == 1) x += pieceBoardPlaceVerticalNum;
    let y = element.y;
    if (quadrant == 0 || quadrant == 3) y += pieceBoardPlaceVerticalNum;
    return [x, y];
}
function drawMark(mark, quadrant) {
    const [placeCoordinateX, placeCoordinateY] = getPlaceCoordinateFullBoard(mark, quadrant);
    const markX = offset + place_size * placeCoordinateX;
    const markY = offset + place_size * placeCoordinateY;
    canvas
        .append("image")
        .attr("class", "mark")
        .attr("href", `./image/${mark.color}_${mark.shape}.png`)
        .attr("width", place_size - 2)
        .attr("height", place_size - 2)
        .attr("x", markX + 1)
        .attr("y", markY + 1);
}
function drawWall(wall, quadrant) {
    const [placeCoordinateX, placeCoordinateY] = getPlaceCoordinateFullBoard(wall, quadrant);
    const x1 = offset + place_size * placeCoordinateX;
    const y1 = offset + place_size * placeCoordinateY;
    let x2 = x1;
    let y2 = y1;
    if (wall.direction == "vertical") {
        y2 += place_size;
    } else {
        x2 += place_size;
    }
    canvas
        .append("line")
        .attr("class", "wall")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", wallColor)
        .attr("stroke-width", 2);
}

function deleteFullBoard() {
    d3.selectAll(".mark").remove();
    d3.selectAll(".wall").remove();
}

function drawFullBoard() {
    const color_array = [];
    const number_array = [0, 1, 2, 3];
    for (let i = 0; i < 4; i++){
        const rand = Math.floor(Math.random() * (4 - i));
        color_array.push(number_array[rand]);
        number_array.splice(rand, 1);
    }
    for (let quadrant = 0; quadrant < 4; quadrant++){
        let board;
        const rand = isAvailableBoardWithMirror ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 3)
        switch (color_array[quadrant]) {
            case 0:
                board = blue_board_array[rand];
                break;
            case 1:
                board = green_board_array[rand];
                break;
            case 2:
                board = red_board_array[rand];
                break;
            case 3:
                board = yellow_board_array[rand];
                break;
        }
        for (let i = 0; i < quadrant; i++){
            board = board.getBoardRotate90Degree;
        }
        board.place_mark_array.forEach(place_mark => {
            drawMark(place_mark, quadrant);
        })
        board.wall_array.forEach(wall => {
            drawWall(wall, quadrant);
        })
    }
}

function redrawFullBoard() {
    deleteFullBoard();
    drawFullBoard();
}

function redrawRobotIcon() {
    d3.selectAll(".robot").remove();
    const place_number_array = [16 * 7 + 7, 16 * 7 + 8, 16 * 8 + 7, 16 * 8 + 8];
    let color_array = ["rgb(0,0,255)", "rgb(0, 255,0)", "rgb(255,0,0)", "rgb(209, 217, 0)", "rgb(0,0,0)"];
    for (let i = 0; i < robot_num; i++){
        let place_number = Math.floor(Math.random() * 16 * 16);
        while (place_number_array.includes(place_number)) {
            place_number = Math.floor(Math.random() * 16 * 16);
        }
        place_number_array.push(place_number)
        const placeCoordinateX = place_number % 16;
        const placeCoordinateY = Math.floor(place_number / 16);
        canvas.append("rect")
            .attr("class", "robot")
            .attr("fill", color_array[i])
            .attr("x", offset + placeCoordinateX * place_size + 2)
            .attr("y", offset + placeCoordinateY * place_size + 2)
            .attr("width", 6)
            .attr("height", 6)
            .attr("stroke", "rgb(0,0,0)");
    }
}

function redrawGoalRepresentIcon() {
    d3.selectAll(".goal-represent-mark").remove();
    const goal_id = Math.floor(Math.random() * 17);
    let color, mark;
    if (goal_id == 16) {
        color = "rainbow";
        mark = "vortex";
    } else {
        switch (goal_id % 4) {
            case 0:
                color = "blue";
                break;
            case 1:
                color = "green";
                break;
            case 2:
                color = "red";
                break;
            case 3:
                color = "yellow";
                break;
        }
        switch (Math.floor(goal_id / 4)){
            case 0:
                mark = "moon";
                break;
            case 1:
                mark = "saturn";
                break;
            case 2:
                mark = "star";
                break;
            case 3:
                mark = "sun";
                break;
        }
    }
    canvas
        .append("image")
        .attr("class", "goal-represent-mark")
        .attr("href", `./image/${color}_${mark}.png`)
        .attr("width", 2 * place_size - 4)
        .attr("height", 2 * place_size - 4)
        .attr("x", offset + place_size * (pieceBoardPlaceVerticalNum - 1) + 2)
        .attr("y", offset + place_size * (pieceBoardPlaceVerticalNum - 1) + 2);
}

function updateRobotAndGoal() {
    redrawRobotIcon();
    redrawGoalRepresentIcon();
}

function updateFullBoardAndRobotAndGoal() {
    redrawFullBoard();
    updateRobotAndGoal();
}

function changeMirrorAvailability() {
    isAvailableBoardWithMirror = !isAvailableBoardWithMirror;
}

drawFullBoard();
redrawGoalRepresentIcon();
redrawRobotIcon();
