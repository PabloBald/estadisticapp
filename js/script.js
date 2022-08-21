const dataInput = document.getElementById("datos");
const sendButton = document.getElementById("sendButton");
const cantTotal = document.querySelector(".total");
const recorrido = document.getElementById("recorrido");
const intervalos = document.getElementById("intervalos");
const amplitud = document.getElementById("amplitud");
const rInter = document.querySelector("#rInter");

sendButton.addEventListener("click", () => {
	//Limpio la string
	let data = dataInput.value.trim(); //Espacios antes y despues.
	data = data.replace(new RegExp(/,|[a-zA-Z]/, "g"), ""); //Busco las comas y las reemplazo por una cadena vacia.
	let tableData = data.split(" "); //Separo el contenido de la string en un arreglo mediante el separador " "(espacio en blanco).
	tableData = tableData.map(Number); //Mapeo el contenido del arreglo de tipo string a tipo number para poder hacer las operaciones.
	console.log(tableData);
	//

	let total = tableData.length; //Total de datos
	cantTotal.innerHTML = `Cantidad de datos(n): ${total}`; //Armo la string de cantidad de datos.
	let datosOrdenados = tableData.sort((a, b) => a - b); //Ordeno los datos
	let datosSinRepetir = new Set(datosOrdenados); //Creo un Set en el que no hay datos repetidos.
    let head="";
	let body = "";
    

	//Si Resolver por intervalos esta checkeado.
	if (rInter.checked) {
        head = `
        <th>Intervalo</th>
        <th>Marca de clase</th>
        <th>fa</th>
        <th>fr</th>
        <th>frp</th>
        <th>Fa</th>
        <th>Fa%</th>
        `
		let minmaxMap = obtenerMaxMinMap(datosOrdenados); //Un map que tiene guardados en clave-valor el maximo y minimo valor de variable.
		let Re = obtenerRecorrido(minmaxMap.get("min"), minmaxMap.get("max")); //Obtengo el recorrido xMax-xMin
		let N = obtenerNumeroIntervalos(total); //Obtengo el numero de intervalos. Raiz cuadrada del total de datos.
		let A = obtenerAmplitud(Re, N); //Obtengo la amplitud. Recorrido(Re)/Numero de intervalos(N)

		//Los muestro en la pagina.
		document.querySelector("#recorrido").innerHTML = "Recorrido(Re): " + Re;
		document.querySelector("#intervalos").innerHTML =
			"Numero de intervalos(N): " + N;
		document.querySelector("#amplitud").innerHTML = "Amplitud(A): " + A;

		//Arreglos que van a contener las estadisticas.
		let fa = [];
		let fr = [];
		let frp = [];
		let intervalos = [];
		let marcaDeClase = [];
		let inferior = 0;
		let superior = 0;
		for (let i = 0; i < N; i++) {
			i == 0 ? (inferior = datosOrdenados[i]) : (inferior = superior); //Si es el primer dato,el limite inferior es igual a ese dato, sino es igual al limite superior previo.
			superior = inferior + A; //limite superior es igual a el inferior mas la amplitud.

			let intervalo = `[${inferior},${superior})`; //Formo la string con el intervalo
			intervalos.push(intervalo); //Agrego el intervalo al arreglo de intervalos
			let fabs = tableData.filter((el) => el >= inferior && el < superior); //obtengo la frecuencia para el rango.(Modularizar)
			fa.push(fabs.length); //Agrego la frecuencia al arreglo.
			marcaDeClase.push((inferior + superior) / 2); //Obtengo la marca de clase mediante el promedio y lo agrego al arreglo de marca de clase. (limite inferior+limite superior)/2
		}
        fr = obtenerFrecuenciaRelativa(fa, total);
		frp = obtenerFrecuenciaRelativaPorcentual(fr);
		console.log(intervalos);
		console.log(marcaDeClase);
		console.log(fa);
        console.log(fr);
        console.log(frp);
        let Fa = 0;
		let Fapr = 0;
        intervalos.map((intervalo,indice) => {
			Fa += fa[indice];
			Fapr += frp[indice];
			body += `<tr>
        <td>${intervalo}</td>
        <td>${marcaDeClase[indice]}</td>
        <td>${fa[indice]}</td>
        <td>${fr[indice]}</td>
        <td>${frp[indice].toFixed(2)}%</td>
        <td>${Fa}</td>
        <td>${Fapr.toFixed(2)}%</td>
        </tr>
        `;
			indice++;
		});
		
        
	} else {
        head = `
        <th>Dato</th>
        <th>fa</th>
        <th>fr</th>
        <th>frp</th>
        <th>Fa</th>
        <th>Fa%</th>
        `
		//Arreglos que van a contener las estadisticas.
		let fa = obtenerFrecuenciaAbsoluta(datosOrdenados, datosSinRepetir);
		let fr = obtenerFrecuenciaRelativa(fa, total);
		let frp = obtenerFrecuenciaRelativaPorcentual(fr);
		let Fa = 0;
		let Fapr = 0;
        let indice = 0;
		datosSinRepetir.forEach((dato) => {
			Fa += fa[indice];
			Fapr += frp[indice];
			body += `<tr>
        <td>${dato}</td>
        <td>${fa[indice]}</td>
        <td>${fr[indice]}</td>
        <td>${frp[indice].toFixed(2)}%</td>
        <td>${Fa}</td>
        <td>${Fapr.toFixed(2)}%</td>
        </tr>
        `;
			indice++;
		});
	}
    document.querySelector('thead').innerHTML = head;
	document.querySelector('tbody').innerHTML = body;
});

function obtenerFrecuenciaAbsoluta(datosOrdenados, datosSinRepeticion) {
	let frecuenciaAbsoluta = [];
	datosSinRepeticion.forEach((element) => {
		frecuenciaAbsoluta.push(
			datosOrdenados.filter((el) => el == element).length
		);
	});
	return frecuenciaAbsoluta;
}
function obtenerFrecuenciaRelativa(frecuenciaAbsoluta, total) {
	let frecuenciaRelativa = frecuenciaAbsoluta.map((el) => {
		return (el / total).toFixed(4);
	});
	return frecuenciaRelativa;
}
function obtenerFrecuenciaRelativaPorcentual(frecuenciaRelativa) {
	let frecuenciaRelativaPorcentual = frecuenciaRelativa.map((el) => {
		return el * 100;
	});
	return frecuenciaRelativaPorcentual;
}
function obtenerMaxMinMap(datosOrdenados) {
	let map = new Map();
	map.set("max", Math.max(...datosOrdenados));
	map.set("min", Math.min(...datosOrdenados));

	return map;
}
function obtenerRecorrido(min, max) {
	return max - min;
}
function obtenerNumeroIntervalos(total) {
	return Math.ceil(Math.sqrt(total));
}
function obtenerAmplitud(Recorrido, NumeroIntervalos) {
	return Math.ceil(Recorrido / NumeroIntervalos);
}
