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
		// field.addEventListener('click', getNeighbors);
		//field.addEventListener('click', setDead);
		}
	);
}

// Подсчет живых соседей (пока что прокручивает все клетки, исправить)
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
	// const FieldClicked = this;
	for (let field of AllFields) 
	{
		n = getNeighborsOne(field);
		field.innerText = n;
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


