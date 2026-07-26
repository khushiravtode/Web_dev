const display = document.querySelector(".display");
const history = document.querySelector(".history");
const buttons = document.querySelectorAll(".buttons");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        console.log(button.innerText);
    });
});
buttons.forEach(button => {
    button.addEventListener("click", () => {
        display.innerText = button.innerText;
    });
});