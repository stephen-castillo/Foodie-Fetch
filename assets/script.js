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
        $('#recipe-list').append('<div id="recipe'+[i]+'"></div>');
        //create new div with '<div id="recipe'+[i]+'">
        //console.log(cRes.images.REGULAR.url);
        $('#recipe'+[i]).html('<p>'+cRes.label+'</p><figure><img src="'+cRes.images.REGULAR.url+'" alt="Picture of '+cRes.label+'" height="300px" width="300px"></figure>');
        
        var $newList = $('<ul>').attr('id', 'recList'+[i]);
        $newList.append($('<caption>').text('Ingredients'));
        $('#recipe'+[i]).append($newList);
        for(j=0; j<cRes.ingredientLines.length; j++){
            $('#recList'+[i]).append('<li>'+cRes.ingredientLines[j]+'</li>');
        }
        $('#recipe'+[i]).append('<a href="'+cRes.url+'" target="_blank">How to prepare '+cRes.label+'</a>');
    }
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



// Hide recipe section for now
document.getElementById('recipe-view').style.display='none';

// Event listener for keyword search button



// Event listener for Fetch! button

