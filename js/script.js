const dataInput = document.getElementById('datos');
const sendButton = document.getElementById('sendButton');
const cantTotal = document.querySelector('.total');

sendButton.addEventListener('click',()=>{
    let data = dataInput.value.trim();
    let tableData= data.split(" ");
    let total = tableData.length;
    let datosOrdenados = tableData.sort((a,b)=>a-b);
    let datosSinRepetir = new Set(datosOrdenados)
    let body = "";
    let fa = obtenerFrecuenciaAbsoluta(datosOrdenados,datosSinRepetir);
    let fr = obtenerFrecuenciaRelativa(fa,total);
    let frp = obtenerFrecuenciaRelativaPorcentual(fr);

    let indice = 0
    let Fa= 0;
    let Fapr = 0;
    datosSinRepetir.forEach((dato) =>{
        
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
        `
        indice++;
        
    })

    document.querySelector('tbody').innerHTML = body;
    cantTotal.innerHTML = `Cantidad de datos: ${total}`
})


function obtenerFrecuenciaAbsoluta(datosOrdenados,datosSinRepeticion){
    let frecuenciaAbsoluta = [];
    datosSinRepeticion.forEach(element=>{
        frecuenciaAbsoluta.push(datosOrdenados.filter(el=> el==element).length)
    })
    return frecuenciaAbsoluta;
}
function obtenerFrecuenciaRelativa(frecuenciaAbsoluta,total){
    let frecuenciaRelativa= frecuenciaAbsoluta.map(el=>{
        return (el/total).toFixed(4);
    })
    return frecuenciaRelativa;
}
function obtenerFrecuenciaRelativaPorcentual(frecuenciaRelativa){
    let frecuenciaRelativaPorcentual= frecuenciaRelativa.map(el=>{
        return (el*100);
    })
    return frecuenciaRelativaPorcentual;
}
