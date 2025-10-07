const COLS=10,ROWS=20,BLOCK_SIZE=30;
const COLORS=[null,'#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#98D8C8','#F7DC6F','#BB8FCE'];
const SHAPES=[[],[[1,1,1,1]],[[2,2],[2,2]],[[0,3,0],[3,3,3]],[[0,4,4],[4,4,0]],[[5,5,0],[0,5,5]],[[6,0,0],[6,6,6]],[[0,0,7],[7,7,7]]];
let board=[],currentPiece=null,nextPiece=null,score=0,lines=0,level=1,highScore=localStorage.getItem('tetrisHighScore')||0;
let gameInterval=null,isGameOver=false,isPaused=false,dropSpeed=1000;
const gameCanvas=document.getElementById('gameCanvas'),gameCtx=gameCanvas.getContext('2d');
const nextCanvas=document.getElementById('nextCanvas'),nextCtx=nextCanvas.getContext('2d');
const scoreElement=document.getElementById('score'),linesElement=document.getElementById('lines');
const levelElement=document.getElementById('level'),highScoreElement=document.getElementById('highScore');
const finalScoreElement=document.getElementById('finalScore'),gameOverElement=document.getElementById('gameOver');
const startBtn=document.getElementById('startBtn'),pauseBtn=document.getElementById('pauseBtn'),restartBtn=document.getElementById('restartBtn');
const leftBtn=document.getElementById('leftBtn'),rightBtn=document.getElementById('rightBtn'),downBtn=document.getElementById('downBtn');
const rotateBtn=document.getElementById('rotateBtn'),dropBtn=document.getElementById('dropBtn');
function initBoard(){board=Array(ROWS).fill().map(()=>Array(COLS).fill(0))}
function createPiece(){const type=Math.floor(Math.random()*7)+1;return{shape:SHAPES[type],color:type,x:Math.floor(COLS/2)-Math.floor(SHAPES[type][0].length/2),y:0}}
function drawBlock(ctx,x,y,color){ctx.fillStyle=COLORS[color];ctx.fillRect(x*BLOCK_SIZE,y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);const gradient=ctx.createLinearGradient(x*BLOCK_SIZE,y*BLOCK_SIZE,(x+1)*BLOCK_SIZE,(y+1)*BLOCK_SIZE);gradient.addColorStop(0,'rgba(255,255,255,0.3)');gradient.addColorStop(1,'rgba(0,0,0,0.3)');ctx.fillStyle=gradient;ctx.fillRect(x*BLOCK_SIZE,y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);ctx.strokeStyle='rgba(0,0,0,0.2)';ctx.lineWidth=2;ctx.strokeRect(x*BLOCK_SIZE,y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE)}
function drawBoard(){gameCtx.clearRect(0,0,gameCanvas.width,gameCanvas.height);for(let y=0;y<ROWS;y++){for(let x=0;x<COLS;x++){if(board[y][x])drawBlock(gameCtx,x,y,board[y][x])}}}
function drawPiece(){if(!currentPiece)return;currentPiece.shape.forEach((row,y)=>{row.forEach((value,x)=>{if(value)drawBlock(gameCtx,currentPiece.x+x,currentPiece.y+y,currentPiece.color)})})}
function drawNext(){nextCtx.clearRect(0,0,nextCanvas.width,nextCanvas.height);if(!nextPiece)return;const offsetX=(nextCanvas.width/BLOCK_SIZE-nextPiece.shape[0].length)/2;const offsetY=(nextCanvas.height/BLOCK_SIZE-nextPiece.shape.length)/2;nextPiece.shape.forEach((row,y)=>{row.forEach((value,x)=>{if(value)drawBlock(nextCtx,offsetX+x,offsetY+y,nextPiece.color)})})}
function checkCollision(piece,offsetX=0,offsetY=0){for(let y=0;y<piece.shape.length;y++){for(let x=0;x<piece.shape[y].length;x++){if(piece.shape[y][x]){const newX=piece.x+x+offsetX,newY=piece.y+y+offsetY;if(newX<0||newX>=COLS||newY>=ROWS)return true;if(newY>=0&&board[newY][newX])return true}}}return false}
function mergePiece(){currentPiece.shape.forEach((row,y)=>{row.forEach((value,x)=>{if(value){const boardY=currentPiece.y+y,boardX=currentPiece.x+x;if(boardY>=0)board[boardY][boardX]=currentPiece.color}})})}
function clearLines(){let linesCleared=0;for(let y=ROWS-1;y>=0;y--){if(board[y].every(cell=>cell!==0)){board.splice(y,1);board.unshift(Array(COLS).fill(0));linesCleared++;y++}}if(linesCleared>0){lines+=linesCleared;score+=linesCleared*100*level;level=Math.floor(lines/10)+1;dropSpeed=Math.max(100,1000-(level-1)*100);updateStats();if(gameInterval){clearInterval(gameInterval);gameInterval=setInterval(gameLoop,dropSpeed)}}}
function movePiece(direction){if(isGameOver||isPaused)return;const offset=direction==='left'?-1:direction==='right'?1:0;if(!checkCollision(currentPiece,offset,0)){currentPiece.x+=offset;draw()}}
function rotatePiece(){if(isGameOver||isPaused)return;const rotated=currentPiece.shape[0].map((_,i)=>currentPiece.shape.map(row=>row[i]).reverse());const previousShape=currentPiece.shape;currentPiece.shape=rotated;if(checkCollision(currentPiece))currentPiece.shape=previousShape;draw()}
function dropPiece(){if(isGameOver||isPaused)return;if(!checkCollision(currentPiece,0,1)){currentPiece.y++}else{mergePiece();clearLines();currentPiece=nextPiece;nextPiece=createPiece();drawNext();if(checkCollision(currentPiece))gameOver()}draw()}
function hardDrop(){if(isGameOver||isPaused)return;while(!checkCollision(currentPiece,0,1)){currentPiece.y++;score+=2}dropPiece();updateStats()}
function draw(){drawBoard();drawPiece()}
function updateStats(){scoreElement.textContent=score;linesElement.textContent=lines;levelElement.textContent=level;if(score>highScore){highScore=score;localStorage.setItem('tetrisHighScore',highScore);highScoreElement.textContent=highScore}}
function gameLoop(){if(!isPaused&&!isGameOver)dropPiece()}
function startGame(){initBoard();score=0;lines=0;level=1;dropSpeed=1000;isGameOver=false;isPaused=false;currentPiece=createPiece();nextPiece=createPiece();updateStats();draw();drawNext();gameOverElement.classList.add('hidden');startBtn.classList.add('hidden');pauseBtn.classList.remove('hidden');if(gameInterval)clearInterval(gameInterval);gameInterval=setInterval(gameLoop,dropSpeed)}
function pauseGame(){isPaused=!isPaused;if(isPaused){pauseBtn.querySelector('.btn-text').textContent='Resume';pauseBtn.querySelector('.btn-icon').textContent=''}else{pauseBtn.querySelector('.btn-text').textContent='Pause';pauseBtn.querySelector('.btn-icon').textContent=''}}
function gameOver(){isGameOver=true;clearInterval(gameInterval);finalScoreElement.textContent=score;gameOverElement.classList.remove('hidden');pauseBtn.classList.add('hidden');startBtn.classList.remove('hidden')}
document.addEventListener('keydown',(e)=>{if(isGameOver)return;switch(e.key){case 'ArrowLeft':movePiece('left');break;case 'ArrowRight':movePiece('right');break;case 'ArrowDown':dropPiece();break;case 'ArrowUp':rotatePiece();break;case ' ':e.preventDefault();hardDrop();break;case 'p':case 'P':pauseGame();break}});
startBtn.addEventListener('click',startGame);pauseBtn.addEventListener('click',pauseGame);restartBtn.addEventListener('click',startGame);
leftBtn.addEventListener('click',()=>movePiece('left'));rightBtn.addEventListener('click',()=>movePiece('right'));
downBtn.addEventListener('click',()=>dropPiece());rotateBtn.addEventListener('click',()=>rotatePiece());dropBtn.addEventListener('click',()=>hardDrop());
[leftBtn,rightBtn,downBtn,rotateBtn,dropBtn].forEach(btn=>{btn.addEventListener('touchstart',(e)=>{e.preventDefault();btn.click()})});
highScoreElement.textContent=highScore;drawBoard();
console.log('%c TETRIS GAME','font-size:24px;color:#667eea;font-weight:bold');
console.log('%c Created by Abdelouahab Mostafa','font-size:14px;color:#94a3b8');
console.log('%c Have fun playing! ','font-size:14px;color:#4ade80');
