//console.log('Javascript working');

//javascrpt get form
const form = document.querySelector('form');

//function to get form data and reset on submit
form.addEventListener('submit', (event) => {
    event.preventDefault(); // prevent the default form submission

    //create new form object on event.target  
    var formData = new FormData(form); 

    //add data to form object from input entries
    var data = {};
    formData.forEach((value, key) => {
        if (value && key !== 'health[]') { // Only add fields that have a value
          data[key] = value;
        }
    });
    //console.log('New Data: ');console.log(data);

    //get all checkboxes that are checked
    const checkboxes = form.querySelectorAll('input[type="checkbox"][name="health[]"]:checked');
    let healthParams = '';
    checkboxes.forEach((checkbox, index) => {
        if (index > 0) {
            healthParams += '&'; //add & symbol
        }
        healthParams += `health=${encodeURIComponent(checkbox.value)}`; //Add checkbox value to sting
    });
    //console.log(healthParams);
    
    //add app_id, app_key, search type
    data.type='public';
    data.app_key = 'f20b386e34889b19ea6df95568e0ae4f';
    data.app_id = '172c19d1';

    //reset the form data after submit
    form.reset();

    //log out the form data
    console.log('Form data:', data);

    //convert form data object into url parameters minus checkbox values
    var inputs = new URLSearchParams(data);
    //make inputs into string
    inputs = inputs.toString();
    console.log(inputs);

    //set substring for search and removal if search is empty
    const subString = 'search=';

    //get info from search bar
    var searchVal = $('#searchItem').val();
    if(searchVal !== null || searchVal !== ''){
        var search = '&q=' + searchVal;
        inputs = search + '&' + inputs;
        console.log('added search');
    }else{
        inputs = inputs.replace(subString, '');
        console.log('removed search');
    }


    var params = '';
    if (healthParams !== ''){
       params = inputs + '&' + healthParams;
    }else{
        params = inputs;
    }
    console.log('Params: '+params);
    getRecipe(handleData, params);

});

//Recipe API sample call

function getRecipe(callback, options){



    const url = 'https://api.edamam.com/api/recipes/v2';
    const params = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    //console.log('what sending: '+`${url}?${query.toString()}`, params);
    console.log('what sending: '+`${url}?${options}`, params);
    fetch(`${url}?${options}`, params)
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        callback(data);
        //callback(apiData);
        //console.log(apiData);
    })
    .catch(error => console.error(error));
}

//function to handle returned data
function handleData(data){
    console.log(data);
    //get the recipe div 

    var cRes;
    for(i=0; i<data.hits.length; i++){
        cRes = data.hits[i].recipe;
        $('#recipe-list').append('<div class="recipe_modal" id="recipe'+[i]+'"></div>');
        //create new div with '<div id="recipe'+[i]+'">
        //console.log(cRes.images.REGULAR.url);
        $('#recipe'+[i]).append('<h4 class="modal_header"><b>'+cRes.label+'</b></h4><br><figure class="modal_image"><img src="'+cRes.images.REGULAR.url+'" alt="Picture of '+cRes.label+'" height="300px" width="300px"></figure><br><br>');
        
        var $newList = $('<ul>').attr('id', 'recList'+[i]);
        $newList.append($('<b><caption class="modal_ingred">').text('Ingredients'));
        $('#recipe'+[i]).append($newList);
        for(j=0; j<cRes.ingredientLines.length; j++){
            $('#recList'+[i]).append('<li>'+cRes.ingredientLines[j]+'</li>');
        }
        $('#recipe'+[i]).append('<br><a class="modal_link" href="'+cRes.url+'" target="_blank">How to prepare '+cRes.label+'</a><hr style="height:5px; background-color: #787e87;">');
    
    }
    console.log($('#recipe-list').html());
}
//getRecipe('chicken salad');

console.log('Data here');
//getRecipe(handleData, recSearch);


// mobile-responsive menu //
const burgerIcon =document.querySelector('#burger');
const navbarMenu =document.querySelector('#nav-links');

burgerIcon.addEventListener('click',() => {
    navbarMenu.classList.toggle('is-active');
})

// Modal for Individual recipes

// Get a reference to the button element
//const openModalBtn = document.getElementById('open-modal-btn');

// Attach an event listener to the button
//openModalBtn.addEventListener('click', () => {
  // Fetch data from server
 // fetch('data.json')
  //  .then(response => response.json())
  //  .then(data => {
      // Insert data into modal content container
   //   document.getElementById('modal-content').innerHTML = data.text;
      // Display modal
   //   document.getElementById('modal').style.display = 'block';
  //  });
//});

//Using jquery
//$('#open-modal-btn').on('click', function() {
  //  $.getJSON('data.json', function(data) {
   //   $('#modal-content').html(data.text);
   //   $('#modal').css('display', 'block');
  //  });
 // });

 //using openModal () function with fetch request



 //MODAL for returned data in recipe list//

 // Get references
const openModalBtn = document.getElementById('open-modal-btn'); //get reference to Fetch! button as the open-modal-btn
const closeModalBtn = document.getElementById('close-modal-btn'); //get reference to close modal btn
const modal = document.getElementById('my-modal'); //get reference to modal container in div

// Add event listener to Fetch! button to display when clicked
openModalBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Add event listener to close buton to hide modal
closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';  
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

// Add event listener to Surprise me button to display when clicked
var random = document.getElementById('surprise me');
console.log(random);

// and event listener for it to open modal


random.addEventListener('click', () => {
    modal.style.display = 'block';

    var data = new Object();

    //console.log('random');
    var mt = document.getElementById('mealType').children;
    mnum = Math.floor(Math.random() * mt.length);
    var mealType = mt[mnum].value;

    var d = document.getElementById('diet').children;
    dnum = Math.floor(Math.random() * d.length);
    var diet = d[dnum].value;

    var dt = document.getElementById('dishType').children;
    dtnum = Math.floor(Math.random() * dt.length);
    var dishType = dt[dtnum].value;

    var ct = document.getElementById('cuisineType').children;
    ctnum = Math.floor(Math.random() * ct.length);
    var cuisineType = ct[ctnum].value;

    console.log(mealType + ', ' + diet + ', ' + dishType + ', ' + cuisineType);

    if(mealType === 'None' && diet === 'None' && dishType === 'None' && cuisineType === 'None'){
        mealType = 'Breakfast';
    }

    if(mealType !== ''){
        data.mealType = mealType;
    }
    if(diet !== ''){
        data.diet = diet;
    }
    if(dishType !== ''){
        data.dishType = dishType;
    }
    if(cuisineType !== ''){
        data.cuisineType = cuisineType;
    }
    data.type='public';
    data.app_key = 'f20b386e34889b19ea6df95568e0ae4f';
    data.app_id = '172c19d1';

    console.log(data);

    var inputs = new URLSearchParams(data);
    //make inputs into string
    inputs = inputs.toString();
    console.log(inputs);

    getRecipe(handleData, inputs);

});
