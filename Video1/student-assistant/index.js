const fs = require("fs");
const path = require("path");
const readline = require("readline");
const EventEmitter = require("events");
const event = new EventEmitter();
const studentName = process.argv[2] || "Student";
// node index.js "Student Name"
const filePath = path.join(__dirname, "tasks.txt");
console.log("Welcome, " + studentName + "!");
console.log("Your Student Assistant is ready.");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
event.on("taskAdded", function(task) {
    console.log("[EVENT] New task added: " + task);
});
function showMenu() {
    console.log("\n--- Student Assistant ---");
    console.log("1. Add a task");
    console.log("2. View all tasks");
    console.log("3. Exit");
    rl.question("Enter your choice: ", function(choice) {
    if (choice === "1") {
        addTask();
    } else if (choice === "2") {
        viewTasks();
    } else if (choice === "3") {
        console.log("Goodbye!");
        rl.close();
    } else {
        console.log("Invalid choice. Try again.");
        showMenu();
    }
});
}
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
}
function addTask() {
    rl.question("Enter your task: ", function(task) {
        if (task.trim() === "") {
            console.log("Task cannot be empty.");
            showMenu();
            return;
        }

        fs.appendFileSync(filePath, task.trim() + "\n");

        console.log("Task saved successfully!");

        event.emit("taskAdded", task.trim());

        showMenu();
    });
}
function viewTasks() {
    const tasks = fs.readFileSync(filePath, "utf8");

    if (tasks.trim() === "") {
        console.log("No tasks saved yet.");
    } else {
        console.log("\nYour saved tasks:");
        console.log(tasks);
    }

    showMenu();
}
showMenu();

