import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
	return (
		<button
			className="square"
			onClick={props.onClick}
			style={{ color: "green" }}
		>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		// console.log(i);

		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
				className=""
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
			order: true,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const selected = history[this.state.stepNumber];
		const squares = selected.squares.slice();
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

	switchOrder(move) {
		this.setState({ order: !this.state.order });
	}

	render() {
		const active = { fontWeight: "bold" };
		const inactive = { fontWeight: "normal" };

		const history = this.state.history;
		const selected = history[this.state.stepNumber];

		const finalResults = calculateWinner(selected.squares);
		console.log("finalResults:");
		console.log(finalResults);

		let winner;
		if (finalResults) {
			winner = finalResults.winner;
		} else {
			winner = null;
		}

		const moves = history.map((step, move) => {
			// console.log(step);
			// console.log(move);
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

		// TODO: UPDATE STATUS TO REMAIN 'WINNER' WHEN GAME IS DONE;
		// TODO: CURRENTLY PLAY STOPS WHEN 'WINNER' CONDITION IS MET, BUT IF YOU SELECT A PREVIOUS MOVE, YOU CAN RESUME AND OVERWRITE THE PREVIOUS HISTORY
		let status;
		if (winner) {
			status = "Winner: " + winner;
			// console.log(result);
		} else {
			status = "Next player: " + (this.state.xIsNext ? "X" : "O");
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={selected.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div
						style={{
							display: "block",
							margin: "auto",
							width: "85%",
							marginBottom: "20px",
						}}
					>
						{status}
					</div>
					<button
						onClick={() => this.switchOrder()}
						style={{ display: "block", margin: "auto", width: "40%" }}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
						>
							<path d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z"></path>
						</svg>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
						>
							<path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"></path>
						</svg>
					</button>
					<ol>{this.state.order ? moves : moves.reverse()}</ol>
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	let winningLine;
	// if (result.winner) {
	// 	result.winningCombo = winningLine;
	// }
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
			// console.log(lines[i]);
			winningLine = lines[i];
			console.log(winningLine);
			const result = {
				winningCombo: winningLine,
				winner: squares[a],
			};
			// const firstInt = a;
			// console.log(firstInt);

			return result;
		}
	}

	return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
