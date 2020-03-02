import i18nKeyValues from "./i18n.js";
const i18nElements = document.querySelectorAll('[data-i18n]');
const langSelector = document.getElementById("lang-selector");
const headerHome = document.getElementById("header-home");
const imgViewer = document.getElementById("img-viewer");
const imgViewerImg = imgViewer.children[1].children[0];
const sections = {
    "home" : document.getElementById("home"),
    "experience" : document.getElementById("experience"),
    "education" : document.getElementById("education"),
    "skills" : document.getElementById("skills"),
    "projects" : document.getElementById("projects"),
    "contact" : document.getElementById("contact")
};
const defaultLanguage = "en";
const languageList = {
    "en": "English",
    "es": "español",
    "fr": "français",
    "gl": "galego"
}
const switchSectionTime = 500;
const switchLanguageTime = 500;
const switchTabTime = 250;
const collapserTime = 250;

let changingPath = false;

document.body.setAttribute("style", `--switch-section-time: ${switchSectionTime}ms; --switch-language-time: ${switchLanguageTime}ms; --switch-tab-time: ${switchTabTime}ms; --collapser-time: ${collapserTime}ms`);

window.navigate = (path) => {
    let currentPath = document.body.classList[0];
    if(!changingPath){
        if(currentPath != path){
            changingPath = true;
            document.body.classList.remove("home", "experience", "education", "skills", "projects", "contact");
            if(path == "home"){
                headerHome.classList.add("home");
                sections[path].classList.remove("hide");
            }
            else{
                headerHome.classList.remove("home");
            }
            setTimeout(() => {
                if(currentPath != "home"){
                    sections[currentPath].classList.add("hide");
                }
                sections[path].classList.remove("hide");
                setTimeout(() => {
                    document.body.classList.add(path);
                    closeCollapsers(document);
                    changingPath = false;
                }, switchSectionTime);
            }, switchSectionTime);
        }
    }
}

const getTextForElement = (key, lang) => {
    let text = i18nKeyValues[key][lang];
    if(text == undefined){
        console.warn(`'${key}' text key doesn't have a translation for '${lang}' language`);
    }
    return text == undefined ? i18nKeyValues[key][defaultLanguage] : text;
}

const changeLang = (lang, option) => {
    if(!option.parentElement.classList.contains("selecting")){
        option.parentElement.classList.add("selecting");
    }
    else {
        for(let opt of langSelector.children){
            opt.classList.remove("selected");
        }
        option.parentElement.classList.remove("selecting");
        option.classList.add("selected");
        for(let el of i18nElements){
            el.innerHTML = getTextForElement(el.getAttribute("data-i18n"), lang);
        }
    }
};

window.closeLangSelector = () => {
    langSelector.classList.remove("selecting");
}

window.closeImgViewer = () => {
    imgViewer.classList.remove("open");
}

window.switchLight = () => {
    if(document.documentElement.classList.contains("light")){
        document.documentElement.classList.remove("light");
    }
    else {
        document.documentElement.classList.add("light");
    }
}

const startLangSelector = () => {
    for(let key in languageList){
        let option = document.createElement("div");
        langSelector.append(option);
        option.id = `opt-${key}`;
        option.onclick = () => changeLang(key, option);
        option.textContent = languageList[key];
    }
    let browserLanguage = navigator.language.split("-")[0];
    if(!(browserLanguage in languageList)){
        browserLanguage = defaultLanguage;
    }
    document.getElementById(`opt-${browserLanguage}`).classList.add("selected");
    for(let el of i18nElements){
        el.innerHTML = getTextForElement(el.getAttribute("data-i18n"), browserLanguage);
    }
}

const closeCollapsers = (parent) => {
    for(let col of parent.querySelectorAll(".collapser.rotate")){
        col.onclick();
    }
}

const startCollapsers = () => {
    for(let collapser of document.getElementsByClassName("collapser")){
        let collapsable = collapser.nextElementSibling;
        collapser.onclick = () => {
            if(collapsable.classList.contains("collapsed")){
                collapsable.classList.remove("collapsed");
                collapser.classList.add("rotate");
            }
            else {
                collapsable.classList.add("collapsed");
                collapser.classList.remove("rotate");
                closeCollapsers(collapsable);
            }
        }
        if(collapsable.classList.contains("collapsed")){
            collapser.classList.remove("rotate");
        }
        else {
            collapser.classList.add("rotate");
        }
        
    }
}

const startLangLevel = () => {
    for(let container of document.querySelectorAll("[data-lang-level]")){
        let quantity = parseInt(container.getAttribute("data-lang-level"));
        for(let i = 0; i < 6; i++){
            quantity--;
            let star = document.createElement("span");
            let type = quantity >= 0 ? "star" : "star-empty";
            star.classList.add(type);
            container.append(star);
        }
    }
}

const startGalleries = () => {
    for(let gallery of document.getElementsByClassName("gallery")){
        for(let img of gallery.children){
            img.onclick = () => {
                console.log(imgViewerImg, img);
                imgViewerImg.src = img.src;
                imgViewer.classList.add("open");
            }
        }
    }
}

startLangSelector();
startCollapsers();
startLangLevel();
startGalleries();