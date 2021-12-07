//* =================
//* === toDo list ===
//* =================

// ==========================
// === capturar elementos ===
// ==========================
const formulario = document.getElementById('formulario');
const input = document.getElementById('input');
const listaTareas = document.getElementById('lista-tareas');
const template = document.getElementById('template').content; // template siempre 'content' | capturar contenido
const fragment = document.createDocumentFragment();

// ==========================
// === colección de datos ===
// ==========================
// let tareas = {
//     1638736871873: {
//         id: 1638736871873,
//         texto: 'Tarea #1',
//         estado: false
//     },
//     1638737450549: {
//         id: 1638737450549,
//         texto: 'Tarea #2',
//         estado: false
//     }
// };

let tareas = {};

// generar id | 1638736871873
//console.log(Date.now());


// ===============
// === eventos ===
// ===============
document.addEventListener('DOMContentLoaded', () => {
    // === leer el localStorage | antes de pintar las tareas ===
    if(localStorage.getItem('tareas')) {
        // si existe la tarea entra en el if y convierte de string a JSON | leemos lo que está en el localStorage
        tareas = JSON.parse(localStorage.getItem('tareas'));
    }

    // === una vez que se lea todo el html | pinta nuestras tareas ===
    pintarTareas();
});

listaTareas.addEventListener('click', e => {
    // === delegación de eventos ===
    // accedemos a toda la 'lista de tareas' y hacemos la delegación | los detectamos con los IF
    btnAcccion(e);
})

formulario.addEventListener('submit', e => {
    // === evita comportamiento html por defecto | submit ===
    e.preventDefault();

    // === acceder al valor del elemento (input) | 3 formas de acceder ===
    //console.log(e.target[0].value);
    //console.log(e.target.querySelector('input').value);
    //console.log(input.value);

    // === crear objeto dinámicamente | cuando el usuario haga click en 'Agregar' ===
    setTarea();
});

// =================
// === funciones ===
// =================
const setTarea = (e) => {
    
    // === validar input | que no se ingrese campo vacio ===
    if(input.value.trim() === '') {
        console.log('está vacio');
        return;
    }
    //console.log('diste click...');

    // === crear tarea | construir objeto dinámicamente ===
    const tarea = {
        id: Date.now(),
        texto: input.value,
        estado: false
    };

    // comprobar
    //console.log(tarea);

    // === guardar objeto tarea | por índice (id) en la colección de datos (tareas) ===
    tareas[tarea.id] = tarea;

    //comprobar
    //console.log(tareas);

    // === limpiar input ===
    formulario.reset();

    // === añadir focus al input ===
    input.focus();

    // === renderizar objeto | en html ===
    pintarTareas();
}


const pintarTareas = () => {
    // === guardar tarea en localStorage ===
    // convertir/parsear la colección de objetos a un string (localStorage trabaja con strings)
    localStorage.setItem('tareas', JSON.stringify(tareas));

    // === ¿no existen tareas? | colección de objetos vacia ===
    if(Object.values(tareas).length === 0) {        
        listaTareas.innerHTML = `
            <div class="alert alert-dark text-center">
                No hay tareas pendientes 😍
            </div>
        `;
        return;
    }

    // === limpiar dom | para que no salgan las tareas repetidas | borrar lo anterior ===
    listaTareas.innerHTML = '';
    
    // === recorrer la colección de datos | tareas ===
    Object.values(tareas).forEach(tarea => {
        //console.log(tarea);
        // === template html ===
        // === clonar el template | hacer el clone ===
        const clone = template.cloneNode(true);
        // === modficar el clone ===
        clone.querySelector('p').textContent = tarea.texto;

        // === si el estado de la tarea es true | podemos modificar el fondo, icono y tachar texto ===
        if(tarea.estado) {
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary');
            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle', 'fa-undo-alt');
            clone.querySelector('p').style.textDecoration = 'line-through';
        }

        // === incluir en el atributo dataset el 'id' de esa tarea ===
        clone.querySelectorAll('.fas')[0].dataset.id = tarea.id;
        clone.querySelectorAll('.fas')[1].dataset.id = tarea.id;
        // === mostrarlo en el html ===
        fragment.appendChild(clone);
    });

    // === renderizarlo en el html | en la lista de tareas ===
    listaTareas.appendChild(fragment);
}


const btnAcccion = e => {
    // === detectar los botones de las tareas | acciones ===
    //console.log(e.target.classList.contains('fa-check-circle'));

    // === cuando el usuario hizo click en el botón ok (verde) ===
    if(e.target.classList.contains('fa-check-circle')) {
        // === acceder al id del botón ok (verde) ===
        //console.log(e.target.dataset.id);
        // === cambia el estado de la tarea | true | para poder modificarla/utilizarla | cambiar icono,fondo ===
        tareas[e.target.dataset.id].estado = true;
        // === renderizar las tareas ===
        pintarTareas();
        console.log(tareas);
    }

    // === cuando el usuario hizo click en el botón eliminar (rojo) ===
    if(e.target.classList.contains('fa-minus-circle')) {
        // === elimina el objeto que le pasemos por id ===
        delete tareas[e.target.dataset.id];
        // === renderizar las tareas ===
        pintarTareas();
        console.log(tareas);
    }

    // === cuando el usuario hizo click en el restaurar (atrás) ===
    if(e.target.classList.contains('fa-undo-alt')) {
        // === acceder al id del restaurar (atrás) ===
        //console.log(e.target.dataset.id);
        // === cambia el estado de la tarea | false | para poder modificarla/utilizarla | cambiar icono,fondo ===
        tareas[e.target.dataset.id].estado = false;
        // === renderizar las tareas ===
        pintarTareas();
        console.log(tareas);
    }


    // === detine otros eventos fuera del div | activa solo los eventos que están dentro del div ===
    e.stopPropagation();
}