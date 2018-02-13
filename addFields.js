function genDivs(x,y){ 
  var e = document.body;
  for(var i = 1; i <= y; i++){ 
	var row = document.createElement("div"); 
	row.className = "row"; 
	for(var j = 1; j <= x; j++){ 
		var cell = document.createElement("div"); 
		cell.dataset.x = j;
		cell.dataset.y = i;
		cell.className = "gridsquare"; 
		// cell.Id = cell.dataset.x;
		cell.innerText = "__";
		row.appendChild(cell); 
	} 
	e.appendChild(row); 
  } 
  document.getElementById("code").innerText = e.innerHTML;
}
