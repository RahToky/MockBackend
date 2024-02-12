const endpointContentDivElem = document.getElementById("collection-endpoints-div");
const selectedCollectionNameElem = document.getElementById("selected-collection-name");
const startBtnElem = document.getElementById("start-collection-action");
const commentElem = document.getElementById("collection-comment-div");
let selectedCollectionId;
let selectedCollectionElem;

/**
 * Update Play and Stop icon according to "selectedCollectionElem.classList"
 * if content "started", it mean that collection is start, then display stop icon otherwise display play icon
 */
function changePlayIcon() {
    if (selectedCollectionElem.classList.contains("started")) {
        startBtnElem.classList.remove("fa-play");
        startBtnElem.classList.add("fa-stop");
    } else {
        startBtnElem.classList.add("fa-play");
        startBtnElem.classList.remove("fa-stop");
    }
}

/**
 * Start or Stop collection according to current status
 */
startBtnElem.addEventListener('click', () => {
    fetch(`/collections/start/${selectedCollectionId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            if (data.code === 200) {
                selectedCollectionElem.classList.add((data.message === "started") ? 'started' : 'stoped');
                selectedCollectionElem.classList.remove((data.message === "started") ? 'stoped' : 'started');
                changePlayIcon();
            }
        })
        .catch(error => {
            console.log(error);
            alert(error);
        });
});

/**
 * update view according to default selected collection
 * default selected collection has class '.selected-collection-item'
 */
function displayDefaultSelectedEndpoints() {
    selectedCollectionElem = document.querySelector('.selected-collection-item');
    if (selectedCollectionElem) {
        selectCollection(selectedCollectionElem, selectedCollectionElem.getAttribute('collection'));
    }
    changePlayIcon();
}

displayDefaultSelectedEndpoints();

/**
 * Remove all className for every element
 * @param {string} className 
 */
function removeClass(className) {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(element => {
        element.classList.remove(className);
    });
}

/**
 * Update view according to selected collection
 * @param {HTMLElement} elem 
 * @param {*} collection 
 */
function selectCollection(elem, collection) {
    if (endpointContentDivElem) {
        selectedCollectionElem = elem;
        const collectionJSON = JSON.parse(collection);
        const endpoints = collectionJSON.endpoints;
        endpointContentDivElem.innerHTML = "";

        // update selectedCollectionId
        selectedCollectionId = collectionJSON._id;

        //change css selected item
        removeClass('selected-collection-item');
        elem.classList.add('selected-collection-item');

        // Change Play/Stop icon
        changePlayIcon();

        // display collection comments
        commentElem.textContent = collectionJSON.comment || "";

        //change name
        selectedCollectionNameElem.innerHTML = `${collectionJSON.name} Collection`;

        for (const endpoint of endpoints) {
            // create row
            const endpointDiv = document.createElement('div');
            endpointDiv.classList.add('row');
            endpointDiv.classList.add('endpoint-div');

            //create method col
            const methodCol = document.createElement('div');
            methodCol.classList.add('col-md-2');
            methodCol.classList.add('method-tag');
            methodCol.classList.add(`method-tag-${endpoint.method.toLowerCase()}`);
            methodCol.classList.add('text-center');
            const methodSpan = document.createElement('span');
            methodSpan.textContent = endpoint.method.toUpperCase();
            methodCol.appendChild(methodSpan);
            endpointDiv.appendChild(methodCol);

            //create path col
            const pathCol = document.createElement('div');
            pathCol.classList.add('col-md-7');
            const pathSpan = document.createElement('span');
            pathSpan.textContent = (collectionJSON.prefix ? `/${collectionJSON.prefix}` : "") + (endpoint.path ? `/${endpoint.path}` : "");
            pathCol.appendChild(pathSpan);
            endpointDiv.appendChild(pathCol);

            //create action col
            const actionCol = document.createElement('div');
            actionCol.classList.add('col-md-3');
            actionCol.classList.add('text-right');
            actionCol.innerHTML = `<i class='fas fa-pen action'></i> &nbsp; <i class='fas fa-trash action'></i>`
            endpointDiv.appendChild(actionCol);

            endpointContentDivElem.appendChild(endpointDiv);
        }
    }
}

/**
 * Open form page to create or update endpoint
 */
function redirectToEndpointForm() {
    const element = document.querySelector('.selected-collection-item');
    if (element) {
        window.location.href = `/endpoints/${element.getAttribute('collectionId')}`;
    }
}