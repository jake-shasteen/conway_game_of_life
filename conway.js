/* Conway's game of life */
/*
The universe of the Game of Life is an infinite two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, alive or dead, or "populated" or "unpopulated" (the difference may seem minor, except when viewing it as an early model of human/urban behavior simulation or how one views a blank space on a grid). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:

Any live cell with fewer than two live neighbours dies, as if caused by under-population.
Any live cell with two or three live neighbours lives on to the next generation.
Any live cell with more than three live neighbours dies, as if by over-population.
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed—births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick (in other words, each generation is a pure function of the preceding one). The rules continue to be applied repeatedly to create further generations
*/

var extend = function() {
  var extended = {};

  for(key in arguments) {
    var argument = arguments[key];
    for (prop in argument) {
      if (Object.prototype.hasOwnProperty.call(argument, prop)) {
        extended[prop] = argument[prop];
      }
    }
  }

  return extended;
};

var GameState = function ( gameState ) {
  this.storage = {};
  if ( gameState !== undefined ) {
    this.storage = extend( this.storage, gameState );
  }
}

GameState.prototype.getCellAt = function ( r, c ) {
    var coords = [r,c];
    return this.storage[coords] || 0;
}

GameState.prototype.countLiveNeighbors = function ( r, c ) {
  return this.getCellAt( r-1, c-1 ) + this.getCellAt( r-1, c ) +
    this.getCellAt( r-1, c+1 ) + this.getCellAt( r, c-1 ) + this.getCellAt( r, c+1 ) +
    this.getCellAt( r+1, c-1 ) + this.getCellAt( r+1, c ) + this.getCellAt( r+1, c+1 );
}

GameState.prototype.determineNextState = function ( r, c ) {
  let count = this.countLiveNeighbors( r, c );
    if( this.getCellAt( r, c ) ) {
      if( count < 2 ) return 0;
      else if( count < 4 ) return 1;
      else return 0;
    } else {
      if( count === 3 ) return 1;
      else return 0;
    }

}

GameState.prototype.setState = function ( r, c, aliveOrDead ) {
  var coords = [r,c];
  if( aliveOrDead ) {
    this.storage[coords] = 1;
  } else {
    delete this.storage[coords];
  }
  return true;
}

GameState.prototype.liveCells = function () {
  return Object.keys( this.storage );
}

GameState.prototype.render = function() {
  const width = 40;
  const height = 10;

  var buildline = function( width ) {
    var output = '';
    for( var i = 0; i < width; i++ ) {
      output += '-';
    }
    return '+' + output + '+';
  }

  console.log( buildline( width ) );
  for( var r = 0; r < height; r ++ ) {
    let row = '';
    for( var c = 0; c < width; c ++ ) {
      row += this.getCellAt( r, c ) ? '#' : ' ';
    }
    row = '|' + row + '|'
    console.log( row );
  }
  console.log( buildline( width ) );

}

var memoize = function (func) {
  var memo = {};
  var slice = Array.prototype.slice;

  return function() {
    var args = slice.call(arguments);

    if (args in memo)
      return memo[args];
    else
      return (memo[args] = func.apply(this, args));
  }
}

var main = function( initialValues, speed=1000 ) {

  var gameState = new GameState( initialValues );

  var tick = function () {

    // console.log( gameState.storage );
    gameState.render();

    var nextState = new GameState();
    // memoize, checking each cell in a 3x3 block around a live cell.
    var memoNext = memoize( gameState.determineNextState );

    gameState.liveCells().forEach( function( cell ) {
      var r, c;
      [r, c] = cell.split(',').map( Number );

      for( let i = -1; i <= 1; i++ ) {
        for( let j = -1; j <= 1; j++ ) {
          nextState.setState( r+i, c+j, memoNext.call( gameState, r+i, c+j ) );
        }
      }

    } );

    gameState = nextState;

    setTimeout( tick, speed );
  }

  tick();

}

var init = {};
init[[5,10]] = 1;
init[[5,9]] = 1;
init[[5,11]] = 1;

main( init, 500 );