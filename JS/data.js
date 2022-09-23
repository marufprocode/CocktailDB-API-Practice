const searchMessage = document.getElementById('search-message');
const cardsContainer = document.getElementById('drinks-container');
const btnShowAll = document.getElementById('btn-showAll');

const loadData = async (search, dataLimit) => {
    spinnerControl(true);
    try{
        const res = await fetch (`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${search}`);
        const data = await res.json();
        displayData(data.drinks, dataLimit);  
    }
    catch(err){
        console.log(err);
        spinnerControl(false);
        searchMessage.classList.remove('d-none');
        cardsContainer.innerHTML = "";
        btnShowAll.classList.add('d-none');
    }
}
const searchProcess = (dataLimit) => {
    const searchFld = document.getElementById('search-drinks');
    loadData(searchFld.value, dataLimit);
}

document.getElementById('search-btn').addEventListener('click', () => {
    searchProcess(5);
})
document.getElementById('search-drinks').addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        searchProcess(5);
        spinnerControl(true);
    }
});
document.getElementById('btn-showAll').addEventListener('click', () => {
    searchProcess();
})

const spinnerControl = (isLoading) => {
    const spinner = document.getElementById('spinner-roll');
    isLoading? spinner.classList.remove('d-none') : spinner.classList.add('d-none')  
}

const displayData = (data, dataLimit) => {
    searchMessage.classList.add('d-none');
    const searchFld = document.getElementById('search-drinks');
    data.length > dataLimit? btnShowAll.classList.remove('d-none') : btnShowAll.classList.add('d-none'); 
    cardsContainer.innerHTML = "";
    if (searchFld.value === '' || data.length ===0){
        cardsContainer.innerHTML = "";
        searchMessage.classList.remove('d-none');
        btnShowAll.classList.add('d-none');
    }
    else {data.slice(0, dataLimit).forEach(drinks => {
        const {idDrink, strAlcoholic, strCategory, strDrink, strDrinkThumb, strGlass, strInstructions} = drinks;
        
        const cardDiv = document.createElement('div');
        cardDiv.innerHTML = `
            <div class="card bg-dark d-flex flex-column h-100 bg-gradient">
                <img src="${strDrinkThumb}" class="card-img-top" alt="meal-Image-${idDrink}" width="100%" style="max-height: 300px">
                <div class="card-body">
                    <h5 class="card-title text-warning">${strDrink}</h5>
                    <p class="card-text text-light">${strInstructions.slice(0,150)} ...</p>
                </div>
                <div class="p-3">
                    <button type="button" class="btn btn-primary mt-auto d-block" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick = "fetchApiByID(${idDrink})">See Details </button>
                </div>
            </div>
        `;
        cardsContainer.appendChild(cardDiv);
        
    })};
    spinnerControl(false);
}

const fetchApiByID = async (id) => {
    try{
        const res = await fetch (`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`); 
        const data = await res.json();
        seeDetailsModal(data.drinks[0]);
    }
    catch(err){
        console.log(err);
    }
}

const seeDetailsModal = (detailData) => {
    const modalBody = document.getElementById('modal-detail');
    const {idDrink, strAlcoholic, strCategory, strDrink, strDrinkThumb, strGlass, strInstructions} = detailData;
    const {strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5}  = detailData;

    modalBody.innerHTML = `
        <div class="card w-100 bg-gradient">
            <img src="${strDrinkThumb}" class="card-img-top" alt="meal-Image-" width="100%" style="max-height: 300px">
            <div class="card-body">
                <h5 class="card-title text-warning">${strDrink}</h5>
                <p class="card-text"><span class="fw-bold">Alcohol info:</span> ${strAlcoholic}</p>
                <p class="card-text"><span class="fw-bold">Category:</span> ${strCategory}</p>
                <p class="card-text"><span class="fw-bold">Glass:</span> ${strGlass}</p>
                <p class="card-text"><span class="fw-bold">Description:</span> ${strInstructions}</p>
                <p class="card-text"><span class="fw-bold">Ingredients:</span> ${strIngredient1? strIngredient1 + ',': ''} ${strIngredient2? strIngredient2 + ',': ''} ${strIngredient3? strIngredient3 + ',': ''} ${strIngredient4? strIngredient4 + ',': ''} ${strIngredient5? strIngredient5 + ',': ''}</p>
            </div>
        </div>
    `;
}