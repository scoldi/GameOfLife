/*
TO DO LIST  
1. Change size of everything on window resize (without interrupting anything);
2. Interrupt simulation on setting modal opening
3. Interrupt simulation when nothing changes for a few ticks
4. Add a counter for alive cells
*/
var out_flag = false;
var refreshInterval;
var interval = 1000;
var customTickTime = false;

// Dead tile => alive
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
}

// Allow manual on/off
function init(){
	const tiles = Array.from(document.querySelectorAll('.gridsquare'));
	tiles.forEach(
		tile => {
		tile.addEventListener('click', toggleTile);
		}
	);
}

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
	console.log('whoops');
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
}

// Clear the tile container
function deleteTiles()
{
	var parent = document.getElementById('center_grid');
	parent.innerHTML = "";
}

// Validate input for textboxes
function checktextboxes()
{
	var x_textbox = document.getElementById('input_x');
	var y_textbox = document.getElementById('input_y');
	var ticktime_textbox = document.getElementById('input_ticktime');
	var new_x = x_textbox.value;
	var new_y = y_textbox.value;
	var new_ticktime = ticktime_textbox.value;
	var x_flag = false;
	var y_flag = false;
	var ticktime_flag = false;
	// check x
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
	// check time
	if (new_ticktime) {
		// ticktime_flag = false;
		// ticktime_textbox.placeholder = 'Empty';
		// ticktime_textbox.classList.remove('valid');
		// ticktime_textbox.classList.add('invalid');
		if (isNaN(new_ticktime))
		{
			ticktime_flag = false;
			ticktime_textbox.value = null; 
			ticktime_textbox.placeholder = 'Not a number';
			ticktime_textbox.classList.remove('valid');
			ticktime_textbox.classList.add('invalid');
		}
		else if ((new_ticktime > 10000) || (new_ticktime < 1))
		{
			ticktime_flag = false;
			ticktime_textbox.value = null; 
			ticktime_textbox.placeholder = '0 to 10000';
			ticktime_textbox.classList.remove('valid');
			ticktime_textbox.classList.add('invalid');
		}
		else 
		{
			ticktime_flag = true;
			customTickTime = true;
			interval = ticktime_textbox.value;
			ticktime_textbox.classList.remove('invalid');
			ticktime_textbox.classList.add('valid');
		}
	}
	else 
	{
		ticktime_flag = true;
	}
	if ((x_flag) && (y_flag) && (ticktime_flag))
	{
		return true;
	}
	else 
	{
		return false;
	}
}

function cleanTiles()
{
	const Alltiles = Array.from(document.querySelectorAll('.gridsquare'));
	for (let tile of Alltiles)
	{
		tile.classList.remove('alive');
	}
}

// Apply new settings
function clearAdd()
{
	if (checktextboxes())
	{
		var modal = document.getElementById('modalSettings');
		var x_textbox = document.getElementById('input_x');
		var y_textbox = document.getElementById('input_y');
		var new_x = x_textbox.value;
		var new_y = y_textbox.value;
		deleteTiles();
		addTiles(new_x, new_y);
		// modal.style.display = "none";
	}
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
}

//  with "start" button clicked, begin infinite loop of nextStep() iterations (default interval = 1000 ms), also change play button to pause button.  
function startSim(intervalId, interval)
{
	uninit();
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
	var img_holder = document.getElementById('play_pause');
	clearInterval(refreshInterval);
	img_holder.innerHTML = '<img src="img/play.png" class="image_off" height="80px" ><img src="img/play_hover.png" class="image_on" height="80px" onclick="startSim(refreshInterval, interval)" >';
}


