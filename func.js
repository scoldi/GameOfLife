// Включение мертвой клетки
function setAlive(event)
{
	const FieldClicked = this;
    FieldClicked.classList.add('alive');
}

// Отключение живой клетки (пока не используется)
function setDead(event)
{
	const FieldClicked = this;
	if (FieldClicked.classList.contains('alive')){		
    FieldClicked.classList.remove('alive');
	}
}

// Включаем клетки
function init(){
	const fields = Array.from(document.querySelectorAll('.gridsquare'));
	fields.forEach(
		field => {
		field.addEventListener('click', setAlive);
		//field.addEventListener('click', getNeighborsOne(event.target));
		//field.addEventListener('click', setDead);
		}
	);
}

// Функция получения элементов по значению заданного атрибута
Node.prototype.getElementsByAttributeValue = function(attribute, value){
    var dom = this.all || this.getElementsByTagName("*");
    var match = new Array();
    for (var i in dom) {
        if ((typeof dom[i]) === "object"){
            if (dom[i].getAttribute(attribute) === value){
                match.push(dom[i]);
				console.log('++');
            }
        }
    }
    return match;
};

// Добавление полей + присвоение им координат
function addFields(x,y){ 
//var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
//var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var e = document.body;
var p = document.getElementById('center_grid');
var height =  (window.innerHeight - 800) / y;
var width =  (window.innerWidth - 800) / x;
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
		cell.setAttribute("style", "min-height: "+ height +"px; max-width: "+ width + "px;")
		row.appendChild(cell); 
		} 
	p.appendChild(row); 
	}	
	init();
}
// Подсчет живых соседей (пока что прокручивает все клетки, исправить)
/*
function getNeighborsOne(field)
{
	const AllFields = Array.from(document.querySelectorAll('.gridsquare'));
	var count = 0;
	if (field.classList.contains('alive'))
	{
		count--;
	}
	x = field.dataset.x;
	y = field.dataset.y;
	for(var i = 0; i < AllFields.length; i++)
	{
		if ((Math.abs(AllFields[i].dataset.x - x) <= 1) && (Math.abs(AllFields[i].dataset.y - y) <= 1) && (AllFields[i].classList.contains('alive'))) 
		{
			count++;
		}			
	}
	return count;
}
*/
function getNeighborsOne(field)
{
	// const AllFields = Array.from(document.querySelectorAll('.gridsquare'));
	var count = 0;
	var suspects = [];
	if (field.classList.contains('alive'))
	{
		count--;
	}
	x = field.dataset.x;
	y = field.dataset.y;
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
// подсчет живых соседей для всех
function getNeighbors()
{
	const AllFields = Array.from(document.querySelectorAll('.gridsquare'));
	for (let field of AllFields) 
	{
		field.innerText = getNeighborsOne(field);
	}
}
// Следующий тик игры
function nextStep()
{
	const AllFields = Array.from(document.querySelectorAll('.gridsquare'));
	var ShouldBeAlive = [];
	var ShouldBeDead = [];
	for (let field of AllFields) 
	{
		n = getNeighborsOne(field);
		if ((n == 3) && (!field.classList.contains('alive')))
		{
			ShouldBeAlive.push(field);
		}
		else if ((n > 3) || (n < 2))
		{
			ShouldBeDead.push(field);
		}
		else if ((n == 3) || (n == 2) && (field.classList.contains('alive')))
		{
			ShouldBeAlive.push(field);
		}			
		else 
		{
			ShouldBeDead.push(field);
		}
	}
	for (let field of ShouldBeAlive) 
	{
		field.classList.add('alive');
	}
	for (let field of ShouldBeDead)
	{
		field.classList.remove('alive');
	}
}

function cleanFields()
{
	var parent = document.getElementById('center_grid');
	parent.innerHTML = "";
}

/* function checktexbox(textbox)
{
	var n = textbox.value;
	if ((n) && (!n == '') && (!isNaN(n)) && (n <= 10)) 
	{
		return true;
	} 
	else 
	{
		return false;
	}
} */

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
	else if ((new_x > 10) || (new_x < 2))
	{
		x_flag = false;
		x_textbox.value = null; 
		x_textbox.placeholder = '2 to 10';
		x_textbox.classList.remove('valid');
		x_textbox.classList.add('invalid');
	}
	else 
	{
		x_flag = true;
		console.log('x_ok');
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
	else if ((new_y > 10) || (new_y < 2))
	{
		y_flag = false;
		y_textbox.value = null; 
		y_textbox.placeholder = '2 to 10';
		y_textbox.classList.remove('valid');
		y_textbox.classList.add('invalid');
	}
	else 
	{
		y_flag = true;
		console.log('y_ok');
		y_textbox.classList.remove('invalid');
		y_textbox.classList.add('valid');
	}
	// check time
	if (!new_ticktime) {
		ticktime_flag = false;
		ticktime_textbox.placeholder = 'Empty';
		ticktime_textbox.classList.remove('valid');
		ticktime_textbox.classList.add('invalid');
	} 
	else if (isNaN(new_ticktime))
	{
		ticktime_flag = false;
		ticktime_textbox.value = null; 
		ticktime_textbox.placeholder = 'Not a number';
		ticktime_textbox.classList.remove('valid');
		ticktime_textbox.classList.add('invalid');
	}
	else if ((new_ticktime > 10) || (new_ticktime < 0))
	{
		ticktime_flag = false;
		ticktime_textbox.value = null; 
		ticktime_textbox.placeholder = '2 to 10';
		ticktime_textbox.classList.remove('valid');
		ticktime_textbox.classList.add('invalid');
	}
	else 
	{
		ticktime_flag = true;
		console.log('ticktime_ok');
		ticktime_textbox.classList.remove('invalid');
		ticktime_textbox.classList.add('valid');
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

function clearAdd()
{
	if (checktextboxes())
	{
		var modal = document.getElementById('modalSettings');
		var x_textbox = document.getElementById('input_x');
		var y_textbox = document.getElementById('input_y');
		var new_x = x_textbox.value;
		var new_y = y_textbox.value;
		cleanFields();
		addFields(new_x, new_y);
		modal.style.display = "none";
	}
}

function fillrandom()
{
	console.log('kek');
	return 2;
}


