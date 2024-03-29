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
    console.log('searchVal: '+searchVal);
    if(searchVal !== null || searchVal !== '' || searchVal !== ' '){
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
    if(params.includes('&q=&')){
        params = params.replace('&q=&', '');
        console.log('Params2: '+params);
    }
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
    .then(response => {
        if(!response.ok){
            throw new Error('Opps, something went wrong.<br>Unable to retrieve recipe at this time.<br>This page will automatically refresh.');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.hits.length);
        if(data.hits.length === 0 ){
            random.click();
        }else{
            callback(data);
        }
        
        //callback(apiData);
        //console.log(apiData);
    })
    .catch(error => {
        console.log(error.message);
        $('#modaH1').html('Opps, something went wrong.<br>Unable to retrieve a recipe at this time.<br>This page will automatically refresh.');
        refreshPage(3000);
        }
    );
}

function refreshPage(mt) {
    setTimeout(() => {
      window.location.reload();
    }, mt);
}  


//function to handle returned data
function handleData(data){
    //console.log(data);
    //get the recipe div 

    var cRes;
    for(i=0; i<data.hits.length; i++){
        cRes = data.hits[i].recipe;
        cResSplit = cRes.uri;
        cResSplit = cResSplit.split('#');
        cResID = cResSplit[1];
        console.log('Recipe ID: '+cResID);
        $('#recipe-list').append('<div class="recipe_modal" id="'+cResID+'"></div>');
        //create new div with '<div id="recipe'+[i]+'">
        //console.log(cRes.images.REGULAR.url);
        $('#'+cResID).append('<h4 class="modal_header"><b>'+cRes.label+'</b></h4><br><figure class="modal_image"><img src="'+cRes.images.REGULAR.url+'" alt="Picture of '+cRes.label+'" height="300px" width="300px"></figure><br><br>');
        
        var $newList = $('<ul>').attr('id', 'recList'+[i]);
        $newList.append($('<b><caption class="modal_ingred">').text('Ingredients'));
        $('#'+cResID).append($newList);
        for(j=0; j<cRes.ingredientLines.length; j++){
            $('#recList'+[i]).append('<li>'+cRes.ingredientLines[j]+'</li>');
        }
        $('#'+cResID).append('<br><a class="modal_link" href="'+cRes.url+'" target="_blank">How to prepare '+cRes.label+'</a><br><button class="recipe_button" id="btn_'+cResID+'" onclick="saveRec(event)">Save Recipe</button><hr style="height:5px; background-color: #787e87;">');
    
        
        //console.log($('#recipe-list').html());
    }
    //getRecipe('chicken salad');

    console.log('Data here');
    //getRecipe(handleData, recSearch);
}

function saveRec(event){
    event.preventDefault();
    var saveID = event.target.parentElement.getAttribute('id');
    saveID = saveID.toString();
    var saveData = $('#'+saveID).html();
    saveData = JSON.stringify(saveData);
    //console.log(saveData);
    localStorage.setItem(saveID,saveData);

}


// mobile-responsive menu //
const burgerIcon =document.querySelector('#burger');
const navbarMenu =document.querySelector('#nav-links');

burgerIcon.addEventListener('click',() => {
    navbarMenu.classList.toggle('is-active');
})

// Quote API call
function makeQuote(){
    var category = 'food';
    $.ajax({
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/quotes?category=' + category,
        headers: { 'X-Api-Key': 'N8zW2v/RR3UTP00/EDXFlg==QTdAqwC9oFjO9PGS'},
        contentType: 'application/json',
        success: function(result) {
            console.log(result);
            var quote = result[0].quote;
            var author = result[0].author;
            console.log(quote+' - '+author);
            $('#quote').append('<p><b>'+quote+'-'+author+'</b></p>');
        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
        }
    });
}

/////
 //MODAL for returned data in recipe list//
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

// MODAL for retrieving saved recipes in local storage //
const saveRecBtn = document.getElementById('saved-rec-btn');
const secondModal = document.getElementById('saved-modal');

saveRecBtn.addEventListener('click', () => {
    secondModal.style.display = 'block';
    const savedRecipesElement = document.getElementById('saved-recipes');
    if (!savedRecipesElement) {
      console.error('Could not find element with id "saved-recipes"');
      return;
    }
    const saveIDs = Object.keys(localStorage).sort();
    let savedRecipesHTML = '';
    for (let i = 0; i < saveIDs.length; i++) {
      const saveID = saveIDs[i];
      const saveData = localStorage.getItem(saveID);
      if (!saveData) {
        console.error(`Could not find data for key "${saveID}"`);
        continue;
      }
      const parsedData = JSON.parse(saveData);
      savedRecipesHTML += parsedData;
    }
    savedRecipesElement.innerHTML = savedRecipesHTML;
  });

  // Event listener for button to clear saved recipes
    document.getElementById('clear-saved-recipes').addEventListener('click', () => {
    // Clear all saved data from localStorage
    localStorage.clear();
    // Clear the saved-recipes element in the modal
    document.getElementById('saved-recipes').innerHTML = '';
  });
  
// Event listener to click out of saved recipe modal
window.addEventListener('click', (event) => {
    if (event.target == secondModal) {
      secondModal.style.display = 'none';
    }
  });
///////

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

    if(mealType === '' && diet === '' && dishType === '' && cuisineType === ''){
        mealType = 'Lunch';
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
    console.log('Drop downs: '+mealType + ', ' + diet + ', ' + dishType + ', ' + cuisineType);

    data.type='public';
    data.app_key = 'f20b386e34889b19ea6df95568e0ae4f';
    data.app_id = '172c19d1';

    console.log(data);

    var inputs = new URLSearchParams(data);
    //make inputs into string
    inputs = inputs.toString();
    console.log('Inputs: '+inputs);

    getRecipe(handleData, inputs);

});
$('#my-modal').children('div').append('<button class="reset" id="reset" onclick="refreshPage(100)">Reset recipes</button>');

makeQuote();