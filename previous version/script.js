const CATEGORIES = [
    { name: "technology", color: "#3b82f6" },
    { name: "science", color: "#16a34a" },
    { name: "finance", color: "#ef4444" },
    { name: "society", color: "#eab308" },
    { name: "entertainment", color: "#db2777" },
    { name: "health", color: "#14b8a6" },
    { name: "history", color: "#f97316" },
    { name: "news", color: "#8b5cf6" },
  ];
  function getColor(category) {
    const foundCategory = CATEGORIES.find(el => el.name === category);
    return foundCategory ? foundCategory.color : null;
}
  

const allCategories = CATEGORIES.map((el) => el["name"])

const initialFacts = [
    {
      id: 1,
      text: "React is being developed by Meta (formerly facebook)",
      source: "https://opensource.fb.com/",
      category: "technology",
      votesInteresting: 24,
      votesMindblowing: 9,
      votesFalse: 4,
      createdIn: 2021,
    },
    {
      id: 2,
      text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
      source:
        "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
      category: "society",
      votesInteresting: 11,
      votesMindblowing: 2,
      votesFalse: 0,
      createdIn: 2019,
    },
    {
      id: 3,
      text: "Lisbon is the capital of Portugal",
      source: "https://en.wikipedia.org/wiki/Lisbon",
      category: "society",
      votesInteresting: 8,
      votesMindblowing: 3,
      votesFalse: 1,
      createdIn: 2015,
    },
  ];

//Selecting DOM Elements
const btn = document.querySelector(".btn-open")
const form = document.querySelector(".fact-form")
const factsList = document.querySelector(".facts-list");

// Create DOM Elements: Render facts in list
factsList.innerHTML = "";

// Load data from SUPABASE
loadFacts();
async function loadFacts() {
const res = await fetch('https://dbhfbfvcbnfnekuzzhul.supabase.co/rest/v1/facts', {
    headers: {
        apikey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiaGZiZnZjYm5mbmVrdXp6aHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NDQxODUsImV4cCI6MjAyODQyMDE4NX0.hppRnlR7q1WOC288sO1qmqzfM4WlE8yeRPlFdAR6dUs",
        authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiaGZiZnZjYm5mbmVrdXp6aHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NDQxODUsImV4cCI6MjAyODQyMDE4NX0.hppRnlR7q1WOC288sO1qmqzfM4WlE8yeRPlFdAR6dUs",
    },
}
)
;
const data = await res.json()
createFactList(data)
}


createFactList(initialFacts)
function createFactList(dataArray) {
    const htmlArr = dataArray.map((fact)=>`<li class="fact">
<p>${fact.text}
    <a href="${fact.source}" target="_blank" class="source">(Source)</a>
</p>
<span class="tag" style="background-color: ${getColor(fact.category)};">${fact.category}</span>
</li>`);

const html = htmlArr.join("");
factsList.insertAdjacentHTML("afterbegin", html)
}








// Toggle form visibility
btn.addEventListener('click', function(){
    if (form.classList.contains('hidden')) {
        form.classList.remove("hidden");
        btn.textContent = "Close"
    }
    else {
        form.classList.add("hidden")
        btn.textContent = "Share a fact"
    }
});

console.log([7, 64, 6, -23, 11].filter((el) => el => 10));
const data = await res.json();
console.log(data)
/*
PRACTICE JS
let votesInteresting = 23;
let votesMindblowing = 5;
const text = 'Lisbon is the capital of Portugal';

votesInteresting = votesInteresting + 1;
votesInteresting++;
console.log(votesInteresting);

let totalUpvotes = votesInteresting + votesMindblowing;
console.log("Upvotes: ", totalUpvotes);

let votesFalse = 4;
const isCorrect = votesFalse < totalUpvotes;
console.log(isCorrect);
console.log(parseInt("24.52abcd"))


function calcFactAge(year) {
    const currentYear = new Date().getFullYear();
    let age = currentYear - year;
    if (age >= 0)
        return age;
    else return `Year needs to be less or equal to ${currentYear}`;
}

const age1 = calcFactAge(2029);

*/


/*
let votesInteresting = 20;
let votesMindblowing = 5;

if (votesInteresting === votesMindblowing) {
    alert('This fact is equally intersting and mindblowing');
} else if (votesInteresting > votesMindblowing) {
    console.log("Intersting fact!");
} else if (votesInteresting < votesMindblowing) {
    console.log("Mindblowing fact!!");
}
if (votesMindblowing) {
    console.log("MINDBLOWING FACT!!");
} else {
    console.log("Not so special...");
}
let votesFalse =  1;
const totalUpvotes = votesInteresting + votesMindblowing;

const message = totalUpvotes > votesFalse ? "The fact is true": "Might be false, check more sources...";

const text = "Lisbon is the capital of Portugal";
const upperText = text.toUpperCase();
console.log(upperText);

const str = `The current fact is "${text}". It is ${calcFactAge(2015)} years old. It is probably ${totalUpvotes > votesFalse ? "correct" : "not true"}.`;
console.log(str);
 */

const fact = ['Lisbon is the capital of Portugal', 2015, true];
console.log(fact)
console.log(fact[3]) //undefined
console.log(fact.length)
console.log(fact[fact.lenght - 1])

const [text, createdIn] = fact;


const NewFact = [...fact, "Society"]; //...fact unpacks the fact array.
console.log(NewFact);

const factObj = {
    text: 'Lisbon is the capital of Portugal',
    category: "society",
    createdIn: 2017,
    isCorrect: true,
    createSummary: function() {
        return `The fact ${this.text} is from the category ${this.category.toUpperCase()}`
    }
};
/*
console.log(factObj.text);
console.log(factObj.createSummary());
[2, 4, 6, 8].forEach(function(el) {
    console.log(el)
})
const time10 = [2, 4, 6, 8].map((el)=> el*10)
*/


const calcFactAge = (year) => new Date().getFullYear() >= year ? new Date().getFullYear() - year : `Impossible Year. Years needs to be less or equal to ${new Date().getFullYear()}`  
const factAges = initialFacts.map((el) => calcFactAge(el.createdIn));
console.log(`${factAges}`);
  