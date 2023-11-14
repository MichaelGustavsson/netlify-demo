/************************************************************/
// Shopping List Applikation...
/************************************************************/

(() => {
  // Hämta in referenser till våra element...
  const form = document.querySelector('#grocery-form');
  const input = document.querySelector('#grocery-input');
  const clearButton = document.querySelector('#clear-list');
  const filterInput = document.querySelector('#filter');
  const list = document.querySelector('#grocery-list');
  const saveButton = form.querySelector('button');

  let isInEditMode = false;

  const onDisplayGroceries = () => {
    const groceries = getFromStorage();
    groceries.forEach((item) => addGroceryToDom(item));
    updateUI();
  };

  const onSaveGrocery = (e) => {
    e.preventDefault();

    // Hämta värdet ifrån grocery-input textruta...
    const grocery = input.value;

    // Kontrollera att textrutan innehåller ett värde...
    if (grocery === '') {
      const errorMsg = createErrorMessage(
        'Du måste ange vilken vara som ska inhandlas!'
      );
      document.querySelector('.message-container').appendChild(errorMsg);
      setTimeout(() => {
        errorMsg.classList.add('show');
        setTimeout(() => {
          const msg = document.querySelector('#error-message');
          msg.classList.remove('show');
          msg.addEventListener('transitionend', () => msg.remove());
        }, 3000);
      }, 10);

      return;
    }

    if (isInEditMode) {
      const groceryToUpdate = list.querySelector('.edit-mode');
      removeFromStorage(groceryToUpdate.textContent);
      groceryToUpdate.classList.remove('.edit-mode');
      groceryToUpdate.remove();
      isInEditMode = false;
    } else {
      if (checkIfGroceryExists(grocery)) {
        const errorMsg = createErrorMessage(`${grocery} finns redan i listan`);
        document.querySelector('.message-container').appendChild(errorMsg);

        setTimeout(() => {
          errorMsg.classList.add('show');
          setTimeout(() => {
            const msg = document.querySelector('#error-message');
            msg.classList.remove('show');
            msg.addEventListener('transitionend', () => msg.remove());
          }, 3000);
        }, 10);
        return;
      }
    }

    // Lägga till varan till listan...
    addGroceryToDom(grocery);
    addToStorage(grocery);
    updateUI();
  };

  const addGroceryToDom = (grocery) => {
    const item = document.createElement('li');
    item.appendChild(document.createTextNode(grocery));
    item.appendChild(createIconButton('btn-remove text-red'));

    list.appendChild(item);

    console.log(item);
  };

  const addToStorage = (grocery) => {
    const groceries = getFromStorage();

    groceries.push(grocery);

    localStorage.setItem('groceries', JSON.stringify(groceries));
  };

  const getFromStorage = () => {
    let items;

    if (localStorage.getItem('groceries') === null) {
      items = [];
    } else {
      items = JSON.parse(localStorage.getItem('groceries'));
    }

    return items;
  };

  const removeFromStorage = (grocery) => {
    let groceries = getFromStorage();

    groceries = groceries.filter((item) => item !== grocery);
    console.log(groceries);
    localStorage.setItem('groceries', JSON.stringify(groceries));
  };

  const onClickGrocery = (e) => {
    if (e.target.parentElement.classList.contains('btn-remove')) {
      removeGrocery(e.target.parentElement.parentElement);
    } else {
      editGrocery(e.target);
    }
  };

  const checkIfGroceryExists = (grocery) => {
    const groceryFromStorage = getFromStorage();
    return groceryFromStorage.includes(grocery);
  };

  const editGrocery = (grocery) => {
    isInEditMode = true;

    list
      .querySelectorAll('li')
      .forEach((item) => item.classList.remove('edit-mode'));

    grocery.classList.add('edit-mode');
    saveButton.classList.add('btn-edit');
    saveButton.innerHTML = '<i class="fa-light fa-pen"></i> Uppdatera';
    input.value = grocery.textContent;
  };

  const onClearList = () => {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    localStorage.removeItem('groceries');
    // Tömmer localstorage på allt för denna ip-adress.
    // localStorage.clear();
    updateUI();
  };

  const onFilterGroceries = (e) => {
    const groceries = document.querySelectorAll('li');
    const value = e.target.value.toLowerCase();

    groceries.forEach((item) => {
      const itemName = item.firstChild.textContent.toLowerCase();
      if (itemName.indexOf(value) != -1) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  };

  const removeGrocery = (item) => {
    item.remove();
    removeFromStorage(item.textContent);
  };

  const createIconButton = (classes) => {
    const button = document.createElement('button');
    button.className = classes;
    button.appendChild(createIcon('fa-regular fa-trash-can'));
    return button;
  };

  const createIcon = (classes) => {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
  };

  const createErrorMessage = (text) => {
    const div = document.createElement('div');
    div.id = 'error-message';
    const textContent = document.createTextNode(text);
    div.classList.add('error-message');
    div.appendChild(textContent);
    return div;
  };

  const updateUI = () => {
    input.value = '';

    const groceries = document.querySelectorAll('li');

    if (groceries.length === 0) {
      clearButton.style.display = 'none';
      filterInput.style.display = 'none';
    } else {
      clearButton.style.display = 'block';
      filterInput.style.display = 'block';
    }

    saveButton.innerHTML = "<i class='fa-solid fa-plus'></i> Lägg till";
    saveButton.classList.remove('btn-edit');
    saveButton.classList.add('btn-primary');

    isInEditMode = false;
  };

  // Koppla händelser till elementen...
  form.addEventListener('submit', onSaveGrocery);
  clearButton.addEventListener('click', onClearList);
  list.addEventListener('click', onClickGrocery);
  filterInput.addEventListener('input', onFilterGroceries);
  document.addEventListener('DOMContentLoaded', onDisplayGroceries);
})();
