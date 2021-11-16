
let db;

const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_datapoint', { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.onLine) {
        // uploadData();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
}

function saveData(record) {
    const transaction = db.transaction(['new_datapoint'], 'readwrite');
  
    const dataObjectStore = transaction.objectStore('new_datapoint');
  
    dataObjectStore.add(record);
  }

function uploadData() {
    const transaction = db.transaction(['new_datapoint'], 'readwrite');

    const dataObjectStore = transaction.objectStore('new_datapoint');

    const getAll = dataObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }

                    const transaction = db.transaction(['new_datapoint', 'readwrite']);
                    const dataObjectStore = transaction.objectStore('new_datapoint');
                    dataObjectStore.clear();

                    alert('All saved transactions have been submitted')
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
}

window.addEventListener('online', uploadData)