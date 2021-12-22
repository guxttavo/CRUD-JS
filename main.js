'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
  clearFields()
  document.getElementById('modal').classList.remove('active')
}

//? CRUD - DELETE
const deleteClient = index => {
  const dbClient = readClient()
  dbClient.splice(index, 1)
  setLocalStorage(dbClient)
}

//? CRUD - UPDATE
const updateClient = (index, client) => {
  const dbClient = readClient()
  dbClient[index] = client
  setLocalStorage(dbClient)
}

//? CRUD - READ
const readClient = () => getLocalStorage()

//? CRUD - CREATE
const createClient = client => {
  // this function will receve the client and save at local storage
  const dbClient = getLocalStorage()
  //push is a method to add a element in one array, in this case is adding the parameter client
  dbClient.push(client)
  setLocalStorage(dbClient)
}

//catch what already exists at the database, then transform in json(json.parse), after this storage at db-Client
const getLocalStorage = () =>
  JSON.parse(localStorage.getItem('db_client')) ?? []

//local storage needs a parameter key - value
//the browser doesn't accept a object, he just accept string, so it's necessery transform my object in one string using JSON.stringify
const setLocalStorage = dbClient =>
  localStorage.setItem('db_client', JSON.stringify(dbClient))

const isValidFields = () => {
  //this function return true if all the fields are filled in
  return document.getElementById('form').reportValidity()
}

const clearFields = () => {
  const fields = document.querySelectorAll('.modal-field')
  fields.forEach(field => (field.value = ''))
}

//* INTERACTION WITH LAYOUT
const saveClient = () => {
  if (isValidFields()) {
    const client = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      city: document.getElementById('city').value
    }
    const index = document.getElementById('name').dataset.index
    if (index == 'new') {
      createClient(client)
      updateTable()
      closeModal()
    } else {
      updateClient(index, client)
      updateTable()
      closeModal()
    }
  }
}

const createRow = (client, index) => {
  //create a empty table's row
  const newRow = document.createElement('tr')
  //fill in with the td's
  newRow.innerHTML = `
        <td>${client.name}</td>
        <td>${client.email}</td>
        <td>${client.phone}</td>
        <td>${client.city}</td>
        <td>
          <button type="button" class="button green" id="edit-${index}">Editar</button>
          <button type="button" class="button red" id="delete${index}">Excluir</button>
        </td>
  `
  //insert at tbody
  document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
  const rows = document.querySelectorAll('#tableClient>tbody tr')
  //will catch the father of the row
  rows.forEach(row => row.parentNode.removeChild(row))
}

const fillFields = client => {
  document.getElementById('name').value = client.name
  document.getElementById('email').value = client.email
  document.getElementById('phone').value = client.phone
  document.getElementById('city').value = client.city
  document.getElementById('name').dataset.index = client.index
}

const editClient = index => {
  const client = readClient()[index]
  client.index = index
  fillFields(client)
  openModal()
}

const editDelete = event => {
  if (event.target.type == 'button') {
    const [action, index] = event.target.id.split('-')

    if (action == 'edit') {
      editClient(index)
    } else {
      const client = readClient()[index]
      const response = confirm(`Do you really want to delete the client?`)
      if (response) {
        deleteClient(index)
        updateTable()
      }
    }
  }
}

//read data from local storage and filled in at the form
const updateTable = () => {
  const dbClient = readClient()
  clearTable()
  //forEach is sending three informacions for createRow, the element, index
  dbClient.forEach(createRow)
}

//* EVENTS
document.getElementById('registerClient').addEventListener('click', openModal)

document.getElementById('modalClose').addEventListener('click', closeModal)

document.getElementById('save').addEventListener('click', saveClient)

document
  .querySelector('#tableClient>tbody')
  .addEventListener('click', editDelete)
