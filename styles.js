// open settings modal
function openSettings()
{
	var modal = document.getElementById('modalSettings');
	modal.style.display = "block";
}

// close settings modal
function closeSettings()
{
	var modal = document.getElementById('modalSettings');
    modal.style.display = "none";
}

// close settings modal by clicking outside of it 
window.onclick = function(event) {
	var modal = document.getElementById('modalSettings');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// open info modal
function openInfo()
{
	var modal = document.getElementById('modalInfo');
	modal.style.display = "block";
}

// close info modal
function closeInfo()
{
	var modal = document.getElementById('modalInfo');
    modal.style.display = "none";
}

// close info modal by clicking outside of it 
window.onclick = function(event) {
	var modal = document.getElementById('modalInfo');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}