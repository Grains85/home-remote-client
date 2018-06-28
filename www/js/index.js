document.addEventListener('DOMContentLoaded', function() {
  navigate('main');
  //hideAll();
  //document.getElementById('main').style.display = "block";

    //var tv1 = document.getElementById('tv1');
    //tv1.style.display = "none";
});

function navigate(page){
  hideAll();
  document.getElementById(page).style.display = "block";
}

function hideAll(){
  document.getElementById('main').style.display = "none";
  document.getElementById('tv1').style.display = "none";
  document.getElementById('receiver_kitchen').style.display = "none";
}
