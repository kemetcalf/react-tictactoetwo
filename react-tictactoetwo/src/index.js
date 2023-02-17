import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		console.log(i);

		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		let gameBoard = [];
		for (let row = 0; row < 3; row++) {
			let boardRow = [];
			for (let col = 0; col < 3; col++) {
				boardRow.push(
					<span key={row * 3 + col}>{this.renderSquare(row * 3 + col)}</span>
				);
			}
			gameBoard.push(<div key={row}>{boardRow}</div>);
		}

		return (
			<div>
				<div>{gameBoard}</div>
			</div>
		);
	}
}

function makeCoordinates(index) {
	function column(index) {
		const colModulo = index % 3;
		if (colModulo < 1) {
			return [1];
		} else if (colModulo === 1) {
			return [2];
		} else if (colModulo === 2) {
			return [3];
		} else return null;
	}

	function row(index) {
		const rowRemainder = index / 3;
		if (rowRemainder < 1) {
			return [1];
		} else if (rowRemainder >= 1 && rowRemainder < 2) {
			return [2];
		} else if (rowRemainder >= 2 && rowRemainder < 3) {
			return [3];
		} else return null;
	}

	const coordinate = column(index).concat(row(index));

	return coordinate;
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{ squares: Array(9).fill(null) }],
			stepNumber: 0,
			xIsNext: true,
			coordinate: [],
			coordHistory: [],
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const currentCoords = makeCoordinates(i);

		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([{ squares: squares }]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
			coordinate: currentCoords,
			coordHistory: [...this.state.coordHistory, currentCoords],
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0,
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		// console.log(current);
		const winner = calculateWinner(current.squares);

		// console.log(this.state.coordHistory);
		// console.log(this.state.coordinate);
		const active = { fontWeight: "bold" };
		const inactive = { fontWeight: "normal" };

		const moves = history.map((step, move) => {
			const desc = move
				? "Go to move #" + move + " at " + this.state.coordHistory[move - 1]
				: "Go to game start";

			return (
				<li key={move}>
					<button
						onClick={() => this.jumpTo(move)}
						style={this.state.stepNumber === move ? active : inactive}
					>
						{desc}
					</button>
				</li>
			);
		});

		let status;
		if (winner) {
			status = "Winner: " + winner;
		} else {
			status = "Next player: " + (this.state.xIsNext ? "X" : "O");
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
