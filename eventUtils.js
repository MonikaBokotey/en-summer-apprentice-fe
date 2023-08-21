
export function renderEventCard(eventData) {
    const eventCard = document.createElement('div');
    eventCard.classList.add('event-card');

    const eventImages = {
      1: './src/assets/untold.jpg',
      2: './src/assets/electriccastle.jpg',
      3: './src/assets/stadion.jpg',
      5: './src/assets/winefestival.jpg',
      
    };
  
    const eventImage = eventImages[eventData.eventId] || './src/assets/defaultimage.jpg';
  
  
    const contentMarkup = `
      <header>
        <h2 class="event-title text-2xl font-bold">${eventData.eventName}</h2>
      </header>
      <div class="content relative flex">
      <div class="event-image">
      <img src="${eventImage}" alt="${eventData.eventName} Image">
        </div>
        
        <div class="event-details ml-4">
          <p class="description text-gray-700">${eventData.eventDescription}</p>
  
          <button class="btn mt-4" id="showDropdowns">Buy tickets</button>
          <div class="dropdowns hidden absolute bottom-0 right-0 p-4 bg-white border rounded shadow-md">
            <select class="ticket-category mb-2">
              <option value="Standard">Standard</option>
              <option value="VIP">VIP</option>
            </select>
            <input
                type="number"
                  class="ticket-quantity"
                      min="1"
                      max="20" 
                   value="1"
              />
            <button class="btn btn-primary mt-2">Purchase</button>
          </div>
        </div>
      </div>
    `;
  
    eventCard.innerHTML = contentMarkup;
  
    const showDropdownsButton = eventCard.querySelector('#showDropdowns');
    const dropdowns = eventCard.querySelector('.dropdowns');
  
    showDropdownsButton.addEventListener('click', () => {
      dropdowns.classList.toggle('hidden');
    });
  
    const purchaseButton = eventCard.querySelector('.btn.btn-primary');
    purchaseButton.addEventListener('click', async () => {
      const selectedCategoryValue = eventCard.querySelector('.ticket-category').value;
      console.log('selected value:', selectedCategoryValue);
    
      let selectedCategoryId;
    
      const event_id = eventData.eventId;
      try {
        selectedCategoryId = await getTicketId(event_id, selectedCategoryValue);
        console.log('Retrieved ticketCategoryId:', selectedCategoryId);
      } catch (error) {
        console.error('Error retrieving ticketCategoryId:', error);
        return;
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
  
    return eventCard;
  }

  
export async function fetchEvents(){
    const response = await fetch('https://localhost:7214/api/Event/GetAll');
    const data=await response.json();
    console.log('events:',data);
    return data;
  }
  

 export async function getTicketId(eventId, description){
    const response = await fetch(`https://localhost:7214/api/TicketCategory/GetByOrderId?event_id=${eventId}&description=${description}`);
    const data=await response.json();
    return data;
  }
  

  
export async function placeOrder(orderData) {
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
  