import { ID } from "./key.js";
const imagesList = document.querySelector(".images-list");
const errorMsg= document.querySelector(".error-msg");
let searchQuery = "random";
let pageIndex = 1;
const reload = document.querySelector('a')


// Fonction de recupération de données (Photos)
async function fetchData(){
  try{
    const response = await fetch(`https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${searchQuery}&client_id=${ID}`)

    if(!response.ok){
      throw new Error(`Erreur: ${response.status}`)
    }
    const data = await response.json()
    console.log(data);
    
    // Quand il n'y a pas de photo 
    if(!data.total){
      imagesList.textContent = "";
      throw new Error("Oups, nous n'avons rien de tel dans notre base de données... tentez un mot clé plus précis !")
    }
    createImages(data.results)

  }
  catch(error){
    errorMsg.textContent = `${error}`

  }
}
fetchData()

//Fonction de création des images réçues de l'API
function createImages(data){
  data.forEach(img => {
    const newImg = document.createElement("img")
    newImg.src = img.urls.regular;
    newImg.alt = img.alt_description
    imagesList.appendChild(newImg)
  });
}

const observer = new IntersectionObserver(handleIntersect, {rootMargin: "80%"});

observer.observe(document.querySelector(".infinite-marker"))
//Fonction de scroll quand le cursseur arrive a une certaine auteur de d'ecran
function handleIntersect(entries){
  console.log(entries)
  if(window.scrollY > window.innerHeight && entries[0].isIntersecting){
    pageIndex++
    fetchData()
  }
}

const input = document.querySelector("#search");
const form = document.querySelector("form");

form.addEventListener("submit", handleSearch)
function handleSearch(e){
  e.preventDefault()

  imagesList.textContent = "";
  if(!input.value){
    errorMsg.textContent = "L'objet de la recherche ne peut être vide."
    return;
  }
  errorMsg.textContent = "";
  searchQuery = input.value
  pageIndex = 1;
  fetchData()
}

const scrollToTop = document.querySelector(".scroll-to-top");
scrollToTop.addEventListener("click", handleTop)

function handleTop(){
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}
reload.addEventListener("click", handleReload)
function handleReload(){
  location.reload()
}