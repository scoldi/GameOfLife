function openSettings()
{
	var modal = document.getElementById('modalSettings');
	// console.log('ulu');
	modal.style.display = "block";
}

function closeSettings()
{
	var modal = document.getElementById('modalSettings');
    modal.style.display = "none";
}

window.onclick = function(event) {
	var modal = document.getElementById('modalSettings');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

