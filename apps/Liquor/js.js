function calc(ev){
  alert("pippo");
  ev.preventDefault();

  var gAlcol = parseInt(document.getElementById("gAlcol"))
      , qAlcol = parseInt(document.getElementById("qAlcol"))
      , qWater = parseInt(document.getElementById("qWater"))
      , qSugar = parseInt(document.getElementById("qSugar"));


  console.log(gAlcol);    
  console.log(qAlcol);    
  console.log(qWater);    
  console.log(qSugar); 
  return false;
}