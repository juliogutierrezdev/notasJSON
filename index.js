const titleInput = document.querySelector('.title-input');
const accordion = document.querySelector('.accordion');
const formContainer = document.querySelector('.form-container');
const form = document.querySelector('#form');
const textInput = document.querySelector('.text-input');
const list = document.querySelector('#list');
const pinnedList = document.querySelector('#pinned-list');
const changeThemeBtn = document.querySelector('#change-theme-btn');
const body = document.querySelector('body');

let notas = [];

const getListItemHtml = ({ title, description }) => { 
  // title y description son propiedades de la nota

  // Creo el html del li
  const listItemHtml = `
  <div class="card-text-container">
    <input class="card-title" type="text" readonly value="${title}">
    <textarea class="card-description" type="text" readonly>${description}</textarea>
  </div>
  <div class="card-btn-container">
    <button class="card-btn card-btn-delete">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>     
    </button>
    <button class="card-btn card-btn-pinned">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>          
    </button>
    <button class="card-btn card-btn-edit">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>               
    </button>
  </div>
  `;

  // Retorno el html para poder utilizarlo en mi formulario
  return listItemHtml;
}

const penSvg = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
</svg>
`;

const squarePencil = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
</svg>
`;

const setInputForEditing = (input) => {
  input.removeAttribute('readonly');
  input.classList.add('form-input');
  input.classList.remove('card-title', 'card-description');
};

const updateNotes = (notaAEditar, notaEditada) => {
  notas = notas.map(note => {
    if (note.id === notaAEditar.id) {
      return notaEditada;
    } else {
      return note;
    }
  });
}

const renderNotes = () => {
  list.innerHTML = '';
  pinnedList.innerHTML = '';
  // A partir del array de las notas, uso un bucle para acceder a cada nota.
  notas.forEach(note => { // note es el objeto o valor de cada nota
    // Creo el elemento li
    const listElement = document.createElement('li');
    listElement.id = note.id;

    // Añado la clase correspondiente
    listElement.classList.add('card-note');

    // Usando la funcion, obtengo el html del elemento
    listElement.innerHTML = getListItemHtml(note);

    // Agrego el elemento creado a la lista.

    if (note.pinned) {
      pinnedList.append(listElement);
    } else {
      list.append(listElement);
    }
  });
}

const listEventActions = (e) => {
  const deleteBtn = e.target.closest('.card-btn-delete');
  const editBtn = e.target.closest('.card-btn-edit');
  const pinBtn = e.target.closest('.card-btn-pinned');

  if (deleteBtn) {
    const li = deleteBtn.parentElement.parentElement;
    notas = notas.filter(note => note.id !== Number(li.id));
    localStorage.setItem('notes', JSON.stringify(notas));
    renderNotes();
  }

  if (editBtn) {
    const li = editBtn.parentElement.parentElement;
    const titleEditInput = li.children[0].children[0];
    const descEditInput = li.children[0].children[1];
    if (editBtn.classList.contains('editando')) {
      if (titleEditInput.value === '' || descEditInput.value === '') {
        alert('Los dos inputs son requeridos')
        return;
      }
      editBtn.classList.remove('editando');
      editBtn.innerHTML = squarePencil;
      const notaAEditar = notas.find(note => note.id === Number(li.id));
      const notaEditada = { 
        ...notaAEditar, 
        title: titleEditInput.value,
        description: descEditInput.value,
      };
      updateNotes(notaAEditar, notaEditada);
      localStorage.setItem('notes', JSON.stringify(notas));
      renderNotes();
    } else {
      editBtn.classList.add('editando');
      editBtn.innerHTML = penSvg;
      setInputForEditing(titleEditInput);
      setInputForEditing(descEditInput);
    }
  }

  if (pinBtn) {
    const li = pinBtn.parentElement.parentElement;
    const notaAEditar = notas.find(note => note.id === Number(li.id));
    const notaEditada = { ...notaAEditar, pinned: !notaAEditar.pinned};
    updateNotes(notaAEditar, notaEditada);
    localStorage.setItem('notes', JSON.stringify(notas));
    renderNotes();
  }
}

titleInput.addEventListener('click', e => {
  accordion.classList.add('show', 'show-container');
  formContainer.classList.add('show-gap');
});

form.addEventListener('submit', e => {
  // Prevent default, elimina el evento predefinido del submit
  e.preventDefault();

  if (textInput.value === '' || titleInput.value === '') {
    alert('Los dos inputs son requeridos')
    return;
  }

  // Creo un objeto con los valores de los inputs
  const newNote = {
    id: notas.length === 0 ? 0 : notas[notas.length - 1].id + 1,
    title: titleInput.value,
    description: textInput.value,
    pinned: false,
  }

  // Creo un nuevo array, agregando el objeto
  notas = notas.concat(newNote);

  // Guardo el array en local storage, en formato JSON
  localStorage.setItem('notes', JSON.stringify(notas));

  // Renderizo el html
  renderNotes();

  // Reinicio los valores de los inputs
  textInput.value = '';
  titleInput.value = '';

  // Cierro el formulario
  accordion.classList.remove('show', 'show-container');
  formContainer.classList.remove('show-gap');
});

list.addEventListener('click', listEventActions);
pinnedList.addEventListener('click', listEventActions);

changeThemeBtn.addEventListener('click', e => {
  const theme = body.getAttribute('data-theme');
  if (theme === 'light') {
    body.setAttribute('data-theme', 'dark');
    e.target.innerHTML = 'Claro';
    localStorage.setItem('theme', 'dark');
  } else {
    body.setAttribute('data-theme', 'light');
    e.target.innerHTML = 'Oscuro';
    localStorage.setItem('theme', 'light');
  }
});

const getNotes = () => {
  // Obtengo las notas en formato JSON
  const notasJSON = localStorage.getItem('notes');
  const theme = localStorage.getItem('theme');

  if (theme) {
    body.setAttribute('data-theme', theme);
  }

  // Creo un nuevo array con una condicion, si existe un array en localStorage, uso ese array, si no, creo un array vacio.
  notas = notasJSON ? JSON.parse(notasJSON) : [];

  renderNotes();
}

getNotes();