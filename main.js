//import {removeLoader,addLoader} from './loader.js';
import { renderEventCard,fetchEvents,getTicketId,placeOrder } from './eventUtils';
// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <img src="./src/assets/Endava.png" alt="summer">
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}


function getOrdersPageTemplate() {
  return `
    <div id="content">
    <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
    </div>
  `;
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);

}

async function filterAndRenderEvents(searchValue) {
  if (searchValue.trim() === '') {
    renderHomePage(); // Display all events
    return;
  }

  const events = await fetchEvents();
  const filteredEvents = events.filter(event => event.eventName.toLowerCase().includes(searchValue.toLowerCase()));
  renderFilteredEvents(filteredEvents);
}


function renderFilteredEvents(events) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  const searchInputHtml = renderSearch(); 
  mainContentDiv.insertAdjacentHTML('beforeend', searchInputHtml);

  const eventsContainer = document.createElement('div');
  eventsContainer.classList.add('events');

  events.forEach(eventData => {
    const eventCard = renderEventCard(eventData);
    eventsContainer.appendChild(eventCard);
  });

  mainContentDiv.appendChild(eventsContainer);
}

function renderSearch() {
  return `
    <div id="filter" class="mb-4">
      <label for="name" class="block text-gray-700 font-bold">Search by Event Name:</label>
      <div class="flex">
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter event name..."
          class="mt-1 p-2 border rounded-l w-full focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          id="searchButton"
          class="bg-blue-500 text-black p-2 rounded-r focus:outline-none focus:ring focus:border-blue-300"
        >
          Search
        </button>
      </div>
    </div>
  `;
}


async function fetchEventByVenueAndType(venueId,eventType){
  const response = await fetch(`http://localhost:9090/api/event?venueId=${venueId}&eventType=${eventType}`);
  const data=await response.json();
  return data;
}


async function fetchEventById(eventId){
  const response = await fetch(`https://localhost:7214/api/Event/GetByEventId?id=${eventId}`);
  const data=await response.json();
  return data;
}

async function renderFilteredPage(venueId, eventType){
  const mainContentDiv = document.querySelector('.main-content-component');

  // Fetch events based on venue and event type
  const eventsByVenueAndType = await fetchEventByVenueAndType(venueId, eventType);

  for (const eventData of eventsByVenueAndType) {
    // Fetch each event by its eventId
    const event = await fetchEventById(eventData.eventId);

    const eventsContainer = document.createElement('div');
    eventsContainer.classList.add('events');

    const eventCard = renderEventCard(event);
    eventsContainer.appendChild(eventCard);

    mainContentDiv.innerHTML = ''; // Clear previous content
    mainContentDiv.appendChild(eventsContainer);
  }
}


function renderEventFilterButtons() {
  const filterButton = document.createElement('div');

  const filterHtml = `
//   <style>
//   /* Your existing styles here */

//   #event-filter {
//     /* New positioning styles */
//     position: absolute;
//     top: 20px;
//     right: 20px;
//     /* Other existing styles */
//     border: 1px solid #ccc;
//     padding: 10px;
//     background-color: #f9f9f9;
//   }

//   /* Rest of your existing styles */
// </style>

    <div id="event-filter">
      
      <button class="btn mt-4" id="showDropdownsFilter">Filter by</button>
      <div class="filter-section">
        <h4>Venue</h4>
        <label>
          <input type="radio" name="venue" value="Stadion">
          Stadion
        </label>
        <label>
          <input type="radio" name="venue" value="Castle">
          Castle
        </label>
        <label>
        <input type="radio" name="venue" value="Park">
        Park
      </label>
      </div>
      <div class="filter-section">
        <h4>Type</h4>
        <label>
          <input type="radio" name="type" value="Festival de muzica">
          Festival de muzica
        </label>
        <label>
          <input type="radio" name="type" value="Sport">
          Sport
        </label>
        <label>
          <input type="radio" name="type" value="Bauturi">
          Bauturi
        </label>
      </div>
      <button id="apply-filters">Apply Filters</button>
    </div>
  `;

  return filterHtml;

  
}


function setupFilterButton() {
  const applyFiltersButton = document.querySelector('#apply-filters');

  applyFiltersButton.addEventListener('click', async () => {
    const selectedVenue = document.querySelector('input[name="venue"]:checked')?.value;
    const selectedType = document.querySelector('input[name="type"]:checked')?.value;

    let venueId = null;
    // Map venue names to their IDs
    const venueMap = {
      Stadion: 1,
      Castle: 2,
      Park: 3,
    };

    if (selectedVenue in venueMap) {
      venueId = venueMap[selectedVenue];
    }
    console.log('selected venue', venueId);
    console.log('selected type', selectedType);

    // Fetch and render filtered events
    await renderFilteredPage(venueId, selectedType);

    console.log('Filtered events rendered');
  });
}

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  const searchInputHtml = renderSearch();
  mainContentDiv.insertAdjacentHTML('beforeend', searchInputHtml);

  const renderVenueAndType = renderEventFilterButtons();
  mainContentDiv.insertAdjacentHTML('beforeend', renderVenueAndType);
  const searchButton = document.querySelector('#searchButton');
  if (searchButton) {
    searchButton.addEventListener('click', () => {
      const filterInput = document.querySelector('#name');
      if (filterInput) {
        const searchValue = filterInput.value.trim().toLowerCase();
        console.log('Search value:', searchValue);
        filterAndRenderEvents(searchValue);
      }
    });
  }

  const applyFiltersButton = document.querySelector('#apply-filters');
  if (applyFiltersButton) {
    applyFiltersButton.addEventListener('click', () => {
    
      setupFilterButton();
      
    });
  }

  // Fetch and render events here
  fetchEvents().then(data => {
    const eventsContainer = document.createElement('div');
    eventsContainer.classList.add('events-grid');

    data.forEach(eventData => {
      const eventCard = renderEventCard(eventData);
      eventsContainer.appendChild(eventCard);
    });

    mainContentDiv.appendChild(eventsContainer);
  });
}

async function deleteEventById(orderId) {
  try {
    const response = await fetch(`https://localhost:7214/api/Order/Delete?id=${orderId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      return { success: true, message: 'Event deleted successfully.' };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message };
    }
  } catch (error) {
    return { success: false, message: 'An error occurred while deleting the event.' };
  }
}

async function fetchOrders(){
  const response = await fetch('https://localhost:7214/api/Order/GetAll');
  const data=await response.json();
  return data;
}


async function getEventNameFromOrder(eventId) {
  const response = await fetch(`https://localhost:7214/api/Order/GetEventNameByOrderId?event_id=${eventId}`);
  const eventName = await response.text(); 
  return eventName;
}


function renderOrdersPage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  fetchOrders().then(async ordersData => {
    console.log('Fetched orders:', ordersData);

    const ordersContainer = document.createElement('div');
    ordersContainer.classList.add('orders-container');

    for (const order of ordersData) {
      const eventName = await getEventNameFromOrder(order.orderId);
      const eventCard = renderOrderCard(eventName, order);

      ordersContainer.appendChild(eventCard);
    }

    mainContentDiv.appendChild(ordersContainer);
  });
}
async function patchOrders(orderId, numberOfTickets, ticketCategoryId) {
  const url = `https://localhost:7214/api/Order/Patch`; // Update with the correct URL
  const patchData = {
    orderId: orderId,
    numberOfTickets: numberOfTickets,
    ticketCategoryId: ticketCategoryId
  };

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patchData)
    });

    if (!response.ok) {
      throw new Error(`Patch request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error patching order:', error);
    throw error;
  }
}



function renderOrderCard(eventName, orderData) {
  const eventCard = document.createElement('div');
  eventCard.classList.add('event-card');

  // Determine ticket category based on ticketCategoryId
  let ticketCategory = '';
  if ([1, 2, 3, 4].includes(orderData.ticketCategoryId)) {
    ticketCategory = 'Standard';
  } else if ([5, 6, 7].includes(orderData.ticketCategoryId)) {
    ticketCategory = 'VIP';
  }
  const ticketCategoryOptions = `
  <option value="Standard" ${ticketCategory === 'Standard' ? 'selected' : ''}>Standard</option>
  <option value="VIP" ${ticketCategory === 'VIP' ? 'selected' : ''}>VIP</option>
`;
  

  const orderHtml = `
    <div class="order-details">
      <div class="order-field">
        <span class="field-name">Event Name:</span>
        <span class="field-value">${eventName}</span>
      </div>
      <div class="order-field">
      <span class="field-name">Ticket Category:</span>
      <span class="field-value" id="ticketCategory">${ticketCategory}</span>
      <select class="edit-input" id="editTicketCategory" style="display: none">${ticketCategoryOptions}</select>
    </div>
    <div class="order-field">
      <span class="field-name">Number of Tickets:</span>
      <span class="field-value" id="numberOfTickets">${orderData.numberOfTickets}</span>
      <input type="number" class="edit-input" id="editNumberOfTickets" style="display: none" value="${orderData.numberOfTickets}" />
    </div>
      <div class="order-field">
        <span class="field-name">Ordered At:</span>
        <span class="field-value">${orderData.orderedAt}</span>
      </div>
      <div class="order-field">
        <span class="field-name">Total Price:</span>
        <span class="field-value">${orderData.totalPrice}</span>
      </div>
      <div class="order-buttons">
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
      </div>
      
    </div>
  `;


  eventCard.innerHTML = orderHtml; // Set the HTML content first
  
  // Now query for the delete button element
  const deleteButton = eventCard.querySelector('.delete-button');
  deleteButton.addEventListener('click', async () => {
    const deletionResult = await deleteEventById(orderData.orderId);
    if (deletionResult.success) {
      eventCard.remove();
      console.log('successful deletion')
    } else {
      console.error(deletionResult.message);
    }
  });

  const editButton = eventCard.querySelector('.edit-button');
  editButton.addEventListener('click', () => {
    const fieldDisplayCategory = eventCard.querySelector('.field-value#ticketCategory');
    const selectDisplayCategory = eventCard.querySelector('.edit-input#editTicketCategory');
  
    const fieldDisplayTickets = eventCard.querySelector('.field-value#numberOfTickets');
    const inputDisplayTickets = eventCard.querySelector('.edit-input#editNumberOfTickets');

    fieldDisplayCategory.style.display = 'none';
    selectDisplayCategory.style.display = 'inline-block';
    selectDisplayCategory.focus();

    fieldDisplayTickets.style.display = 'none';
    inputDisplayTickets.style.display = 'inline-block';
    inputDisplayTickets.focus();

    editButton.textContent = 'Save';

    const saveClickListener = async () => {
      const newCategoryValue = selectDisplayCategory.value;
      const newTicketValue = inputDisplayTickets.value;

      fieldDisplayCategory.textContent = newCategoryValue;
      selectDisplayCategory.style.display = 'none';
      fieldDisplayCategory.style.display = 'inline-block';

      fieldDisplayTickets.textContent = newTicketValue;
      inputDisplayTickets.style.display = 'none';
      fieldDisplayTickets.style.display = 'inline-block';

      editButton.textContent = 'Edit';

      // Update the orderData with the new values
      if (newCategoryValue === 'Standard') {
        if(orderData.eventId===1)
        orderData.ticketCategoryId = 1; 
      else if (orderData.eventId===2)
      orderData.ticketCategoryId = 2; 
      else if (orderData.eventId===3)
      orderData.ticketCategoryId = 3; 
      else if (orderData.eventId===4)
      orderData.ticketCategoryId = 4; 

      } else if (newCategoryValue === 'VIP') {
        if(orderData.eventId===1)
        orderData.ticketCategoryId = 5; 
        else if (orderData.eventId===2)
        orderData.ticketCategoryId = 6; 
        else if (orderData.eventId===3)
        orderData.ticketCategoryId = 7; 

      }

      orderData.numberOfTickets = newTicketValue;

      try {
        const patchResponse = await patchOrders(orderData.orderId, newTicketValue, orderData.ticketCategoryId);
        console.log('Order patched successfully:', patchResponse);
      } catch (error) {
        console.error('Error patching order:', error);
      }
    };

    editButton.removeEventListener('click', saveClickListener); // Remove previous listener if exists
    editButton.addEventListener('click', saveClickListener);
  });
  return eventCard;
}





// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();