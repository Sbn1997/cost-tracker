/* Yarin Ben Moshe 314939885
Amit Rahamim 318816535
Shahar Ben Naim 208628453 */

let db;
        async function initDatabase(DB_NAME, DB_VERSION) {
            return new Promise((resolve, reject) => {
                const request = window.indexedDB.open(DB_NAME, DB_VERSION);

                request.onerror = (event) => {
                    console.error("Database error:", event.target.errorCode);
                    reject(event.target.errorCode);
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    const objectStore = db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
                    objectStore.createIndex('cost', 'cost', { unique: false });
                    objectStore.createIndex('description', 'description', { unique: false });
                    objectStore.createIndex('category', 'category', { unique: false });
                    objectStore.createIndex('year', 'year', { unique: false });
                    objectStore.createIndex('month', 'month', { unique: false });
                };

                request.onsuccess = (event) => {
                    db = event.target.result;
                    resolve(db);
                };
            });
        }

        async function addCost( cost,category,description) {

            console.log("addItem Called")

            const today = new Date();

            const year = today.getFullYear();
            const month = today.getMonth() + 1; 
            const transaction = db.transaction(['items'], 'readwrite');
            const objectStore = transaction.objectStore('items');

            return new Promise((resolve, reject) => {
                const request = objectStore.add({ cost ,description,category});

                request.onsuccess = () => {
                    resolve();
                    console.log("Added succesfully to the DB")
                };

                request.onerror = (event) => {
                    console.error("Error adding item:", event.target.error);
                    reject(event.target.error);
                };
            });
        }

        async function deleteItemById( id ) {
            console.log("deleteItem Called")
            console.log(id)
            const transaction = db.transaction(['items'], 'readwrite');
            const objectStore = transaction.objectStore('items');

            return new Promise((resolve, reject) => {
                const request = objectStore.delete(id);

                request.onsuccess = () => {
                    resolve();
                    console.log("Deleted succesfully to the DB")
                };

                request.onerror = (event) => {
                    console.error("Error adding item:", event.target.error);
                    reject(event.target.error);
                };
            });
        }

      

        async function getItemsByMonthAndYear(year, month) {
            const transaction = db.transaction(['items'], 'readonly');
            const objectStore = transaction.objectStore('items');
            const index = objectStore.index('year');
            const range = IDBKeyRange.only(year);
            const items = [];

            return new Promise((resolve, reject) => {
                index.openCursor(range).onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        if (cursor.value.month === month) {
                            items.push(cursor.value);
                        }
                        cursor.continue();
                    } else {
                        resolve(items);
                    }
                };

                transaction.onerror = (event) => {
                    console.error("Error fetching items:", event.target.error);
                    reject(event.target.error);
                };
            });
        }

        async function getItemsByDateRange(startYear, startMonth, endYear, endMonth) {
            const transaction = db.transaction(['items'], 'readonly');
            const objectStore = transaction.objectStore('items');
            const index = objectStore.index('year'); // Assuming you have an index on 'year'.
            
            // Creating a range for years.
            const yearRange = IDBKeyRange.bound(startYear, endYear);
            const items = [];
        
            return new Promise((resolve, reject) => {
                index.openCursor(yearRange).onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        const item = cursor.value;
                        const itemYear = item.year;
                        const itemMonth = item.month;
                        
                        // Now we manually check if the item falls within the start and end month of the start and end years.
                        if ((itemYear > startYear || (itemYear === startYear && itemMonth >= startMonth)) &&
                            (itemYear < endYear || (itemYear === endYear && itemMonth <= endMonth))) {
                            items.push(item);
                        }
                        cursor.continue();
                    } else {
                        resolve(items);
                    }
                };
        
                transaction.onerror = (event) => {
                    console.error("Error fetching items:", event.target.error);
                    reject(event.target.error);
                };
            });
        }

        const handleReportRange = async (startYear, startMonth, endYear, endMonth) => {
            const fetchedItems = await getItemsByDateRange(startYear, startMonth, endYear, endMonth);

          };

        async function handleAddItem() {
            const cost = document.getElementById('cost').value;
            const description = document.getElementById('description').value;
            const category = document.getElementById('category').value;
            const year = document.getElementById('year').value;
            const month = document.getElementById('month').value;

            try {
                await addItem(cost,description, year, month);
                console.log("Item added successfully!");
            } catch (error) {
                console.error("Failed to add item:", error);
            }
        }

        async function handleShowReport() {
            const year = document.getElementById('reportYear').value;
            const month = document.getElementById('reportMonth').value;

            try {
                const items = await getItemsByMonthAndYear(year, month);
                const reportContainer = document.getElementById('reportContainer');
                reportContainer.innerHTML = ''; // Clear previous report

                if (items.length === 0) {
                    reportContainer.textContent = "No items found for the specified month and year.";
                } else {
                    const ul = document.createElement('ul');
                    items.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = `Item: ${item.item}, Cost: ${item.cost}, Year: ${item.year}, Month: ${item.month}`;
                        ul.appendChild(li);
                    });
                    reportContainer.appendChild(ul);
                }
            } catch (error) {
                console.error("Failed to fetch items:", error);
            }
        }


        // async function getAllItems() {
        //     const transaction = db.transaction(['items'], 'readonly');
        //     const objectStore = transaction.objectStore('items');
        //     const items = [];
        
        //     return new Promise((resolve, reject) => {
        //         objectStore.openCursor().onsuccess = (event) => {
        //             const cursor = event.target.result;
        //             if (cursor) {
        //                 items.push(cursor.value);
        //                 cursor.continue();
        //             } else {
        //                 resolve(items);
        //             }
        //         };
        
        //         transaction.onerror = (event) => {
        //             console.error("Error fetching items:", event.target.error);
        //             reject(event.target.error);
        //         };
        //     });
        // }

        async function openCostsDB(db_name, ver) {
            try {
                const dbConnection = await initDatabase(db_name, ver);
                console.log("Database initialized successfully!");
        
                // Return an object that encapsulates database operations
                return {
                    addCost: (cost, category, description) => addCost(cost, category, description),
                    // Include other methods as needed
                };
        
            } catch (error) {
                console.error("Failed to initialize database:", error);
            }
        }

        window.idb = {
            openCostsDB: openCostsDB
        };

        // openCostsDB();

        

