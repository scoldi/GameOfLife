/*
TO DO LIST  
1. Change size of everything on window resize (without interrupting anything);
2. Interrupt (pause) simulation on settings modal opening
3. Interrupt simulation when nothing changes for a few ticks (kinda done, needs improvement, use ShouldBeAlive/Dead arrays(?))
*/
var out_flag = false;
var refreshInterval;
var interval = 1000;
var customField = false;
var customInterval = false;
var counter = 0;
var counterShown = false; 
var counterHistory = new Array;
var nothingChangesFor = 5; 
var param;

function startSimPage()
{
	addTiles(10, 10);
	initCounter();
}

// Dead tile => alive, alive tile => dead
function toggleTile(event)
{
	const tileClicked = this;
	if (tileClicked.classList.contains('alive'))
	{		
    tileClicked.classList.remove('alive');
	}
	else {
    tileClicked.classList.add('alive');
	}
	initCounter();
	updateCounter();
}

// Allow manual on/off;
function init(){
	const tiles = Array.from(document.querySelectorAll('.gridsquare'));
	tiles.forEach(
		tile => {
		tile.addEventListener('click', toggleTile);
		}
	);
}

// disable manual on/off
function uninit()
{
	const tiles = Array.from(document.querySelectorAll('.gridsquare'));
	tiles.forEach(
		tile => {
		tile.removeEventListener('click', toggleTile);
		}
	);
}

// Create tiles, assign x, y coordinates to each
function addTiles(x,y){ 
var e = document.body;
var parent_container = document.getElementById('main_grid');
var center_container = document.getElementById('center_grid');
var height = (center_container.clientHeight - 2 * y * 3) / y;
var width = height;
if ((width * x + 2 * 3 * x) > parent_container.clientWidth)
{
	// console.log('width overflow');
	width = (center_container.clientWidth - 2 * x * 3) / x;
	height = width;
}
for(var i = 1; i <= y; i++)
	{
	var row = document.createElement("div"); 
	row.className = "row"; 
		for(var j = 1; j <= x; j++)
		{ 
		var cell = document.createElement("div"); 
		cell.dataset.x = j;
		cell.dataset.y = i;
		cell.className = "gridsquare"; 
		cell.innerText = "";
		cell.setAttribute("style", "height: "+ height +"px; width: "+ width + "px;")
		row.appendChild(cell); 
		} 
	center_container.appendChild(row); 
	}	
	init();
}

// Count alive neighboring tiles
function getNeighborsOne(tile)
{
	var count = 0;
	var suspects = [];
	if (tile.classList.contains('alive'))
	{
		count--;
	}
	x = tile.dataset.x;
	y = tile.dataset.y;
	for (var i = -1; i<=1; i++)
	{
		var selector_x = "[data-x="+'"'+ (parseInt(x) + parseInt(i)) +'"'+"]";
		for (var j = -1; j<=1; j++)
		{
			var selector_y = "[data-y="+'"'+ (parseInt(y) + parseInt(j)) +'"'+"]";
			var neighbor = document.querySelector(selector_x + selector_y);
			if (neighbor != null)
			{
				suspects.push(document.querySelector(selector_x + selector_y));
			}
		}
	}
	for (let suspect of suspects) 
	{
		if (suspect.classList.contains('alive')) 
		{
			count++;
		}	
	}
	return count;
}
// Alive neighboring tiles for each tile
function getNeighbors()
{
	const Alltiles = Array.from(document.querySelectorAll('.gridsquare'));
	for (let tile of Alltiles) 
	{
		tile.innerText = getNeighborsOne(tile);
	}
}
// Next tick
function nextStep()
{
	const Alltiles = Array.from(document.querySelectorAll('.gridsquare'));
	var ShouldBeAlive = [];
	var ShouldBeDead = [];
	for (let tile of Alltiles) 
	{
		n = getNeighborsOne(tile);
		if ((n == 3) && (!tile.classList.contains('alive')))
		{
			ShouldBeAlive.push(tile);
		}
		else if ((n > 3) || (n < 2))
		{
			ShouldBeDead.push(tile);
		}
		else if ((n == 3) || (n == 2) && (tile.classList.contains('alive')))
		{
			ShouldBeAlive.push(tile);
		}			
		else 
		{
			ShouldBeDead.push(tile);
		}
	}
	for (let tile of ShouldBeAlive) 
	{
		tile.classList.add('alive');
	}
	for (let tile of ShouldBeDead)
	{
		tile.classList.remove('alive');
	}
	updateCounter();
	counterHistory.push(counter);
	// console.log(counterHistory);
	// console.log(sameLastTurns(5));
	if (sameLastTurns(nothingChangesFor) || (counter == 0))
	{
		stopSim();
		uninitCounter();
		inform('nothing changes');
	}
}

// Clear the tile container
function deleteTiles()
{
	var parent = document.getElementById('center_grid');
	parent.innerHTML = "";
}

// Validate input for textboxes
function validateTextBoxes()
{
	var x_textbox = document.getElementById('input_x');
	var y_textbox = document.getElementById('input_y');
	var new_x = x_textbox.value;
	var new_y = y_textbox.value;
	var x_flag = false;
	var y_flag = false;
	// check x
	if ((new_x) || (new_y))
	{
		if (!new_x) {
			x_flag = false;
			x_textbox.placeholder = 'Empty';
			x_textbox.classList.remove('valid');
			x_textbox.classList.add('invalid');
		} 
		else if (isNaN(new_x))
		{
			x_flag = false;
			x_textbox.value = null; 
			x_textbox.placeholder = 'Not a number';
			x_textbox.classList.remove('valid');
			x_textbox.classList.add('invalid');
		}
		else if ((new_x > 50) || (new_x < 2))
		{
			x_flag = false;
			x_textbox.value = null; 
			x_textbox.placeholder = '2 to 50';
			x_textbox.classList.remove('valid');
			x_textbox.classList.add('invalid');
		}
		else 
		{
			x_flag = true;
			x_textbox.classList.remove('invalid');
			x_textbox.classList.add('valid');
		}
		// check y
		if (!new_y) {
			y_flag = false;
			y_textbox.placeholder = 'Empty';
			y_textbox.classList.remove('valid');
			y_textbox.classList.add('invalid');
		} 
		else if (isNaN(new_y))
		{
			y_flag = false;
			y_textbox.value = null; 
			y_textbox.placeholder = 'Not a number';
			y_textbox.classList.remove('valid');
			y_textbox.classList.add('invalid');
		}
		else if ((new_y > 50) || (new_y < 2))
		{
			y_flag = false;
			y_textbox.value = null; 
			y_textbox.placeholder = '2 to 50';
			y_textbox.classList.remove('valid');
			y_textbox.classList.add('invalid');
		}
		else 
		{
			y_flag = true;
			y_textbox.classList.remove('invalid');
			y_textbox.classList.add('valid');
		}
	}
	if ((x_flag) && (y_flag))
	{
		customField = true;
	}
	else 
	{
		customField = false;
	}
}

function validateInterval()
{
	var interval_textbox = document.getElementById('input_interval');
	var new_interval = interval_textbox.value;
	if (new_interval) {
		if (isNaN(new_interval))
		{
			interval_textbox.value = null; 
			interval_textbox.placeholder = 'Not a number';
			interval_textbox.classList.remove('valid');
			interval_textbox.classList.add('invalid');
			customInterval = false;
		}
		else if ((new_interval > 10000) || (new_interval < 1))
		{
			interval_textbox.value = null; 
			interval_textbox.placeholder = '0 to 10000';
			interval_textbox.classList.remove('valid');
			interval_textbox.classList.add('invalid');
			customInterval = false;
		}
		else 
		{
			customInterval = true;
			interval = interval_textbox.value;
			interval_textbox.classList.remove('invalid');
			interval_textbox.classList.add('valid');
		}
	}
	else 
	{
		customInterval = false;
	}
}

function cleanTiles()
{
	const Alltiles = Array.from(document.querySelectorAll('.gridsquare'));
	for (let tile of Alltiles)
	{
		tile.classList.remove('alive');
		counter = 0;
	}
}

// Apply new settings
function applySettings()
{
	var modal = document.getElementById('modalSettings');	
	validateTextBoxes();
	validateInterval();
	if (customInterval)
	{
		interval = document.getElementById('input_interval').value;
		// modal.style.display = "none";
		//console.log('interval changed');
		//console.log(interval);
	}
	if (customField)
	{
		var new_x = document.getElementById('input_x').value;
		var new_y = document.getElementById('input_y').value;
		deleteTiles();
		addTiles(new_x, new_y);
		//console.log('field changed');
	}
	/*
	if ((customField) && (customInterval))
	{
		modal.style.display = "none";
	}
	*/
}

// randomly toggle tiles (change to be determined from settings, 0.5 now)
function fillrandom()
{
	cleanTiles();
	const Alltiles = Array.from(document.querySelectorAll('.gridsquare'));
	for (let tile of Alltiles)
	{
		var n = Math.random();
		if (n > 1 - 0.5)
		{
			tile.classList.add('alive');
		}
	}
	initCounter();
	updateCounter();
}

//  with "start" button clicked, begin infinite loop of nextStep() iterations (default interval = 1000 ms), also change play button to pause button.  
function startSim(intervalId, interval)
{
	nextStep();
	uninit();
	initCounter();
	var img_holder = document.getElementById('play_pause');
	img_holder.innerHTML = '<img src="img/pause.png" class="image_off" height="80px"><img src="img/pause_hover.png" class="image_on" height="80px" onclick="stopSim()">';
	refreshInterval = setInterval(function() {
		nextStep(); 
	}, interval);
}	

// with "stop" button clicked, break the infinite loop, change the button back
function stopSim()
{
	init();
	// uninitCounter();
	var img_holder = document.getElementById('play_pause');
	clearInterval(refreshInterval);
	img_holder.innerHTML = '<img src="img/play.png" class="image_off" height="80px" ><img src="img/play_hover.png" class="image_on" height="80px" onclick="startSim(refreshInterval, interval)" >';
}

function initCounter()
{
	document.getElementById('counterspan').innerHTML = counter;
	document.getElementById('textcounter').innerHTML = "Currently alive: ";
}

function updateCounter()
{
	counter = 0;
	const Alltiles = Array.from(document.querySelectorAll('.gridsquare'));
	for (let tile of Alltiles)
	{
		if (tile.classList.contains('alive'))
		{
			counter++;
		}
	}
	// console.log(counter);
	document.getElementById('counterspan').innerHTML = counter;
}

function uninitCounter()
{
	document.getElementById('counterspan').innerHTML = '';
	document.getElementById('textcounter').innerHTML = ''; 
}

function inform(param)
{
	switch(param)
	{
		case 'nothing changes':
			document.getElementById('counterspan').innerHTML = '';
			document.getElementById('textcounter').innerHTML = 'Nothing new seems to happen. Stopped'; 
			break;
		default: 
			break;
	}
}

function sameLastTurns(x)
{
	var lastCounters = counterHistory.slice(Math.max(counterHistory.length - x, 1));
	if ((lastCounters.length == x) && (lastCounters.every(x => x == lastCounters[0])))
	{
		return true;
	}
	else 
	{
		return false;
	}
}