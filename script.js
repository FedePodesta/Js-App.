
const modal = document.getElementById('modal');
const close = document.getElementById('close');
const background = document.getElementById('background');
const modalContenido = document.getElementById('modal-contenido');

const listadoUsuarios = document.getElementById('listado-usuarios');

close.addEventListener('click', e => {
    modal.classList.remove('show');
});

background.addEventListener('click', e => {
    modal.classList.remove('show');
});

function mostrarUsuario(usuario) {
    const article = document.createElement('article');
    article.className = 'usuario';

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
            const x = new XMLHttpRequest();

            x.open('put', `https://jsonplaceholder.typicode.com/users/${usuario.id}`);

            x.addEventListener('load', e => {
                if (x.status >= 200 && x.status <= 299) {
                    alert('Modificado!')
                } else {
                    alert('Error');
                }
            });

            const data = JSON.stringify({
                name: nombre.value,
                email: email.value,
                phone: telefono.value,
                website: web.value
            });

            x.send(data);

            modal.classList.remove('show');
        });

        modalContenido.append(nombre, email, telefono, web, btnCancelar, btnGuardar);

        modal.classList.add('show');
    });

    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn btn-cancel';
    btnEliminar.textContent = 'Eliminar';

    btnEliminar.addEventListener('click', e => {
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
            const x = new XMLHttpRequest();

            x.open('delete', `https://jsonplaceholder.typicode.com/users/${usuario.id}`);

            x.addEventListener('load', e => {
                if (x.status >= 200 && x.status <= 299) {
                    article.remove();
                } else {
                    alert('Error');
                }
            });

            x.send();

            modal.classList.remove('show');
        });

        modalContenido.append(btnCancelar, btnOk)

        modal.classList.add('show');
    });

    article.append(btnModificar, btnEliminar);

    listadoUsuarios.append(article);            
}

const xhr = new XMLHttpRequest();

xhr.open('get', 'https://jsonplaceholder.typicode.com/users');

xhr.responseType = 'json';

xhr.addEventListener('load', e => {
    if (xhr.status === 200) {
        xhr.response.forEach(mostrarUsuario);
    } else {
        console.error('Load (Error)')
    }
});

xhr.addEventListener('error', e => {
    console.error('Error');
});

xhr.send();