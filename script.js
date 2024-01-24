document.addEventListener('load', ()=>{
    updateTask();
})

 const toggleButton = document.getElementById("toggle-sidebar");
 const sidebar = document.getElementById("sidebar");
 const flexBox = document.getElementById('flex-box');
 const searchbar = document.getElementById('search-bar');

 // Initialize a constant to represent the local storage key
 const dbObjectFavList = "favouritesList";
 // Check if the local storage item exists; if not, initialize it with an empty array

 if (localStorage.getItem(dbObjectFavList) == null) {
    localStorage.setItem(dbObjectFavList, JSON.stringify([]));
}
// Function to update the task counter based on the number of items in the favorites list

function updateTask() {
    // the counter element and the favorites list from local storage
    const favCounter = document.getElementById('total-counter');
    const db = JSON.parse(localStorage.getItem(dbObjectFavList));
    // Update the counter with the length of the favorites list
    if (favCounter.innerText != null) {
        favCounter.innerText = db.length;
    }
}
// Function to check if a given ID is in the favorites list
 function isFav(list, id) {
    let res = false;
    for (let i = 0; i < list.length; i++) {
        if (id == list[i]) {
            res = true;
        }
    }
    return res;
}

// Function to truncate a string to a specified length
function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

// Function to generate a random one-character string
 function generateOneCharString() {
    var possible = "abcdefghijklmnopqrstuvwxyz";
    return possible.charAt(Math.floor(Math.random() * possible.length));
}

// Event listener for the toggle sidebar button
toggleButton.addEventListener("click", function () {
    showFavMealList();
    sidebar.classList.toggle("show");
    flexBox.classList.toggle('shrink');
});

// Scroll event for the flex box
flexBox.onscroll = function () {

    if (flexBox.scrollTop > searchbar.offsetTop) {
        searchbar.classList.add("fixed");

    } else {
        searchbar.classList.remove("fixed");
    }
};
// Asynchronous function to fetch meals from the API based on the search input
const fetchMealsFromApi = async (url, value) => {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}

// Function to display the meal list based on the search input
async function showMealList() {
    const list = JSON.parse(localStorage.getItem(dbObjectFavList));
    const inputValue = document.getElementById("search-input").value;

    const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

    const mealsData = await fetchMealsFromApi(url, inputValue);
    let html = '';
    // Check if meals are available
    if (mealsData.meals) {
        html = mealsData.meals.map(element => {
            return `         
            <div class="card">
            <div class="card-top"  onclick="showMealDetails(${element.idMeal}, '${inputValue}')">
                <div class="dish-photo" >
                    <img src="${element.strMealThumb}" alt="">
                </div>
                <div class="dish-name">
                    ${element.strMeal}
                </div>
                <div class="dish-details">
                    ${truncate(element.strInstructions, 50)}
                    
                    <span class="button" onclick="showMealDetails(${element.idMeal}, '${inputValue}')">Know More</span>
                 
                </div>
            </div>
            <div class="card-bottom">
                <div class="like">

                <i class="fa-solid fa-heart ${isFav(list, element.idMeal) ? 'active' : ''} " onclick="addRemoveToFavList(${element.idMeal})"></i>
                
                </div>
                <div class="play">
                    <a href="${element.strYoutube}">
                        <i class="fa-brands fa-youtube"></i>
                    </a>
                </div>
            </div>
        </div>
            `
        }).join('');
        document.getElementById('cards-holder').innerHTML = html;
    }
}

// Function to add or remove a meal from the favorites list
function addRemoveToFavList(id) {
    const detailsPageLikeBtn = document.getElementById('like-button');
    let db = JSON.parse(localStorage.getItem(dbObjectFavList));
    // Check if the meal ID already exists in the favorites list
    let ifExist = false;
    for (let i = 0; i < db.length; i++) {
        if (id == db[i]) {
            ifExist = true;

        }
    // If the ID exists, remove it; otherwise, add it to the favorites list    
    } if (ifExist) {
        db.splice(db.indexOf(id), 1);
    } else {
        db.push(id);

    }
    // Update the favorites list in local storage
    localStorage.setItem(dbObjectFavList, JSON.stringify(db));

    // Update the like button text in the details page
    if (detailsPageLikeBtn != null) {
        detailsPageLikeBtn.innerHTML = isFav(db, id) ? 'Remove From Favourite' : 'Add To Favourite';
    }
    // Refresh the displayed meal list and favorites list
    showMealList();
    showFavMealList();
    updateTask();
}
 
// Function to display details of a selected meal
async function showMealDetails(itemId, searchInput) {
    console.log("searchInput:...............", searchInput);
    // Get the favorites list
    const list = JSON.parse(localStorage.getItem(dbObjectFavList));
    flexBox.scrollTo({ top: 0, behavior: "smooth" });

 // API URLs for fetching meal details and related items
    const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    const searchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    
    // Fetch the selected meal's details and related items
    const mealList = await fetchMealsFromApi(searchUrl,searchInput);

    console.log('mealslist:..........',mealList);
    let html = ''
    const mealDetails = await fetchMealsFromApi(url, itemId);
    // Check if meal details are available
    if (mealDetails.meals) {
        html = `
        <div class="container remove-top-margin">
            <div class="header hide">
                <div class="title">
                    Let's Eat Something New
                </div>
            </div>
            <div class="fixed" id="search-bar">
                <div class="icon">
                    <i class="fa-solid fa-search "></i>
                </div>
                <div class="new-search-input">
                    <form onkeyup="showMealList()">
                        <input id="search-input" type="text" placeholder="Search food, receipe" />
                    </form>
                </div>
            </div>
        </div>
        <div class="item-details">
        <div class="item-details-left">
        <img src="  ${mealDetails.meals[0].strMealThumb}" alt="">
    </div>
    <div class="item-details-right">
        <div class="item-name">
            <strong>Name: </strong>
            <span class="item-text">
            ${mealDetails.meals[0].strMeal}
            </span>
         </div>
        <div class="item-category">
            <strong>Category: </strong>
            <span class="item-text">
            ${mealDetails.meals[0].strCategory}
            </span>
        </div>
        <div class="item-ingrident">
            <strong>Ingrident: </strong>
            <span class="item-text">
            ${mealDetails.meals[0].strIngredient1},${mealDetails.meals[0].strIngredient2},
            ${mealDetails.meals[0].strIngredient3},${mealDetails.meals[0].strIngredient4}
            </span>
        </div>
        <div class="item-instruction">
            <strong>Instructions: </strong>
            <span class="item-text">
            ${mealDetails.meals[0].strInstructions}
            </span>
        </div>
        <div class="item-video">
            <strong>Video Link:</strong>
            <span class="item-text">
            <a href="${mealDetails.meals[0].strYoutube}">Watch Here</a>
          
            </span>
            <div id="like-button" onclick="addRemoveToFavList(${mealDetails.meals[0].idMeal})"> 
             ${isFav(list, mealDetails.meals[0].idMeal) ? 'Remove From Favourite' : 'Add To Favourite'} </div>
        </div>
    </div>
</div> 
        <div class="card-name">
        Related Items
    </div>
    <div id="cards-holder" class=" remove-top-margin ">`
    }

    // Check if there are related items
    if( mealList.meals!=null){

        // Append HTML for each meal card
        html += mealList.meals.map(element => {
            return `       
            <div class="card">
                <div class="card-top"  onclick="showMealDetails(${element.idMeal}, '${searchInput}')">
                    <div class="dish-photo" >
                        <img src="${element.strMealThumb}" alt="">
                    </div>
                    <div class="dish-name">
                        ${element.strMeal}
                    </div>
                    <div class="dish-details">
                        ${truncate(element.strInstructions, 50)}
                        <span class="button" onclick="showMealDetails(${element.idMeal}, '${searchInput}')">Know More</span>
                    </div>
                </div>
                <div class="card-bottom">
                    <div class="like">
                       
                        <i class="fa-solid fa-heart ${isFav(list, element.idMeal) ? 'active' : ''} " 
                        onclick="addRemoveToFavList(${element.idMeal})"></i>
                    </div>
                    <div class="play">
                        <a href="${element.strYoutube}">
                            <i class="fa-brands fa-youtube"></i>
                        </a>
                    </div>
                </div>
            </div>
        `
        }).join('');
    }
    html = html + '</div>';
    document.getElementById('flex-box').innerHTML = html;
}

// Function to display the list of favorite meals
async function showFavMealList() {
    let favList = JSON.parse(localStorage.getItem(dbObjectFavList));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";

    if (favList.length == 0) {
        html = `<div class="fav-item nothing"> <h1> 
        Nothing To Show.....</h1> </div>`
    } else {
        for (let i = 0; i < favList.length; i++) {
            const favMealList = await fetchMealsFromApi(url, favList[i]);
            if (favMealList.meals[0]) {
                let element = favMealList.meals[0];
                html += `
                <div class="fav-item" onclick="showMealDetails(${element.idMeal},'${generateOneCharString()}')">

              
                <div class="fav-item-photo">
                    <img src="${element.strMealThumb}" alt="">
                </div>
                <div class="fav-item-details">
                    <div class="fav-item-name">
                        <strong>Name: </strong>
                        <span class="fav-item-text">
                           ${element.strMeal}
                        </span>
                    </div>
                    <div id="fav-like-button" onclick="addRemoveToFavList(${element.idMeal})">
                        Remove
                    </div>

                </div>

            </div>               
                `
            }
        }
    }
    document.getElementById('fav').innerHTML = html;
}

updateTask();

