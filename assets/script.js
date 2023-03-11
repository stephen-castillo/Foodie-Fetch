console.log('Javascript working');

//Recipe API sample call

var recSearch = 'Tuna fish sandwich';
function getRecipe(callback, SearchParm){

    const url = 'https://api.edamam.com/api/recipes/v2';
    const params = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const query = new URLSearchParams({
        type: 'public',
        app_key: 'f20b386e34889b19ea6df95568e0ae4f',
        app_id: '172c19d1',
        q: SearchParm,
    });

    fetch(`${url}?${query.toString()}`, params)
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        callback(data);
        //callback(apiData);
        //console.log(apiData);
    })
    .catch(error => console.error(error));
}

function handleData(data){
    console.log(data);
}
//getRecipe('chicken salad');

console.log('Data here');
getRecipe(handleData, recSearch);

// Hide recipe section for now
document.getElementById('recipe-view').style.display='none';