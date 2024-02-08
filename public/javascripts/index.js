const endpointContentDivElem = document.getElementById("collection-endpoints-div");
const selectedCollectionNameElem = document.getElementById("selected-collection-name");

function displayDefaultSelectedEndpoints() {
    const element = document.querySelector('.selected-collection-item');
    if (element) {
        selectCollection(element, element.getAttribute('collection'));
    }
}

displayDefaultSelectedEndpoints();

function removeClass(className) {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(element => {
        element.classList.remove(className);
    });
}

function selectCollection(elem, collection) {
    if (endpointContentDivElem) {
        const collectionJSON = JSON.parse(collection);
        const endpoints = collectionJSON.endpoints;
        endpointContentDivElem.innerHTML = "";

        //change css selected item
        removeClass('selected-collection-item');
        elem.classList.add('selected-collection-item');

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