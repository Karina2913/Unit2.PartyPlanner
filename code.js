const COHORT = "2406-FTB-MT-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/parties`;

const state = {
    parties: [],
};

const partiesList = document.querySelector("#parties");

const addPartiesForm = document.querySelector("#addParty");
addPartiesForm.addEventListener("submit", addParty);

//syncing state with the API
async function render() {
    await getParties();
    renderParties();
}
render();

//update state with parties from API
async function getParties() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: addPartiesForm.name.value,
                date: addPartiesForm.date.value,
                location: addPartiesForm.location.value,
                description: addPartiesForm.description.value,
            })
        });
        const result = await response.json();
        state.parties = result;
    } catch (error) {
        console.error(error);
    }
}

//render parties
function renderParties() {
    if (!state || state.parties.length === 0) {
        partiesList.innerHTML = "<li>No parties</li>";
        return;
    }

    // adding party
    const partyElement = state.parties.map((party) => {
        const li = document.createElement("li");
        li.innerHTML = `
        <h2>${party.name}</h2>
        <h3>${party.date}</h3>
        <h3>${party.location}</h3>
        <p>${party.description}</p>
        `;

        const deleteButton = li.querySelector(".delete-button");
        deleteButton.addEventListener("click", () => {
            removeParty(party.id);
        });
        return li;
    });
    partiesList.replaceChildren(...partyElement);
}

//post request based on form data
// entering event parameter --> can event hold name, date, location, description?
async function addParty(event) {
    event.preventDefault();

    try {
        const response = await fetch (API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: addPartiesForm.name.value,
                date: addPartiesForm.date.value,
                location: addPartiesForm.location.value,
                description: addPartiesForm.description.value,
            }),
        });

        if (!response.ok){
            throw new Error("Failed to create party");
        }

        render();

    } catch (error) {
        console.error(error);
    }
}

async function removeParty(id) {
    try {
        const response = await fetch (`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok){
            throw new Error("Failed to delete party");
        }

        render();

    } catch (error) {
        console.error(error);
    }
}