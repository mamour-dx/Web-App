import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

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

function Counter() {
  const [Counter, setCount]= useState(0)
  return (
  <div>
    <span style={{ fontSize:"40px" }}>8</span>
    <button className="btn btn-large" onClick={() => setCount((c)=> c+1)}>+1</button>
  </div>);
}

function App() {
  // defining state variable
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(
  function(){
    async function getFacts() {
    setIsLoading(true);

    let query = supabase.from("facts").select("*");
      
    if (currentCategory !== "all") {
      query = query.eq("category", currentCategory);
    }

    const { data: facts, error } = await query
      .order("votesInteresting", { ascending:false })
      .limit(600);
      

      if (!error) {
        setFacts(facts);
      }
      else alert("La base de donnée est n'est pas accessible.");
      setIsLoading(false);
  }
  getFacts();
}, [currentCategory]);

  return (
    <>
    <Header show={showForm} setShowForm={setShowForm}/>
      {showForm ? <NewFactForm setFacts={setFacts} />: null}
   
      <main className="main">
      <CategoryFilter setCurrentCategory = {setCurrentCategory} />
      {isLoading ?( <Loader /> ) : (<FactList facts={facts} setFacts={setFacts}/> )}
      </main>
      <Footer/>
    </>
  );
}

function Loader(){
  return <p className="loading-message">loading...</p>
}


function Header({showForm, setShowForm}) {
  const appTitle = "Today I learned";
  return (
    <header className="header">
        <div clasName="logo">
          <img
            src=" logo.png"
            height="68"
            width="68"
            alt="Today I Learned Logo"
          />
          <h1>{appTitle}</h1>
        </div>

        <button className="btn btn-large btn-open" 
        onClick={()=> setShowForm((show)=> !show)}
        >
          {showForm? "Close":"Share a fact"}          
          </button>
      </header>
  );
}

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({setFacts, setShowForm}) {
const [text, setText] = useState("");
const [source, setSource] = useState("");
const [category, setCategory] = useState("");
const [isUploading, setIsUploading] = useState(false);


async function handleSubmit(e) {
  // prevent browser from reloading
e.preventDefault();
// check if data is valid
if (text && isValidHttpUrl(source) && category && text.length <= 200) {
  setIsUploading(true);
  const { data: newFact, error} = await supabase.from("facts").insert([{text, source, category}]).select();
  setIsUploading(false);

// add the new fact to the UI: add the fact to the state
  if (!error) setFacts((facts)=> [newFact[0], ...facts]);
// reset input fields.
setText("");
setSource("")
setCategory("");
setShowForm(false);
}
}
return (
  <form className="fact-form" onSubmit={handleSubmit}>
  <input 
    type="text" 
    placeholder="Share a fact with the world..."
    value={text}
    onChange = {(e)=>setText(e.target.value)}/>
  
  <span>{200 - text.length}</span> 
  
  <input 
    type="text" 
    placeholder="Trustworthy source..." 
    value = {source}
    onChange={(e)=> setSource(e.target.value)}/>
  
  <select value={category}
      onChange={(el)=> setCategory(el.target.value)}>
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat)=> (<option 
        key = {cat.name}
        value={cat.name}>
          {cat.name.toUpperCase()}
        </option>))}
  </select>
  <button className="btn btn-large" disabled={isUploading}>Post</button>
</form>);
}

function CategoryFilter({ setCurrentCategory }) {
  return ( 
  <aside>
    <ul>
      <li className="category">
        <button className="btn btn-all-categories"
                onClick={() => setCurrentCategory("all")}>
          All</button>
      </li>
      {CATEGORIES.map((cat)=> (
        <li key={cat.name} className="category">
          <button 
          className="btn btn-category" 
          style= {{ backgroundColor: cat.color }}
          onClick={() => setCurrentCategory(cat.name)}
          >
            {cat.name}
          </button>
          </li>
      ))}
    </ul>
  </aside>
  );
}

function FactList({facts, setFacts}) {
  if (facts.length === 0) {
    return <p className="message">Il n'y a pas encore de faits dans cette catégorie. Crée le premier!📩</p>
  }
  return (
  <section className="facts-list">
    <ul>{
    facts.map((fact)=>
    (<Fact key={fact.id} fact={fact} setFacts={setFacts} />
  ))}
    </ul>
    <p className="length"> Il y'a actuellement {facts.length} faits dans cette catégorie. Ajoutes le tien!📩</p>
    </section>
    );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  async function handleVote(columnName) {
    setIsUpdating("true");
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({[columnName]: fact [columnName] + 1})
      .eq("id", fact.id)
      .select();
      
      setIsUpdating("false");
  
  if (!error) {
    setFacts((facts) =>
      facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
    );
  }
  else alert("Can't add vote, retry later.")
}

  return <li className="fact">
      <p>
        {fact.text}
        <a
          className="source"
          href={fact.source}
          target="_blank"
          >(Source)</a
        >
      </p>
      <span className="tag" style={{
        backgroundColor: CATEGORIES.find((cat)=> cat.name === fact.category).color,}}
        >{fact.category}
      </span>
      <div className="vote-buttons">
        <button onClick={()=> handleVote("votesInteresting")} disabled={isUpdating}>👍 {fact.votesInteresting}</button>
        <button onClick={()=> handleVote("votesMindblowing")} disabled={isUpdating}>🤯 {fact.votesMindblowing}</button>
        <button onClick={()=> handleVote("votesFalse")} disabled={isUpdating}>⛔️ 
        {fact.votesFalse}</button>
      </div>
    </li>
}
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="built-by">Built by Mamour DIENG ©</p>
        <div className="socials">
          
          <button className="icon"><a href="https://github.com/mamour-dx" target="_blank"><svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z"/></svg></a></button>
          
          <button className="icon">
            <a href="https://www.linkedin.com/in/mamour-dieng-394237261/" target="_blank">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.94048 4.99993C6.94011 5.81424 6.44608 6.54702 5.69134 6.85273C4.9366 7.15845 4.07187 6.97605 3.5049 6.39155C2.93793 5.80704 2.78195 4.93715 3.1105 4.19207C3.43906 3.44699 4.18654 2.9755 5.00048 2.99993C6.08155 3.03238 6.94097 3.91837 6.94048 4.99993ZM7.00048 8.47993H3.00048V20.9999H7.00048V8.47993ZM13.3205 8.47993H9.34048V20.9999H13.2805V14.4299C13.2805 10.7699 18.0505 10.4299 18.0505 14.4299V20.9999H22.0005V13.0699C22.0005 6.89993 14.9405 7.12993 13.2805 10.1599L13.3205 8.47993Z"/>
              </svg>
            </a>
          </button>
          
          <button className="icon"><a href="https://discord.gg/rVmF3ak9" target="_blank"><svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19.3034 5.33716C17.9344 4.71103 16.4805 4.2547 14.9629 4C14.7719 4.32899 14.5596 4.77471 14.411 5.12492C12.7969 4.89144 11.1944 4.89144 9.60255 5.12492C9.45397 4.77471 9.2311 4.32899 9.05068 4C7.52251 4.2547 6.06861 4.71103 4.70915 5.33716C1.96053 9.39111 1.21766 13.3495 1.5891 17.2549C3.41443 18.5815 5.17612 19.388 6.90701 19.9187C7.33151 19.3456 7.71356 18.73 8.04255 18.0827C7.41641 17.8492 6.82211 17.5627 6.24904 17.2231C6.39762 17.117 6.5462 17.0003 6.68416 16.8835C10.1438 18.4648 13.8911 18.4648 17.3082 16.8835C17.4568 17.0003 17.5948 17.117 17.7434 17.2231C17.1703 17.5627 16.576 17.8492 15.9499 18.0827C16.2789 18.73 16.6609 19.3456 17.0854 19.9187C18.8152 19.388 20.5875 18.5815 22.4033 17.2549C22.8596 12.7341 21.6806 8.80747 19.3034 5.33716ZM8.5201 14.8459C7.48007 14.8459 6.63107 13.9014 6.63107 12.7447C6.63107 11.5879 7.45884 10.6434 8.5201 10.6434C9.57071 10.6434 10.4303 11.5879 10.4091 12.7447C10.4091 13.9014 9.57071 14.8459 8.5201 14.8459ZM15.4936 14.8459C14.4535 14.8459 13.6034 13.9014 13.6034 12.7447C13.6034 11.5879 14.4323 10.6434 15.4936 10.6434C16.5442 10.6434 17.4038 11.5879 17.3825 12.7447C17.3825 13.9014 16.5548 14.8459 15.4936 14.8459Z"/></svg></a></button>
          
          <button className="icon"><a href="https://www.instagram.com/mxr.codes/" target="_blank"><svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.0281 2.00073C14.1535 2.00259 14.7238 2.00855 15.2166 2.02322L15.4107 2.02956C15.6349 2.03753 15.8561 2.04753 16.1228 2.06003C17.1869 2.1092 17.9128 2.27753 18.5503 2.52503C19.2094 2.7792 19.7661 3.12253 20.3219 3.67837C20.8769 4.2342 21.2203 4.79253 21.4753 5.45003C21.7219 6.0867 21.8903 6.81337 21.9403 7.87753C21.9522 8.1442 21.9618 8.3654 21.9697 8.58964L21.976 8.78373C21.9906 9.27647 21.9973 9.84686 21.9994 10.9723L22.0002 11.7179C22.0003 11.809 22.0003 11.903 22.0003 12L22.0002 12.2821L21.9996 13.0278C21.9977 14.1532 21.9918 14.7236 21.9771 15.2163L21.9707 15.4104C21.9628 15.6347 21.9528 15.8559 21.9403 16.1225C21.8911 17.1867 21.7219 17.9125 21.4753 18.55C21.2211 19.2092 20.8769 19.7659 20.3219 20.3217C19.7661 20.8767 19.2069 21.22 18.5503 21.475C17.9128 21.7217 17.1869 21.89 16.1228 21.94C15.8561 21.9519 15.6349 21.9616 15.4107 21.9694L15.2166 21.9757C14.7238 21.9904 14.1535 21.997 13.0281 21.9992L12.2824 22C12.1913 22 12.0973 22 12.0003 22L11.7182 22L10.9725 21.9993C9.8471 21.9975 9.27672 21.9915 8.78397 21.9768L8.58989 21.9705C8.36564 21.9625 8.14444 21.9525 7.87778 21.94C6.81361 21.8909 6.08861 21.7217 5.45028 21.475C4.79194 21.2209 4.23444 20.8767 3.67861 20.3217C3.12278 19.7659 2.78028 19.2067 2.52528 18.55C2.27778 17.9125 2.11028 17.1867 2.06028 16.1225C2.0484 15.8559 2.03871 15.6347 2.03086 15.4104L2.02457 15.2163C2.00994 14.7236 2.00327 14.1532 2.00111 13.0278L2.00098 10.9723C2.00284 9.84686 2.00879 9.27647 2.02346 8.78373L2.02981 8.58964C2.03778 8.3654 2.04778 8.1442 2.06028 7.87753C2.10944 6.81253 2.27778 6.08753 2.52528 5.45003C2.77944 4.7917 3.12278 4.2342 3.67861 3.67837C4.23444 3.12253 4.79278 2.78003 5.45028 2.52503C6.08778 2.27753 6.81278 2.11003 7.87778 2.06003C8.14444 2.04816 8.36564 2.03847 8.58989 2.03062L8.78397 2.02433C9.27672 2.00969 9.8471 2.00302 10.9725 2.00086L13.0281 2.00073ZM12.0003 7.00003C9.23738 7.00003 7.00028 9.23956 7.00028 12C7.00028 14.7629 9.23981 17 12.0003 17C14.7632 17 17.0003 14.7605 17.0003 12C17.0003 9.23713 14.7607 7.00003 12.0003 7.00003ZM12.0003 9.00003C13.6572 9.00003 15.0003 10.3427 15.0003 12C15.0003 13.6569 13.6576 15 12.0003 15C10.3434 15 9.00028 13.6574 9.00028 12C9.00028 10.3431 10.3429 9.00003 12.0003 9.00003ZM17.2503 5.50003C16.561 5.50003 16.0003 6.05994 16.0003 6.74918C16.0003 7.43843 16.5602 7.9992 17.2503 7.9992C17.9395 7.9992 18.5003 7.4393 18.5003 6.74918C18.5003 6.05994 17.9386 5.49917 17.2503 5.50003Z"/></svg></a></button>

          <button className="icon"><a href="https://www.tiktok.com/@mxr.codes" target="_blank"><svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16 8.24537V15.5C16 19.0899 13.0899 22 9.5 22C5.91015 22 3 19.0899 3 15.5C3 11.9101 5.91015 9 9.5 9C10.0163 9 10.5185 9.06019 11 9.17393V12.3368C10.5454 12.1208 10.0368 12 9.5 12C7.567 12 6 13.567 6 15.5C6 17.433 7.567 19 9.5 19C11.433 19 13 17.433 13 15.5V2H16C16 4.76142 18.2386 7 21 7V10C19.1081 10 17.3696 9.34328 16 8.24537Z"/></svg></a>
          </button>
        </div>
      </div>
    </footer>
  );
}
export default App;
