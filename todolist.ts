interface Tarea {
	titulo: string;
	descripcion: string;
	estado: string;
	dificultad: string;
	creacion: Date;
	ultimaEdicion: Date;
	vencimiento: Date | null;
}

const tareas: Tarea[]=[];

function elegirEstado(opcion:string | null, estadoActual:string): string {
	if (opcion === "1") {
		return "Pendiente";
	} else if (opcion === "2") {
		return "En curso";
	} else if (opcion === "3") {
		return "Terminada";
	} else if (opcion === "4") {
		return "Cancelada";
	}
	return estadoActual;
}

function elegirDificultad(opcion:string | null, dificultadActual:string): string {
	if (opcion === "1") {
		return "Fácil";
	} else if (opcion === "2") {
		return "Medio";
	} else if (opcion === "3") {
		return "Difícil";
	}
	return dificultadActual;
}

function mostrarDificultad(dificultad:string): string {
	if (dificultad === "Fácil") {
		return "⭐";
	} else if (dificultad === "Medio") {
		return "⭐⭐";
	} else if (dificultad === "Difícil") {
		return "⭐⭐⭐";
	}
	return dificultad;
}

function formatearFecha(fecha:Date | null):string {
	if (fecha === null || Number.isNaN(fecha.getTime())) {
		return "Sin fecha";
	}

	const dia = String(fecha.getDate()).padStart(2, "0");
	const mes = String(fecha.getMonth() + 1).padStart(2, "0");
	const anio = fecha.getFullYear();
	const horas = String(fecha.getHours()).padStart(2, "0");
	const minutos = String(fecha.getMinutes()).padStart(2, "0");
	return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
}

function parsearFecha(fechaTexto:string): Date | null {
	const partes = fechaTexto.trim().split("/");
	if (partes.length !== 3) {
		return null;
	}

	const dia = Number(partes[0]);
	const mes = Number(partes[1]);
	const anio = Number(partes[2]);
	if (!Number.isInteger(dia) || !Number.isInteger(mes) || !Number.isInteger(anio)) {
		return null;
	}

	const fecha = new Date(anio, mes - 1, dia);
	if (fecha.getFullYear() !== anio || fecha.getMonth() !== mes - 1 || fecha.getDate() !== dia) {
		return null;
	}
	return fecha;
}

function menuPrincipal(): void {
	let salir = false;

	while (!salir) {
		const opcion =prompt(
			"=== MENÚ PRINCIPAL ===\n" +
			"1. Ver mis tareas\n" +
			"2. Buscar una tarea\n" +
			"3. Agregar una tarea\n" +
			"0. Salir\n\n" +
			"Elija una opción:"
		);

		if (opcion === null || opcion === "0") {
			alert("Gracias!");
			salir = true;
		} else if (opcion === "1") {
			menuVerMisTareas();
		} else if (opcion === "2") {
			menuBuscarTarea();
		} else if (opcion === "3") {
			menuAgregarTarea();
		} else {
			alert("Opción no válida. Por favor ingrese 1, 2, 3 o 0.");
		}
	}
}

function menuVerMisTareas(): void {
	let volver = false;

	while (!volver) {
		const opcion = prompt(
			"=== VER MIS TAREAS ===\n" +
			"1. Ver todas las tareas\n" +
			"2. Ver tareas Pendientes\n" +
			"3. Ver tareas En curso\n" +
			"4. Ver tareas Terminadas\n" +
			"0. Volver al Menú Principal\n\n" +
			"Elija una opción:"
		);

		if (opcion === null || opcion === "0") {
			volver = true;
		} else if (opcion === "1") {
			listarYSeleccionarTareas(tareas, "TODAS LAS TAREAS");
		} else if (opcion === "2") {
			listarTareasPorEstado("Pendiente", "TAREAS PENDIENTES");
		} else if (opcion === "3") {
			listarTareasPorEstado("En curso", "TAREAS EN CURSO");
		} else if (opcion === "4") {
			listarTareasPorEstado("Terminada", "TAREAS TERMINADAS");
		} else {
			alert("Opción no válida. Elija una opción del 0 al 4.");
		}
	}
}

function listarTareasPorEstado(estado: string, tituloVista: string): void {
	const resultado: Tarea[]=[];

	for (let indice = 0; indice < tareas.length; indice++) {
		if (tareas[indice].estado === estado) {
			resultado.push(tareas[indice]);
		}
	}

	listarYSeleccionarTareas(resultado, tituloVista);
}

function listarYSeleccionarTareas(sublista: Tarea[], tituloVista: string): void {
	if (sublista.length === 0) {
		alert(`[${tituloVista}] No hay tareas registradas.`);
		return;
	}

	let mensaje = `=== ${tituloVista} ===\n`;
	for (let indice = 0; indice < sublista.length; indice++) {
		const tarea = sublista[indice];
		mensaje += `[${indice + 1}] ${tarea.titulo} | Estado: ${tarea.estado} | Dificultad: ${mostrarDificultad(tarea.dificultad)}\n`;
	}
	mensaje += "\nIngrese el número de la tarea para ver sus detalles (o 0 para volver):";

	const seleccion = prompt(mensaje);
	const numero = seleccion === null ? Number.NaN : Number.parseInt(seleccion, 10);
	if (Number.isInteger(numero) && numero > 0 && numero <= sublista.length) {
		menuDetallesTarea(sublista[numero - 1]);
	} else if (seleccion !== "0" && seleccion !== null) {
		alert("Número de tarea no válido.");
	}
}

function menuDetallesTarea(tarea: Tarea): void {
	let volver = false;

	while (!volver) {
		const descripcion = tarea.descripcion.trim() === "" ? "(Sin descripción)" : tarea.descripcion;
		const vencimiento = tarea.vencimiento === null ? "(Sin vencimiento)" : formatearFecha(tarea.vencimiento);
		const mensaje =
			"=== DETALLES DE LA TAREA ===\n" +
			`Título: ${tarea.titulo}\n` +
			`Descripción: ${descripcion}\n` +
			`Estado: ${tarea.estado}\n` +
			`Dificultad: ${mostrarDificultad(tarea.dificultad)}\n` +
			`Creación: ${formatearFecha(tarea.creacion)}\n` +
			`Última Edición: ${formatearFecha(tarea.ultimaEdicion)}\n` +
			`Vencimiento: ${vencimiento}\n\n` +
			"Opciones:\n" +
			"[E] Editar esta tarea\n" +
			"[0] Volver al menú anterior\n\n" +
			"Ingrese opción:";
		const accion = prompt(mensaje);

		if (accion === null || accion === "0") {
			volver = true;
		} else if (accion.trim().toUpperCase() === "E") {
			menuEdicionTarea(tarea);
		} else {
			alert("Opción no válida. Ingrese 'E' para editar o '0' para volver.");
		}
	}
}

function menuEdicionTarea(tarea: Tarea): void {
	alert("=== EDICIÓN DE TAREA ===\nSi deja un campo en blanco, se conservará el valor anterior.\nPara borrar la descripción, ingrese un espacio en blanco.");

	const nuevoTitulo = prompt(`Título actual: "${tarea.titulo}"\nNuevo título:`);
	if (nuevoTitulo !== null && nuevoTitulo.trim() !== "") {
		tarea.titulo = nuevoTitulo.slice(0, 100);
	}

	const nuevaDescripcion = prompt(`Descripción actual: "${tarea.descripcion}"\nNueva descripción:`);
	if (nuevaDescripcion !== null) {
		if (nuevaDescripcion === " ") {
			tarea.descripcion = "";
		} else if (nuevaDescripcion.trim() !== "") {
			tarea.descripcion = nuevaDescripcion.slice(0, 500);
		}
	}

	const nuevoEstado = prompt(
		`Estado actual: ${tarea.estado}\n` +
		"Nuevo estado:\n1. Pendiente | 2. En curso | 3. Terminada | 4. Cancelada"
	);
	tarea.estado = elegirEstado(nuevoEstado, tarea.estado);

	const nuevaDificultad = prompt(
		`Dificultad actual: ${tarea.dificultad}\n` +
		"Nueva dificultad:\n1. Fácil | 2. Medio | 3. Difícil"
	);
	tarea.dificultad = elegirDificultad(nuevaDificultad, tarea.dificultad);

	const nuevoVencimiento = prompt("Nuevo vencimiento (ej. DD/MM/YYYY):");
	if (nuevoVencimiento !== null && nuevoVencimiento.trim() !== "") {
		const fecha = parsearFecha(nuevoVencimiento);
		if (fecha !== null) {
			tarea.vencimiento = fecha;
		} else {
			alert("Fecha no válida. Se conserva el vencimiento anterior.");
		}
	}

	tarea.ultimaEdicion = new Date();
	alert("Tarea guardada con éxito.");
}

function menuBuscarTarea(): void {
	const clave = prompt("=== BUSCAR TAREA ===\nIngrese la palabra clave para buscar en títulos:");
	if (clave === null || clave.trim() === "") {
		return;
	}

	const palabraClave = clave.trim().toLowerCase();
	const resultados: Tarea[] = [];
	for (let indice = 0; indice < tareas.length; indice++) {
		if (tareas[indice].titulo.toLowerCase().includes(palabraClave)) {
			resultados.push(tareas[indice]);
		}
	}

	if (resultados.length === 0) {
		alert(`No se encontraron tareas que coincidan con "${clave}".`);
	} else {
		listarYSeleccionarTareas(resultados, `RESULTADOS DE BÚSQUEDA ("${clave}")`);
	}
}

function menuAgregarTarea(): void {
	alert("=== AGREGAR NUEVA TAREA ===");
	let titulo: string | null = "";

	while (titulo === "" || titulo === null || titulo.trim() === "") {
		titulo = prompt("Ingrese el Título de la tarea (obligatorio):");
		if (titulo === null) {
			return;
		}
	}

	const entradaDescripcion = prompt("Ingrese la Descripción (opcional):");
	const descripcion = entradaDescripcion === null ? "" : entradaDescripcion;

	const opcionEstado = prompt(
		"Estado:\n1. Pendiente (por defecto)\n2. En curso\n3. Terminada\n4. Cancelada"
	);
	const estado = elegirEstado(opcionEstado, "Pendiente");

	const opcionDificultad = prompt("Dificultad:\n1. Fácil (por defecto)\n2. Medio\n3. Difícil");
	const dificultad = elegirDificultad(opcionDificultad, "Fácil");

	const entradaVencimiento = prompt("Fecha de vencimiento (opcional, ej. DD/MM/YYYY):");
	let vencimiento: Date | null = null;
	if (entradaVencimiento !== null && entradaVencimiento.trim() !== "") {
		vencimiento = parsearFecha(entradaVencimiento);
		if (vencimiento === null) {
			alert("Fecha no válida. La tarea se guardará sin vencimiento.");
		}
	}

	const ahora = new Date();
	tareas.push({
		titulo: titulo.slice(0, 100),
		descripcion: descripcion.slice(0, 500),
		estado,
		dificultad,
		creacion: ahora,
		ultimaEdicion: ahora,
		vencimiento
	});
	alert("Tarea guardada con éxito.");
}
    
menuPrincipal();
