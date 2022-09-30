const modal = document.getElementById('modal');
const close = document.getElementById('close');
const background = document.getElementById('background');
const modalContenido = document.getElementById('modal-contenido');
const loader = document.getElementById('loader');
const home = document.getElementById('home');
const form = document.getElementById('form');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');
const btnCrear = document.getElementById('btn-crear');

const nombre = document.getElementById('nombre');
const email = document.getElementById('email');
const telefono = document.getElementById('telefono');
const web = document.getElementById('web');

const listadoUsuarios = document.getElementById('listado-usuarios');

const estado = {
    usuarios: null
};

function cargarFormulario(id) {
    nombre.value = '';
    email.value = '';
    telefono.value = '';
    web.value = '';

    if (id) {
        realizarPeticion(
            'get',
            `https://jsonplaceholder.typicode.com/users/${id}`,
            usuario => {
                nombre.value = usuario.name;
                email.value = usuario.email;
                telefono.value = usuario.phone;
                web.value = usuario.website;
            }
            , handleError
        );
    }
}

function mostrarOcultar() {
    const hash = location.hash.split('/');

    home.classList.remove('show');
    form.classList.remove('show');

    switch(hash[0]) {
        case '#home':
            realizarPeticion('get', 'https://jsonplaceholder.typicode.com/users', mostrarUsuarios, handleError);
            home.classList.add('show');
            break;
        case '#crear':
            cargarFormulario();
            form.classList.add('show');
            break;
        case '#modificar':
            cargarFormulario(hash[1]);
            form.classList.add('show');
            break;
    }
}

function showLoader(show) {
    if (show) {
        loader.classList.add('show');
    } else {
        loader.classList.remove('show');
    }
}

function showForm(show) {
    if (show) {
        form.classList.add('show');
        listadoUsuarios.classList.add('hide');
        btnCrear.classList.add('hide');
    } else {
        form.classList.remove('show');
        listadoUsuarios.classList.remove('hide');
        btnCrear.classList.remove('hide');
    }
}

function realizarPeticion(metodo, url, handleOk, handleError, datos) {
    const xhr = new XMLHttpRequest();

    showLoader(true);

    xhr.open(metodo, url);

    xhr.responseType = 'json';

    xhr.addEventListener('load', e => {
        if (xhr.status >= 200 && xhr.status <= 299) {
            console.log(xhr);
            handleOk(xhr.response);
        } else {
            handleError(xhr.status);
        }
        showLoader(false);
    });

    xhr.addEventListener('error', e => {
        handleError('Error');
        showLoader(false);
    });

    xhr.send(JSON.stringify(datos));
}

function handleError(error) {
    alert(error);
}

function mostrarUsuarios(usuarios) {
    estado.usuarios = usuarios;
    usuarios.forEach(mostrarUsuario)
}

function eliminarUsuario() {
    const article = document.getElementById(`usuario-${estado.usuarioEliminado}`);

    if (article) {
        article.remove();
    }
}

function ocultarModal() {
    modal.classList.remove('show');
}

function handleEliminar(event) {
    const id = parseInt(event.target.parentNode.id.split('-')[1]);
    const usuario = estado.usuarios.find(u => u.id === id);

    modalContenido.innerHTML = `
        <h3>¿Esta seguro que desea eliminar el usuario ${usuario.name}?</h3>
    `;

    const btnCancelar = document.createElement('button');
    btnCancelar.className = 'btn btn-cancel';
    btnCancelar.textContent = 'Cancelar';

    btnCancelar.addEventListener('click', e => {
        modal.classList.remove('show');
    });

    const btnOk = document.createElement('button');
    btnOk.className = 'btn btn-ok';
    btnOk.textContent = 'OK';

    btnOk.addEventListener('click', e => {
        estado.usuarioEliminado = usuario.id;

        realizarPeticion(
            'delete',
            `https://jsonplaceholder.typicode.com/users/${usuario.id}`,
            eliminarUsuario,
            handleError
        );

        modal.classList.remove('show');
    });

    modalContenido.append(btnCancelar, btnOk)

    modal.classList.add('show');
}


function mostrarUsuario(usuario) {
    const article = document.createElement('article');
    article.className = 'usuario';
    article.id = `usuario-${usuario.id}`;

    article.innerHTML = `
        <h2>${usuario.name}</h2>
        <ul>
            <li>
                <span class="negrita">Email:</span> ${usuario.email}
            </li>
            <li>
                <span class="negrita">Telefono:</span> ${usuario.phone}
            </li>
            <li>
                <span class="negrita">Web:</span> ${usuario.website}
            </li>
        </ul>
    `;

    const btnModificar = document.createElement('button');
    btnModificar.className = 'btn btn-ok';
    btnModificar.textContent = 'Modificar';

    btnModificar.addEventListener('click', e => {
        location.hash = `modificar/${usuario.id}`;
    });

    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn btn-cancel';
    btnEliminar.textContent = 'Eliminar';

    btnEliminar.addEventListener('click', handleEliminar);

    article.append(btnModificar, btnEliminar);

    listadoUsuarios.append(article);            
}

close.addEventListener('click', ocultarModal);
background.addEventListener('click', ocultarModal);
btnCrear.addEventListener('click', e => {
    location.hash = 'crear';
});

btnCancelar.addEventListener('click', () => {
    location.hash = 'home';
});

btnGuardar.addEventListener('click', e => {
    const hash = location.hash.split('/');
    const metodo = hash[0] === '#crear' ? 'post' : 'put';
    let url = 'https://jsonplaceholder.typicode.com/users'

    if (hash[0] === '#modificar') {
        url += `/${hash[1]}`;
    }

    realizarPeticion(
        metodo,
        url,
        () => {
            location.hash = 'home';
        },
        handleError,
        {
            name: nombre.value,
            email: email.value,
            phone: telefono.value,
            website: web.value
        }
    );
});

window.addEventListener('hashchange', mostrarOcultar);

if (location.hash === '') {
    location.hash = 'home';
} else {
    mostrarOcultar();
}