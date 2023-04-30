let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click", (e) => {
  //-------------prevent form from being submitted
  e.preventDefault();

  //   console.log(e.target.parentElement);
  let form = e.target.parentElement;
  let toDoText = form.children[0].value;
  let toDoMonth = form.children[1].value;
  let toDoDate = form.children[2].value;
  //   console.log(toDoText, toDoMonth, toDoDate);

  if (toDoText === "") {
    alert("please Enter something");
    return;
  }

  //----------create todo thing into section
  let todo = document.createElement("div");
  todo.classList.add("todo");
  let text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = toDoText;

  let time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = toDoMonth + " / " + toDoDate;

  todo.append(text);
  todo.append(time);
  // ----------create green check and trash can icon
  let completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<i class="fa-solid fa-square-check"></i>';
  completeButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
  });

  let trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
  trashButton.addEventListener("click", (e) => {
    // console.log(e.target);
    let todoItem = e.target.parentElement;

    todoItem.addEventListener("animationend", () => {
      //--------also remove from local storage ----------
      let text = todoItem.children[0].innerText;
      let mylistArray = JSON.parse(localStorage.getItem("list"));
      mylistArray.forEach((item, index) => {
        if (item.todoText == text) {
          mylistArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(mylistArray));
        }
      });
      //remove from local storage then remove from windows
      todoItem.remove(); //remove after animation
    });
    todoItem.style.animation = "scaleDown 0.3s forwards";
    //
  });

  todo.append(completeButton);
  todo.append(trashButton);

  todo.style.animation = "scaleup 0.3s forwards";

  //create an object
  let myToDo = {
    todoText: toDoText,
    todoMonth: toDoMonth,
    todoDate: toDoDate,
  };
  //store data into an array of objects
  let mylist = localStorage.getItem("list");
  console.log(mylist);
  if (mylist == null) {
    localStorage.setItem("list", JSON.stringify([myToDo]));
  } else {
    let mylistArray = JSON.parse(mylist);
    mylistArray.push(myToDo);
    localStorage.setItem("list", JSON.stringify(mylistArray));
  }
  console.log(JSON.parse(localStorage.getItem("list")));

  form.children[0].value = ""; //clear the text input
  section.append(todo);
});

loadData();

function loadData() {
  //-------------getItem from local Storage--------------
  let mylist = localStorage.getItem("list");
  if (mylist !== null) {
    let mylistArray = JSON.parse(mylist);
    console.log(mylist);
    mylistArray.forEach((item) => {
      //find item.todoText & item.todoMonth & item.todoDate
      //create a todo
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = item.todoText; 
      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerText = item.todoMonth + " / " + item.todoDate; //
      todo.append(text);
      todo.append(time);

      // ------------------------------------------------
      // ----------create green check and trash can icon
      let completeButton = document.createElement("button"); //complete button
      completeButton.classList.add("complete");
      completeButton.innerHTML = '<i class="fa-solid fa-square-check"></i>';
      completeButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
      });
      let trashButton = document.createElement("button"); //trash button
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      trashButton.addEventListener("click", (e) => {
        // console.log(e.target);
        let todoItem = e.target.parentElement;

        todoItem.addEventListener("animationend", () => {
          //---------remove from local storage----------
          let text = todoItem.children[0].innerText;
          let mylistArray = JSON.parse(localStorage.getItem("list"));
          mylistArray.forEach((item, index) => {
            if (item.todoText == text) {
              mylistArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(mylistArray));
            }
          });
          //remove from local storage then remove from window
          todoItem.remove(); //remove after animation
        });
        todoItem.style.animation = "scaleDown 0.3s forwards";
        //
      });

      todo.append(completeButton);
      todo.append(trashButton);

      todo.style.animation = "scaleup 0.3s forwards";

      section.append(todo);
    });
  }
}

//-----------------sort by date-----------------------------
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

//-------------------remove from window and recreate again-----------
let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  // sort data
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));

  // remove data
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  // load data
  loadData();
});
