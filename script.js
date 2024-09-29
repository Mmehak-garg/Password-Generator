const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const  uppercaseCheck  = document.querySelector("#uppercase");
const  lowercaseCheck  = document.querySelector("#lowercase");
const  numbersCheck  = document.querySelector("#numbers");
const  symbolsCheck  = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");


let password = "";
let passwordLength = 10;
let checkCount  = 0;
const symbols = `!@#$%^&*()_+-=[]{};:\,<.>/?;~'/|"`;
console.log(symbols.length);

//set strength of  color circle grey

handleSlider();

// set password length
function handleSlider()
{
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =( (passwordLength - min)*100/(max-min))+ "% 100%"

}

// set Indicator
setIndicator("#CCC");

function setIndicator(color){
    //color set, and shadow set
    indicator.style.backgroundColor = color;
    // shadow    
}

function getRndInteger(min,max){
    return Math.floor(Math.random() *(max - min)) + min;
}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

// checking for strenght

function calcStrenght(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
   if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } 
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6)
    {
        setIndicator("#ff0");
    }
    else{
            setIndicator("#f00");
    }

}

async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }

    // Make the copy message visible
    copyMsg.classList.add("active");

    // Remove the tooltip after 2 seconds
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}


function shufflePassword(array){
    // Fisher yates Method

    for(let i = array.length-1;i>0;i--)
    {
        const j = Math.floor(Math.random() * (i+1));
        // swapping
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    // converting to string 
    let str = "";
    array.forEach((el)=>(str+= el));
    return str;
}


inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    {
        copyContent();
    }
})

function handleCheckBoxChange()
{
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
        checkCount++;
    });
    //cornor case-'>
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox)=>
{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

generateBtn.addEventListener('click',() =>{
    // no check box seleted
    if(checkCount <= 0) return;

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
    // let's start the jounery to find new password

    // remove old pass
    password = "";

   /*if(uppercaseCheck.checked) {
        password += generateUppercase();
    }
    if(lowercaseCheck.checked) {
        password += generatelowercase();
    }
    if(numbersCheck.checked) {
        password += generatenumcase();
    }
    if(symbolsCheck.checked) {
        password += generateUppercase();
    }*/

    let funcArr= [];
    if(uppercaseCheck.checked) {
         funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked) {
        funcArr.push(generateLowercase);
    }
    if(numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }

    // compulaory addition
    for(let i =0; i<funcArr.length;i++)
    {
        password += funcArr[i]();
    }

    // remaining addition
    for(let i =0; i<passwordLength-funcArr.length;i++)
    {
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }
    // shuffle the password
    password = shufflePassword(Array.from(password));
    
    // show in UI
    passwordDisplay.value = password;
    
    //check strength
    calcStrenght();
})
