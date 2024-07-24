// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALPWJxAtZ2uKxMAd5A6JNIpG5CStRRv3I",
  authDomain: "targets-3c17d.firebaseapp.com",
  projectId: "targets-3c17d",
  storageBucket: "targets-3c17d.appspot.com",
  messagingSenderId: "419504485558",
  appId: "1:419504485558:web:f1697477f8d1c102686217",
  measurementId: "G-MKZKZM40YG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to add a task
async function addTask(subject, taskName) {
  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      subject: subject,
      taskName: taskName,
      completed: false,
      completionTime: null
    });
    console.log("Task added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding task: ", e);
  }
}

// Function to fetch tasks
async function fetchTasks() {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      // Render tasks on the page
      renderTask(doc.id, doc.data());
    });
  } catch (e) {
    console.error("Error fetching tasks: ", e);
  }
}

// Function to render tasks on the page
function renderTask(id, data) {
  const taskList = document.getElementById('task-list');
  const taskItem = document.createElement('div');
  taskItem.innerHTML = `
    <div>
      <strong>${data.subject}</strong>: ${data.taskName}
      <button onclick="markAsDone('${id}')">Mark as Done</button>
      <button onclick="removeTask('${id}')">Remove</button>
    </div>
  `;
  taskList.appendChild(taskItem);
}

// Function to mark task as done
async function markAsDone(taskId) {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      completed: true,
      completionTime: new Date()
    });
    console.log("Task marked as done");
    document.getElementById('task-list').innerHTML = '';
    fetchTasks();
  } catch (e) {
    console.error("Error marking task as done: ", e);
  }
}

// Function to remove a task
async function removeTask(taskId) {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
    console.log("Task removed");
    document.getElementById('task-list').innerHTML = '';
    fetchTasks();
  } catch (e) {
    console.error("Error removing task: ", e);
  }
}

// Fetch and display tasks when the page loads
document.addEventListener('DOMContentLoaded', fetchTasks);
