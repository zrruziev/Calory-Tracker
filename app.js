// UI Elements
const clearBtn = document.querySelector('.btn-clear'),
      meal = document.querySelector('#meal'),
      calory = document.querySelector('#calory'),
      listItem = document.querySelector('.added-meals ul'),
      addBtn = document.querySelector('#addBtn'),
      updateBtn = document.querySelector('.btn-update'),
      backBtn = document.querySelector('.btn-back'),
      editBtn = document.querySelector('.added-meals ul'),
      deleteBtn = document.querySelector('.added-meals ul'),
      total = document.querySelector('.content2 h2');

// Initial State
let myData = [],
    totalCalory = 0,
    i = 0;
updateBtn.style.display = 'none';
backBtn.style.display = 'none';

// Event Listeners
window.addEventListener('DOMContentLoaded', checkLocalStorage);
clearBtn.addEventListener('click', clearAll);
addBtn.addEventListener('click', addMeal);
editBtn.addEventListener('click', edit);
updateBtn.addEventListener('click', updateMealsInfo); 
deleteBtn.addEventListener('click', deleteItem);
backBtn.addEventListener('click', backState);

// Check Localstorage and Show it
function checkLocalStorage() {
  let items = localStorage.getItem('items');
  if(items) {
    items = JSON.parse(items);
    for(item of items) {
      listItem.innerHTML += `<li id="${item.id}">
                              <strong>${item.name}: </strong> 
                              <em>${item.mealCalory} kcal</em> 
                              <a href="#"><i class="update fas fa-pencil-alt"></i></a>
                              <a href="#"><i class="delete far fa-trash-alt"></i></a>
                            </li>`;
    myData.push(item);
    totalCalory += parseInt(item.mealCalory);
    }
    total.innerHTML = `Total Calories: ${totalCalory}`;
  } else {
    total.innerHTML = `Total Calories: 0`
  }
}

// Clear Button
function clearAll() {
  meal.value = '';
  calory.value = '';
  localStorage.clear();
  i = 0;
  myData = [];
  total.innerHTML = `Total Calories: 0`;
  listItem.innerHTML = '';
}

// Add Buttton
function addMeal() {
  let x = localStorage.getItem('items');
  if(x) {
    x = JSON.parse(x);
    if(meal.value !== '' && calory.value !== '') {
      let i = x[(x.length - 1)].id + 1,
          mealInfo = {id: i, name: meal.value, mealCalory: calory.value};
      x.push(mealInfo);
      myData = x;
      localStorage.setItem('items', JSON.stringify(myData))
      listItem.innerHTML += `<li id="${mealInfo.id}">
                              <strong>${mealInfo.name}: </strong> 
                              <em>${mealInfo.mealCalory} kcal</em> 
                              <a href="#"><i class="update fas fa-pencil-alt"></i></a>
                              <a href="#"><i class="delete far fa-trash-alt"></i></a>
                            </li>`;
      totalCalory = 0;
      myData.forEach((el) => {
        totalCalory += parseInt(el.mealCalory);
      })
      total.innerHTML = `Total Calories: ${totalCalory}`;
      meal.value = '';
      calory.value = '';
    } else {
      total.innerHTML = 'Please fill in all fields';
      total.style.color = 'red';
      setTimeout(function() {
        total.innerHTML = `Total Calories: ${totalCalory}`;
        total.style.color = 'black';
      }, 2000);
    }
  } else {
    if(meal.value !== '' && calory.value !== '') {
      i++;
      let mealInfo = {id: i, name: meal.value, mealCalory: calory.value};
      myData.push(mealInfo);
      localStorage.setItem('items', JSON.stringify(myData));
      listItem.innerHTML += `<li id="${mealInfo.id}">
                              <strong>${mealInfo.name}: </strong> 
                              <em>${mealInfo.mealCalory} kcal</em> 
                              <a href="#"><i class="update fas fa-pencil-alt"></i></a>
                              <a href="#"><i class="delete far fa-trash-alt"></i></a>
                            </li>`;
      totalCalory = 0;
      totalCalory += parseInt(mealInfo.mealCalory);
      total.innerHTML = `Total Calories: ${totalCalory}`;
      meal.value = '';
      calory.value = '';
    } else {
      total.innerHTML = 'Please fill in all fields';
      total.style.color = 'red';
      setTimeout(function() {
        total.innerHTML = `Total Calories: ${totalCalory}`;
        total.style.color = 'black';
      }, 2000);
    }
  }
}

// Helper Object for Edit State
let chosenElement = {};

// Edit State
function edit(e) {
  if(e.target.classList.contains('update')) {
    addBtn.disabled = true;
    addBtn.style.backgroundColor = 'rgb(170, 200, 255)';
    addBtn.style.cursor = 'not-allowed';
    updateBtn.style.display = 'inline';
    backBtn.style.display = 'inline';
    let listId = parseInt(e.target.parentElement.parentElement.getAttribute('id')),
        mealsName;
    chosenElement.id = listId;
    getJson = localStorage.getItem('items');
    if(getJson) {
      mealsNameArray = JSON.parse(getJson);
      chosenElement.mealsNameArray = mealsNameArray;
      mealsNameArray.forEach((obj) => {
        if(obj.id === listId) {
          mealsName = mealsNameArray[mealsNameArray.indexOf(obj)]; 
        }
      })
      meal.value = mealsName.name;
      calory.value = mealsName.mealCalory;
    }
  }
  e.preventDefault();
}

// Update Meals Info
function updateMealsInfo() {
  let newId = chosenElement.id,
      updatedInfo = {id: newId, name: meal.value, mealCalory: calory.value},
      allList = document.querySelectorAll('.added-meals ul li');
  allList.forEach(function(list) {
    if(parseInt(list.getAttribute('id')) === newId) {
      list.innerHTML = `<strong>${updatedInfo.name}: </strong> 
      <em>${updatedInfo.mealCalory} kcal</em> 
      <a href="#"><i class="update fas fa-pencil-alt"></i></a>
      <a href="#"><i class="delete far fa-trash-alt"></i></a>`;
    }
  });

  // Update LocalStorage Info
  let updatedIndex;
  mealsNameArray.forEach((obj) => {
    if(obj.id === newId) {
      updatedIndex = mealsNameArray.indexOf(obj); 
    }
  })
  myData.splice(updatedIndex, 1, updatedInfo);
  localStorage.setItem('items', JSON.stringify(myData));

  // Updated Total Calory
  let x = myData.length,
      updatedTotalCalory = 0;
  for(let i=0; i<x; i++) {
    updatedTotalCalory += parseInt(myData[i].mealCalory);
  }

  // Update UI
  total.innerHTML = `Total Calories: ${updatedTotalCalory}`;
  meal.value = '';
  calory.value = '';
  addBtn.disabled = false;
  addBtn.style.backgroundColor = 'rgb(5, 81, 223)';
  addBtn.style.cursor = 'pointer';
  updateBtn.style.display = 'none';
  backBtn.style.display = 'none';
}


// Delete Button
function deleteItem(e) {
  let elem = e.target.parentElement.parentElement;
  if(e.target.classList.contains('delete')) {
    elem.remove();
    let removeIndex = parseInt(e.target.parentElement.parentElement.getAttribute('id'));
    let elIndex;
    myData.forEach((el) => { 
      if(el.id === removeIndex) {
        elIndex = myData.indexOf(el);
      }
    })
    myData.splice(elIndex, 1);
    totalCalory = 0;
    myData.forEach((cal) => {
      totalCalory += parseInt(cal.mealCalory); 
    });
    total.innerHTML = `Total Calories: ${totalCalory}`;
    localStorage.setItem('items', JSON.stringify(myData));
    meal.value = '';
    calory.value = '';
    addBtn.disabled = false;
    addBtn.style.backgroundColor = 'rgb(5, 81, 223)';
    addBtn.style.cursor = 'pointer';
    updateBtn.style.display = 'none';
    backBtn.style.display = 'none';
  } 
    if(myData.length === 0) {
    localStorage.clear();
  }
}

// Back Button 
function backState() {
  meal.value = '';
  calory.value = '';
  addBtn.disabled = false;
  addBtn.style.backgroundColor = 'rgb(5, 81, 223)';
  addBtn.style.cursor = 'pointer';
  updateBtn.style.display = 'none';
  backBtn.style.display = 'none';
}
