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

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();
  // Sample hardcoded event data
  const eventData = {
    id: 1,
    description: 'Sample event description.',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    name: 'Sample Event',
    date: '08.07.2023',
    location:'Cluj-Napoca',
    ticketCategories: [
      { id: 1, description: 'General Admission' },
      { id: 2, description: 'VIP' },
    ],
  };
  // Create the event card element
  const eventCard = document.createElement('div');
  eventCard.classList.add('event-card'); 
  // Create the event content markup
  const contentMarkup = `
  <header>
    <h2 class="event-title text-2xl font-bold">${eventData.name}</h2>
  </header>
  <div class="content relative flex">
    <img src="${eventData.img}" alt="${eventData.name}" class="event-image w-1/4 rounded object-cover mb-4">
    <div class="event-details ml-4">
      <p class="description text-gray-700">${eventData.description}</p>
      <p class="date text-gray-700">${eventData.date}</p>
      <p class="location text-gray-700">${eventData.location}</p>
      <button class="btn mt-4" id="showDropdowns">Buy tickets</button>
      <div class="dropdowns hidden absolute bottom-0 right-0 p-4 bg-white border rounded shadow-md">
        <select class="ticket-category mb-2">
          <option value="general">General Admission</option>
          <option value="vip">VIP</option>
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

// JavaScript to handle dropdown toggle
document.addEventListener('DOMContentLoaded', () => {
  const showDropdownsButton = document.getElementById('showDropdowns');
  const dropdowns = document.querySelector('.dropdowns');

  showDropdownsButton.addEventListener('click', () => {
    dropdowns.classList.toggle('hidden');
  });
});
  eventCard.innerHTML = contentMarkup;
  const eventsContainer = document.querySelector('.events');
  // Append the event card to the events container
  eventsContainer.appendChild(eventCard);
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