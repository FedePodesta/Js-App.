
const modal = document.getElementById('modal');
const close = document.getElementById('close');
const background = document.getElementById('background');
const modalContenido = document.getElementById('modal-contenido');
const loader = document.getElementById('loader');

const listadoUsuarios = document.getElementById('listado-usuarios');

const estado = {
    usuarios: null
};

function showLoader(show) {
    if (show) {
        loader.classList.add('show');
    } else {
        loader.classList.remove('show');
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
        )
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
        modalContenido.innerHTML = `
            <h3>Modificacion</h3>
        `;

        const nombre = document.createElement('input');
        nombre.placeholder = 'Ingrese el nombre';
        nombre.type = 'text';
        nombre.value = usuario.name;

        const email = document.createElement('input');
        email.placeholder = 'Ingrese el email';
        email.type = 'email';
        email.value = usuario.email;

        const telefono = document.createElement('input');
        telefono.placeholder = 'Ingrese el telefono';
        telefono.type = 'tel';
        telefono.value = usuario.phone;

        const web = document.createElement('input');
        web.placeholder = 'Ingrese el website';
        web.type = 'url';
        web.value = usuario.website;

        const btnCancelar = document.createElement('button');
        btnCancelar.className = 'btn btn-cancel';
        btnCancelar.textContent = 'Cancelar';

        btnCancelar.addEventListener('click', e => {
            modal.classList.remove('show');
        });

        const btnGuardar = document.createElement('button');
        btnGuardar.className = 'btn btn-ok';
        btnGuardar.textContent = 'Guardar';

        btnGuardar.addEventListener('click', e => {
            realizarPeticion(
                'put',
                `https://jsonplaceholder.typicode.com/users/${usuario.id}`,
                () => {},
                handleError,
                {
                    name: nombre.value,
                    email: email.value,
                    phone: telefono.value,
                    website: web.value
                }
            )

            modal.classList.remove('show');
        });

        modalContenido.append(nombre, email, telefono, web, btnCancelar, btnGuardar);

        modal.classList.add('show');
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

realizarPeticion('get', 'https://jsonplaceholder.typicode.com/users', mostrarUsuarios,handleError);