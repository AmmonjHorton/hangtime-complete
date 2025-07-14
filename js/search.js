// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCvSA5DR23W42dyCtgw12cZD4fLRbDBRGs",
  authDomain: "hangtime-dec96.firebaseapp.com",
  projectId: "hangtime-dec96",
  storageBucket: "hangtime-dec96.appspot.com",
  messagingSenderId: "324453681821",
  appId: "1:324453681821:web:1d803461e5438cddc9a274"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Search function (only searches the `tag` field in `events`)
async function searchActivities() {
  const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "Searching...";

  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    const results = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      const tagMatch = data.tag && data.tag.toLowerCase().includes(keyword);
      if (tagMatch) {
        results.push(data);
      }
    });

    if (results.length === 0) {
      resultsDiv.innerHTML = "<p>No events found.</p>";
    } else {
      resultsDiv.innerHTML = results.map(event => {
        let readableDate = "N/A";
        if (event.date && event.date.seconds) {
          const dateObj = new Date(event.date.seconds * 1000);
          readableDate = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
        }

        return `
          <div class="event">
            <h3>${event.name || "Untitled Event"}</h3>
            <p><strong>Tag:</strong> ${event.tag || "N/A"}</p>
            <p><strong>Description:</strong> ${event.description || "N/A"}</p>
            <p><strong>Date:</strong> ${readableDate}</p>
            <p><strong>Address:</strong> ${event.address || "N/A"}</p>
          </div>
        `;
      }).join("");
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    resultsDiv.innerHTML = "<p>Error fetching events. Check console for details.</p>";
  }
}

window.searchActivities = searchActivities;
