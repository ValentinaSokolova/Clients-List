//сервер
async function loadClientsList() { //загрузка списка контактов
    const response = await fetch('http://localhost:3000/api/clients');
    const data = await response.json();
    return data;
};

async function createClientItem(name, surname, lastName,contacts) { //добавление клиента в api
    const response = await fetch ('http://localhost:3000/api/clients', { 
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: name,
            surname: surname,
            lastName: lastName,
            contacts: contacts
        }),
    });
    const data = await response.json();
    return data;
};

async function deleteClientItem(id) { //удаление клиента из api
    const response = await fetch(`http://localhost:3000/api/clients/${id}`,  { 
        method: 'DELETE',
    });
    const data = await response.json();
    return data;
}

async function changeClientItem(id, name, surname, lastName, contacts) { //изменение клиента в api
    const response = await fetch(`http://localhost:3000/api/clients/${id}`,  {
        method: 'PATCH',
        body: JSON.stringify({
            name: name,
            surname: surname,
            lastName: lastName,
            contacts: contacts
        })
    });
    const data = await response.json();
    return data;
}

//перенос массива api в локальный массив для отрисовки списка
const clientsList = [];
async function addItemList() {
    const response = await fetch('http://localhost:3000/api/clients');
    const data = await response.json();
    data.forEach(dataItem => {
        getClientItem(dataItem);
        clientsList.push(dataItem);
    });
    return data;
};
addItemList();

//создание функции отрисовки одного клиента
function getClientItem(clientObj) {
    const tr = document.createElement('tr');
    const tbody = document.getElementById('tbody');
    tbody.append(tr);

    let number = () => { //создание id колонки
        const td = document.createElement('td');
        tr.append(td);
        td.setAttribute('id', 'tnumber');
        td.classList.add('tnumber');
        const numberClient = clientObj.id;
        td.textContent = (numberClient);
    };
    number();

    let name = () => { //создание колонки с именем
        const td = document.createElement('td');
        tr.append(td);
        if (clientObj.lastName) {
            let fullName = (`${clientObj.surname} ${clientObj.name} ${clientObj.lastName}`);
            td.textContent = (fullName);
        } else  {
            let fullName = (`${clientObj.surname} ${clientObj.name}`);
            td.textContent = (fullName);
        };
    };
    name();

    let createColumnDate = (date) => {
        const td = document.createElement('td');
        tr.append(td);
        tr.classList.add('table-row');
        let year = Number(new Date(date).getFullYear());
        let month = Number(new Date(date).getMonth());
        let day = Number(new Date(date).getDate());
        let hours = Number(new Date(date).getHours());
        let minutes = Number(new Date(date).getMinutes());
        const span = document.createElement('span');
        span.classList.add('time-descr');
        newTime = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : "") +minutes;
        span.textContent = (newTime);
        const month1 = month+1;   
        newdate = (day < 10 ? '0' : '') + day + '.' 
          + (month1 < 10 ? '0' : '') + month1 + '.' 
          + year;
        td.textContent = (`${newdate}  `);
        td.append(span);
    }

    createColumnDate(clientObj.createdAt);
    createColumnDate(clientObj.updatedAt);


    let contacts = () => { //создание колонки с контактами
        const td = document.createElement('td');
        td.classList.add('tcontacts');
        tr.append(td);
        let contactsList = clientObj.contacts;
        if (clientObj.contacts) {
            const ul = document.createElement('ul');
            ul.classList.add('list-reset');
            td.append(ul);
            for (let i = 0; i < contactsList.length; i++) {
                let createContactItem = (typeOfContact) => {
                    const li = document.createElement('li');
                    li.classList.add('list-item' );
                    li.setAttribute('id',`${i+1}-item`);
                    const span = document.createElement('span');
                    span.classList.add('contact-descr');
                    span.textContent = (`${contactsList[i].type}:${contactsList[i].value}`);
                    li.append(span);
                    ul.append(li);
                    li.classList.add(typeOfContact);
                }
                if (contactsList[i].type === 'Телефон') {
                    createContactItem('phone-contact');
                } else if(contactsList[i].type === 'Доп. телефон') {
                    createContactItem('phone-contact');
                } else if (contactsList[i].type === 'Vk') {
                    createContactItem('vk-contact');
                } else if (contactsList[i].type === 'Facebook') {
                    createContactItem('facebook-contact');
                } else if (contactsList[i].type === 'Email') {
                    createContactItem('email-contact');
                }
            }
        } else {
            td.classList.add('empty-contacts');
        };
        if (contactsList.length > 4) {
            for (let i=5; i <=contactsList.length; i++){
                const unvisibItem = document.getElementById(`${i}-item`);
                unvisibItem.style.display = 'none';
            }
            const visibBut = document.createElement('button');
            visibBut.classList.add('hiding-btn', 'btn-reset')
            visibBut.textContent =(`+${contactsList.length -4}`)
            td.append(visibBut);
            visibBut.onclick = () => {
                for (let i=5; i <=contactsList.length; i++){
                    const visibItem = document.getElementById(`${i}-item`);
                    visibItem.style.display = 'flex';
                }
                visibBut.style.display = 'none';
            };
        }
    }; contacts();

    let actions = () => {
        const td = document.createElement('td');
        tr.append(td);
        td.classList.add('tactions');
        const div = document.createElement('div');
        td.append(div);
        div.classList.add('flex', 'actions-contain')
        let btnChange = () => {
            const button = document.createElement('button');
            div.append(button);
            button.classList.add('btn-change', 'btn-reset');
            button.textContent = 'Изменить';
            button.onclick = () => {
                const modal = document.getElementById('modal-change');
                modal.style.display = 'block';
                const spanId = document.getElementById('change-id');
                spanId.innerHTML=(`ID: ${clientObj.id}`);
                const surname = document.getElementById('surname');
                surname.value=(`${clientObj.surname}`);
                const name = document.getElementById('name');
                name.value=(`${clientObj.name}`);
                const lastName = document.getElementById('lastName');
                if (lastName) {
                    lastName.value=(`${clientObj.lastName}`);
                }
                let index = 0;
                addContactsList();
                function createContact() {
                    index ++;
                    const div = document.createElement('div');
                    div.setAttribute('id',`contact-block-${index}`);
                    div.classList.add('contact-block');
                    const select = document.createElement('select');
                    select.setAttribute('id',`modal-change-select`);
                    select.classList.add('modal-change-select', 'modal-select');
                    const input = document.createElement('input');
                    input.setAttribute('name','contact-details');
                    input.setAttribute('type', 'text');
                    input.required=true;
                    input.setAttribute('id',`contact-details`);
                    input.classList.add('contact-details');
                    input.setAttribute('placeholder','Введите данные контакта');
                    const button = document.createElement('button');
                    button.setAttribute('type','button');
                    button.classList.add('modal-change-delete-contact',"btn-reset");
                    button.onclick = () => {
                        div.remove();
                        index--;
                    };
                    if (index == 11) {
                        const buttonAdd = document.getElementById('add-contact-button');
                        buttonAdd.disabled = true;
                    }
                    const contactArr = ['Телефон', 'Доп. телефон','Email','Vk','Facebook'];
                    for (let i = 0; i<contactArr.length; i++) {
                        const option = document.createElement('option');
                        option.setAttribute('value', contactArr[i]);
                        option.textContent = (contactArr[i]);
                        select.append(option);
                    };
                    div.append(select);
                    div.append(input);
                    div.append(button);
                    const containContacts = document.getElementById('contact-input');
                    containContacts.classList.add('contact-input')
                    containContacts.append(div);
                    return index;
                };
                function addContactsList() {
                    document.getElementById('contact-input').innerHTML = '';
                    if (clientObj.contacts) {
                        for (let i=0; i< clientObj.contacts.length; i++){
                            createContact(); 
                            const contactBlock = document.getElementById(`contact-block-${i+1}`);
                            const contactBlockSelect = contactBlock.querySelector('#modal-change-select');
                            const contactBlockInput = contactBlock.querySelector('#contact-details');
                            contactBlockSelect.value = clientObj.contacts[i].type;
                            contactBlockInput.value = clientObj.contacts[i].value;
                        }
                    }
                }

                const addContact = document.getElementById('add-contact-btn');
                addContact.onclick =  () => {
                    createContact();
                };
                const contacts = [];
                const saveBtn = document.getElementById('save-changes-btn');
                saveBtn.onclick = (e) => {
                    e.preventDefault();
                    for (let i=1; i<index+1; i++) {
                        const contactBlock = document.getElementById(`contact-block-${i}`);
                        if (contactBlock) {
                            const contactBlockSelect = contactBlock.querySelector('#modal-change-select');
                            const contactBlockInput = contactBlock.querySelector('#contact-details');
                            contacts.push({'type': contactBlockSelect.value, 'value': contactBlockInput.value});
                        }
                    }
                    changeClientItem(clientObj.id,name.value,surname.value,lastName.value,contacts);
                    function messageError(text) {
                        const div = document.createElement('div');
                        const p = document.createElement('p');
                        p.textContent = text;
                        div.append(p);
                        document.querySelector('add-form').insertBefore(div,document.getElementById('save-add-btn'));
                    }
                    if (changeClientItem == 422) {
                        messageError("Некорректно заполнены данные");
                    } else if (changeClientItem == 404) {
                       messageError('Клиент не найден'); 
                    } else if (changeClientItem == 500) {
                        messageError('Что-то пошло не так...')
                    }
                    modal.style.display = "none";
                    index = 0;
                    location.reload();
                };
                const deleteClient = document.getElementById('delete-changes-btn');
                deleteClient.onclick = () => {
                    deleteClientItem(clientObj.id);
                    location.reload();
                };
                const close = document.getElementById('change-close');
                close.onclick = function() {
                    modal.style.display = "none";
                };
                window.onclick = function(event) {
                    if (event.target == modal) {
                      modal.style.display = "none";
                    }
                };
            };

        }; btnChange();
        let btnDelete = () => {
            const button = document.createElement('button');
            div.append(button);
            button.classList.add('btn-delete', 'btn-reset');
            button.textContent = 'Удалить';
            button.onclick = () => {  
                const modal = document.getElementById('modal-delete');
                modal.style.display = 'block';
                const deleteBtn = document.getElementById('delete-client-btn');
                deleteBtn.onclick = () => {
                    modal.style.display = 'none';
                    deleteClientItem(clientObj.id);
                    location.reload()
                };
                const cancelBtn = document.getElementById('cancel-btn');
                cancelBtn.onclick = () => {
                    modal.style.display = 'none';
                };
                const close = document.getElementById('close-delete-modal');
                close.onclick = () => {
                    modal.style.display = "none";
                };
                window.onclick = (event) => {
                    if (event.target == modal) {
                      modal.style.display = "none";
                    }
                };
            };
        }; btnDelete();
    }; actions();
}




//кнопка добавить клиента
const addBtn = document.getElementById('add-client-btn');
addBtn.onclick = () => {
    const modal = document.getElementById('modal-add');
    modal.style.display = 'block';
    const addContactBtn = document.getElementById('modal-add-contact-btn');
    let index = 0;
    addContactBtn.onclick = () => {
        index ++;
        const div = document.createElement('div');
        div.setAttribute('id',`add-contact-block-${index}`);
        div.classList.add('contact-block')
        const select = document.createElement('select');
        select.setAttribute('id',`modal-add-select`);
        select.classList.add('modal-add-select','modal-select')
        const input = document.createElement('input');
        input.setAttribute('name','contact-details');
        input.setAttribute('type', 'text');
        input.required = true;
        input.setAttribute('id',`add-contact-details`);
        input.classList.add('contact-details');
        input.setAttribute('placeholder','Введите данные контакта');
        const button = document.createElement('button');
        button.setAttribute('type','button');
        button.classList.add('modal-change-delete-contact');
        button.onclick = () => {            
            div.remove();
            index--;
        };
        if (index == 11) {
            const buttonAdd = document.getElementById('add-contact-button');
            buttonAdd.disabled = true;
        }
        const contactArr = ['Телефон', 'Доп. телефон','Email','Vk','Facebook'];
        for (let i=0; i<contactArr.length; i++) {
            const option = document.createElement('option');
            option.setAttribute('value', contactArr[i]);
            option.textContent = (contactArr[i]);
            select.append(option);
        };
        div.append(select);
        div.append(input);
        div.append(button);
        const containContacts = document.getElementById('add-contact-input');
        containContacts.classList.add('contact-input');
        containContacts.append(div);

        return index;
    };
    const saveNewContact = document.getElementById('save-add-btn');
    saveNewContact.onclick = (evt) => {
        evt.preventDefault();
        const name = document.getElementById('add-name');
        const surname = document.getElementById('add-surname');
        const lastName = document.getElementById('add-lastName');
        contacts =[];
        for (let i=1; i<index+1; i++) {
            const contactBlock = document.getElementById(`add-contact-block-${i}`);
            if (contactBlock) {
                const contactBlockSelect = contactBlock.querySelector('#modal-add-select');
                const contactBlockInput = contactBlock.querySelector('#add-contact-details');
                contacts.push({'type': contactBlockSelect.value, 'value': contactBlockInput.value});
            };
        };
        createClientItem(name.value, surname.value, lastName.value,contacts);
        index =0;
        modal.style.display = 'none';
        location.reload();
    };
    const close = document.getElementById('add-close');
    close.onclick = () => {
        modal.style.display = "none";
    };
    const cancel = document.getElementById('cancel-add-btn');
    cancel.onclick = () => {
        modal.style.display = "none";
        location.reload();
    };
    window.onclick = (event) => {
        if (event.target == modal) {
          modal.style.display = "none";
          location.reload();
        }
    };
};

//инпут в шапке страницы
const searchInput = document.getElementById('header-input');
searchInput.addEventListener('input', (evt) => {
    evt.preventDefault();
    setTimeout( () => {
        const query = searchInput.value;
        var clientsListInterim = [];
        clientsList.forEach(clientObj => {
            if (clientObj.name.includes(query) || clientObj.surname.includes(query) || clientObj.lastName.includes(query) || clientObj.id.includes(query) || clientObj.contacts.includes(query)) {
                clientsListInterim.push(clientObj);
            }

        });
        const tbody = document.getElementById('tbody');
        tbody.innerHTML = '';
        renderClientsTable(clientsListInterim);
    }
    ,3000);
});

//сортировка
//сортировка фио
let nameSortUp = (clientsArr) => { //сортировка по фио по возрастанию
    let clientsFilt = clientsArr.slice();
    for (let i = 0; i < clientsFilt.length; i++) {
        clientsFilt[i].fullName = clientsFilt[i].surname + clientsFilt[i].name + clientsFilt[i].lastName;
    }
    const key = 'fullName';
    clientsFilt.sort((user1, user2) => user1[key] > user2[key] ? 1 : -1);
    return clientsFilt;
};
let nameSortDown = (clientsArr) => { //сортировка по фио по убыванию
    let clientsFilt = clientsArr.slice();
    for (let i = 0; i < clientsFilt.length; i++) {
        clientsFilt[i].fullName = clientsFilt[i].surname + clientsFilt[i].name + clientsFilt[i].lastName;
    }
    const key = 'fullName';
    clientsFilt.sort((user1, user2) => user1[key] < user2[key] ? 1 : -1);
    return clientsFilt;
};
const nameHeader = document.getElementById('name-btn');
let indexName = 0;
const inactiveHeader = (header) => {
    header.classList.remove('sort-down','sort-up');
    header.classList.add('unsorted');
}
nameHeader.onclick = () => {
    document.getElementById('tbody').innerHTML = '';
    if (indexName % 2 == 1 ) {
        renderClientsTable(nameSortUp(clientsList));
        indexName++;
        nameHeader.classList.remove('unsorted','sort-up');
        nameHeader.classList.add('sort-down');
        inactiveHeader(createdHeader);
        inactiveHeader(updatedHeader);
        inactiveHeader(idHeader);
    } else {
        renderClientsTable(nameSortDown(clientsList));
        indexName++;
        nameHeader.classList.remove('unsorted','sort-down');
        nameHeader.classList.add('sort-up');
        inactiveHeader(createdHeader);
        inactiveHeader(updatedHeader);
        inactiveHeader(idHeader);
    }
};

//сортировка по id
let idSortUp = (clientsArr) => {
    let clientsFilt = clientsArr.slice();
    const key = 'id';
    clientsFilt.sort((user1, user2) => user1[key] > user2[key] ? 1 : -1);
    return clientsFilt;
};
let idSortDown = (clientsArr) => {
    let clientsFilt = clientsArr.slice();
    const key = 'id';
    clientsFilt.sort((user1, user2) => user1[key] < user2[key] ? 1 : -1);
    return clientsFilt;
}
const idHeader = document.getElementById('id-btn');
let indexId = 0;
idHeader.onclick = () => {
    document.getElementById('tbody').innerHTML = '';
    if (indexId % 2 == 1 ) {
        renderClientsTable(idSortUp(clientsList));
        indexId++;
        idHeader.classList.remove('unsorted','sort-up');
        idHeader.classList.add('sort-down');
        inactiveHeader(nameHeader);
        inactiveHeader(createdHeader);
        inactiveHeader(updatedHeader);
    } else {
        renderClientsTable(idSortDown(clientsList));
        indexId++;
        idHeader.classList.remove('unsorted','sort-down');
        idHeader.classList.add('sort-up');
        inactiveHeader(nameHeader);
        inactiveHeader(createdHeader);
        inactiveHeader(updatedHeader);
    }
};
//сортировка по созданию
let createdSortUp = (clientsArr) => {
    let clientsFilt = clientsArr.slice();
    const key = 'createdAt';
    clientsFilt.sort((user1, user2) => user1[key] > user2[key] ? 1 : -1);
    return clientsFilt;
};
let createdSortDown = (clientsArr) => {
    let clientsFilt = clientsArr.slice();
    const key = 'createdAt';
    clientsFilt.sort((user1, user2) => user1[key] < user2[key] ? 1 : -1);
    return clientsFilt;
};
const createdHeader = document.getElementById('createDate-btn');
let indexCreated = 0;
createdHeader.onclick = () => {
    document.getElementById('tbody').innerHTML = '';
    if (indexCreated % 2 == 1 ) {
        renderClientsTable(createdSortUp(clientsList));
        indexCreated++;
        createdHeader.classList.remove('unsorted','sort-up');
        createdHeader.classList.add('sort-down');
        inactiveHeader(updatedHeader);
        inactiveHeader(nameHeader);
        inactiveHeader(idHeader);
    } else {
        renderClientsTable(createdSortDown(clientsList));
        indexCreated++;
        createdHeader.classList.remove('unsorted','sort-down');
        createdHeader.classList.add('sort-up');
        inactiveHeader(updatedHeader);
        inactiveHeader(nameHeader);
        inactiveHeader(idHeader);
    }
};

//сортировка по изменениям
let updatedSortUp = (clientsArr) => {
    let clientsFilt = clientsArr.slice();
    const key = 'updatedAt';
    clientsFilt.sort((user1, user2) => user1[key] > user2[key] ? 1 : -1);
    return clientsFilt;
};
let updatedSortDown = (clientsArr) => {
    let clientsFilt = clientsArr.slice();
    const key = 'updatedAt';
    clientsFilt.sort((user1, user2) => user1[key] < user2[key] ? 1 : -1);
    return clientsFilt;
};
const updatedHeader = document.getElementById('lastChanges-btn');
let indexUpdated = 0;
updatedHeader.onclick = () => {
    document.getElementById('tbody').innerHTML = '';
    if (indexUpdated % 2 == 1 ) {
        renderClientsTable(updatedSortUp(clientsList));
        indexUpdated++;
        updatedHeader.classList.remove('unsorted','sort-up');
        updatedHeader.classList.add('sort-down');
        inactiveHeader(nameHeader);
        inactiveHeader(idHeader);
        inactiveHeader(createdHeader);
    } else {
        renderClientsTable(updatedSortDown(clientsList));
        indexUpdated++;
        updatedHeader.classList.remove('unsorted', 'sort-down');
        updatedHeader.classList.add('sort-up');
        inactiveHeader(nameHeader);
        inactiveHeader(idHeader);
        inactiveHeader(createdHeader);
    }
};


function renderClientsTable(clientsArr) { //функция отрисовки всех клиентов
    idSortUp(clientsArr);
    for (let i = 0; i < clientsArr.length; i++) {
        getClientItem(clientsArr[i]);
    }

}
renderClientsTable(clientsList);