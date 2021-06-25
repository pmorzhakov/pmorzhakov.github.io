window.onload = function () {
    if (! localStorage.noFirstVisit) {
    console.log('first time');
    document.getElementById('first').style.display = 'block';
    localStorage.noFirstVisit = "1";
    
    } else {
      if(localStorage.noFirstVisit == "1"){
        document.getElementById('wrap').style.display = 'block';
        //
      } else {
        document.getElementById('last').style.display = 'block';
      }

    }

	document.getElementById('start').onclick = function () {
    		document.getElementById('first').style.display = 'none';
		localStorage.noFirstVisit = "2";
      	document.getElementById('wrap').style.display = 'block';
		};

    document.getElementById('restore').onclick = function () {
        localStorage.noFirstVisit = "";
        document.getElementById('restore').innerHTML = "DO NOT FORGET TO RUN AGAIN THE PAGE";
    };
}
