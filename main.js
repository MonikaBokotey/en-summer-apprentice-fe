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


async function fetchEvents(){
  const response = await fetch('https://localhost:7214/api/Event/GetAll');
  const data=await response.json();
  return data;
}

async function placeOrder(orderData) {
  // const orderData1 = {
  //   "eventId": "1",
  //   "ticketCategoryId": "2",
  //   "numberOfTickets": "3"
  // };
  console.log('order', orderData);
  const url = 'http://localhost:9090/api/orders'; 
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
      
    },
    body: JSON.stringify(orderData), 
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorMessage = await response.text(); 
      throw new Error(`Network response was not ok: ${response.status} - ${errorMessage}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Example order data
const orderData = {
  "eventId": "1",
	"ticketCategoryId": "2",
	"numberOfTickets": "3"
};



placeOrder(orderData).then(data => {
  console.log('Order placed:', data);
  
});

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = ''; 

  fetchEvents().then(data => {
    console.log('Fetched data:', data);

    const eventsContainer = document.createElement('div');
    eventsContainer.classList.add('events');

    data.forEach(eventData => {
      const eventCard = document.createElement('div');
      eventCard.classList.add('event-card');

      const contentMarkup = `
        <header>
          <h2 class="event-title text-2xl font-bold">${eventData.eventName}</h2>
        </header>
        <div class="content relative flex">
          
          <div class="event-details ml-4">
            <p class="description text-gray-700">${eventData.eventDescription}</p>
    
            <button class="btn mt-4" id="showDropdowns">Buy tickets</button>
            <div class="dropdowns hidden absolute bottom-0 right-0 p-4 bg-white border rounded shadow-md">
              <select class="ticket-category mb-2">
                <option value="Standard">Standard</option>
                <option value="VIP">VIP</option>
              </select>
              <select class="ticket-quantity">
                <option value="1">1 Ticket</option>
                <option value="2">2 Tickets</option>
                <option value="3">3 Tickets</option>
                <!-- Add more options as needed -->
              </select>
              <button class="btn btn-primary mt-2">Purchase</button>
            </div>
          </div>
        </div>
      `;

      eventCard.innerHTML = contentMarkup;
      eventsContainer.appendChild(eventCard);

      const showDropdownsButton = eventCard.querySelector('#showDropdowns');
      const dropdowns = eventCard.querySelector('.dropdowns');
   
      showDropdownsButton.addEventListener('click', () => {
        dropdowns.classList.toggle('hidden');
      });
   
      // Attach the event listener to the current "Purchase" button
      const purchaseButton = eventCard.querySelector('.btn.btn-primary');
      purchaseButton.addEventListener('click', async () => {
        const selectedCategoryValue = eventCard.querySelector('.ticket-category').value;
        console.log('selected value:', selectedCategoryValue);
        let selectedCategoryId;
      
        if (selectedCategoryValue === 'Standard') {
          selectedCategoryId = 1;
        } else if (selectedCategoryValue === 'VIP') {
          selectedCategoryId = 2;
        } else {
          // Handle other cases or set a default value if needed
          selectedCategoryId = 0;
        }
      
        const selectedQuantity = parseInt(eventCard.querySelector('.ticket-quantity').value, 10);
      
        const orderData = {
          eventId: eventData.eventId,
          ticketCategoryId: selectedCategoryId,
          numberOfTickets: selectedQuantity,
        };
      
        try {
          const response = await placeOrder(orderData);
          console.log('Order placed:', response);
          // Process the response data as needed
        } catch (error) {
          console.error('Error placing order:', error);
        }
      });
      
      
    });

    mainContentDiv.appendChild(eventsContainer);
  });
}


function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
}
// Render the event card based on eventData
function renderEventCard(eventData) {
  const eventCard = document.createElement('div');
  eventCard.classList.add('event-card');

  const contentMarkup = `
    <header>
      <h2 class="event-title text-2xl font-bold">${eventData.name}</h2>
    </header>
    <div class="content">
      <img src="${eventData.img}" alt="${eventData.name}" class="event-image w-full height-200 rounded object-cover mb-4">
      <p class="description text-gray-700">${eventData.description}</p>
    </div>
  `;

  eventCard.innerHTML = contentMarkup;
  const eventsContainer = document.querySelector('.events');
  eventsContainer.appendChild(eventCard);
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