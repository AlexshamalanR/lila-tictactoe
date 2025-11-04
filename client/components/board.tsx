'use client';
import { useState, useEffect, useRef } from 'react';
import Square from './square';
import { MatchData } from '@heroiclabs/nakama-js';
import Nakama from '@/lib/nakama';
import {
  OpCode,
  StartMessage,
  DoneMessage,
  UpdateMessage,
} from '@/lib/messages';

import { Button } from '@/components/ui/button';

type GameState = {
  squares: (number | null)[];
  playerIndex: number;
  playerTurn: number;
  deadline: number | null;
  gameMessage: string;
  gameStarted: boolean;
  timeLeft: number;
  isSearching: boolean;
};

// GameStatus component removed as it's now inline in the main component

const FindMatchButton = ({ onClick, isSearching }: { 
  onClick: () => void; 
  isSearching: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={isSearching}
    className="game-button"
  >
    {isSearching ? (
      <span className="flex items-center gap-3">
        <div className="loading-spinner"></div>
        Finding Match...
      </span>
    ) : (
      'Find Match'
    )}
  </button>
);

const GameBoard = ({ squares, onSquareClick, isMyTurn }: {
  squares: (number | null)[];
  onSquareClick: (index: number) => void;
  isMyTurn: boolean;
}) => {
  const renderSquare = (index: number) => (
    <Square
      key={index}
      value={squares[index]}
      onSquareClick={() => onSquareClick(index)}
      isClickable={isMyTurn && squares[index] === null}
    />
  );

  return (
    <div className="board-row">
      <div className="game-lines">
        <div className="horizontal-line" />
        <div className="horizontal-line" />
      </div>
      {squares.map((_, index) => renderSquare(index))}
    </div>
  );
};

const GameModeSelector = ({ selectedMode, onModeSelect }: {
  selectedMode: 'fast' | 'normal';
  onModeSelect: (mode: 'fast' | 'normal') => void;
}) => (
  <div className="game-mode-selector">
    <button
      className={`game-mode-button ${selectedMode === 'normal' ? 'active' : ''}`}
      onClick={() => onModeSelect('normal')}
    >
      Normal Mode
      <div className="text-sm opacity-70">20s per turn</div>
    </button>
    <button
      className={`game-mode-button ${selectedMode === 'fast' ? 'active' : ''}`}
      onClick={() => onModeSelect('fast')}
    >
      Fast Mode
      <div className="text-sm opacity-70">10s per turn</div>
    </button>
  </div>
);

const EndGameActions = ({ onPlayAgain, onLeave }: {
  onPlayAgain: () => void;
  onLeave: () => void;
}) => (
  <div className="end-game-actions">
    <button className="end-game-button primary" onClick={onPlayAgain}>
      Play Again
    </button>
    <button className="end-game-button secondary" onClick={onLeave}>
      Leave Game
    </button>
  </div>
);

export default function Game() {
  const [gameState, setGameState] = useState<GameState>({
    squares: Array(9).fill(null),
    playerIndex: -1,
    playerTurn: -1,
    deadline: null,
    gameMessage: 'Welcome to TicTacToe',
    gameStarted: false,
    timeLeft: 0,
    isSearching: false
  });
  
  const [gameMode, setGameMode] = useState<'fast' | 'normal'>('normal');
  const [gameEnded, setGameEnded] = useState(false);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(current => ({ ...current, ...updates }));
  };

  const nakamaRef = useRef<Nakama | undefined>(undefined);

  function initSocket() {
    if (
      !nakamaRef.current ||
      !nakamaRef.current.socket ||
      !nakamaRef.current.session
    )
      return;
    const userId = nakamaRef.current.session.user_id;

    let socket = nakamaRef.current.socket;

    socket.onmatchdata = (matchState: MatchData) => {
      if (!nakamaRef.current) return;
      const json_string = new TextDecoder().decode(matchState.data);
      const json: string = json_string ? JSON.parse(json_string) : '';
      console.log('op_code: ', matchState.op_code);

      let myPlayerIndex = nakamaRef.current.gameState.playerIndex;

      if (typeof json === 'object' && json !== null) {
        switch (matchState.op_code) {
          case OpCode.START:
            const startMessage = json as StartMessage;
            updateGameState({
              timeLeft: 0,
              squares: startMessage.board,
              playerTurn: startMessage.mark,
              gameStarted: true,
              gameMessage: 'Game Started!'
            });

            let tmpId = startMessage.marks[userId!];
            if (tmpId !== null) {
              updateGameState({ playerIndex: tmpId });
              nakamaRef.current.gameState.playerIndex = tmpId;
            } else {
              console.error('tmpId is null');
            }
            break;
          case OpCode.UPDATE:
            const updateMessage = json as UpdateMessage;
            updateGameState({
              gameMessage: updateMessage.mark === myPlayerIndex ? 'Your Turn!' : gameState.gameMessage,
              playerTurn: updateMessage.mark,
              squares: updateMessage.board,
              deadline: updateMessage.deadline
            });
            break;
          case OpCode.DONE:
            const doneMessage = json as DoneMessage;
            updateGameState({
              deadline: doneMessage.nextGameStart,
              gameStarted: false,
              squares: doneMessage.board,
              playerTurn: -1,
              gameMessage: doneMessage.winner === myPlayerIndex ? 'You won!' : 'You lost!'
            });
            break;
          case OpCode.MOVE:
            // Handle MOVE message
            break;
          case OpCode.REJECTED:
            // Handle REJECTED message
            break;
          default:
            // Handle unknown message
            break;
        }
      }
    };
  }

  useEffect(() => {
    const initNakama = async () => {
      nakamaRef.current = new Nakama();
      await nakamaRef.current.authenticate();
      initSocket();
    };
    initNakama();
  }, []);

  useEffect(() => {
    if (gameState.deadline !== null) {
      const intervalId = setInterval(() => {
        updateGameState({
          timeLeft: gameState.deadline! * 1000 - Date.now()
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [gameState.deadline]);

  function handleClick(i: number) {
    if (!gameState.gameStarted) {
      updateGameState({ gameMessage: "Game hasn't started yet!" });
      return;
    }
    if (!nakamaRef.current) return;

    if (gameState.playerTurn === gameState.playerIndex && gameState.squares[i] === null) {
      const nextSquares = gameState.squares.slice();
      nextSquares[i] = gameState.playerIndex;
      
      updateGameState({
        squares: nextSquares,
        gameMessage: "Wait for other player's turn!"
      });
      
      nakamaRef.current.makeMove(i);
    } else if (gameState.playerTurn !== gameState.playerIndex) {
      updateGameState({ gameMessage: "It's not your turn!" });
    }
  }

  async function findMatch() {
    if (!nakamaRef.current) return;
    updateGameState({ isSearching: true });
    await nakamaRef.current.findMatch();
    
    if (nakamaRef.current.matchId === null) {
      updateGameState({
        isSearching: false,
        gameMessage: 'Server Error: Failed to find match!'
      });
      return;
    }
    
    console.log('find match, matchId: ', nakamaRef.current.matchId!);
    updateGameState({
      isSearching: false,
      gameMessage: 'Wait Other Player to join...'
    });
  }

  const isMyTurn = gameState.playerTurn === gameState.playerIndex;
  
  // Format timer to always show positive numbers
  return (
    <div className="min-h-screen bg-background pt-16 px-4">
      <div className="max-w-[390px] mx-auto flex flex-col items-center">
        <div className="w-full text-center mb-8">
          <h2 className="game-header mb-4">{gameState.gameMessage}</h2>
          {gameState.deadline && gameState.gameStarted && (
            <div className="timer-container">
              <div className="flex justify-center items-center gap-3">
                <span className="text-muted-foreground text-lg">Time left:</span>
                <span className="timer-display">
                  {(Math.max(0, gameState.timeLeft) / 1000).toFixed(2)}s
                </span>
              </div>
            </div>
          )}
        </div>

        {!gameState.gameStarted && (
          <div className="mb-12">
            <FindMatchButton
              onClick={findMatch}
              isSearching={gameState.isSearching}
            />
          </div>
        )}

        <GameBoard
          squares={gameState.squares}
          onSquareClick={handleClick}
          isMyTurn={isMyTurn}
        />

        {!gameState.isSearching && !gameState.gameStarted && gameState.playerTurn === -1 && (
          <div className="w-full mt-4">
            <EndGameActions
              onPlayAgain={() => {
                // Handle play again action
                updateGameState({
                  squares: Array(9).fill(null),
                  playerIndex: -1,
                  playerTurn: -1,
                  deadline: null,
                  gameMessage: 'Welcome to TicTacToe',
                  gameStarted: false,
                  timeLeft: 0,
                  isSearching: false
                });
              }}
              onLeave={async () => {
                // Handle leave game action
                if (nakamaRef.current?.socket && nakamaRef.current?.matchId) {
                  await nakamaRef.current.socket.leaveMatch(nakamaRef.current.matchId);
                  nakamaRef.current.matchId = null;
                }
                updateGameState({
                  squares: Array(9).fill(null),
                  playerIndex: -1,
                  playerTurn: -1,
                  deadline: null,
                  gameMessage: 'Welcome to TicTacToe',
                  gameStarted: false,
                  timeLeft: 0,
                  isSearching: false
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
