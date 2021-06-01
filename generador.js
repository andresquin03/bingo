import Random from "./random.js"

const countUnicos = array => {
    const counter = {};
    for (let el of array) {
       counter[el.trim()] = 1 + (counter[el.trim()] || 0);
    };
    return counter;
};

function download(content, fileName, contentType) {
    let a = document.createElement("a");
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}


function crearTablero(numeros, nombre, residencial, container) {
    //recibe una array de 25 numeros y crea un tablero
    const h1 = document.createElement("h1")
    h1.innerText = nombre 
    const h4 = document.createElement("h4")
    h4.innerText = `  -- Residencial: ${residencial}`
    container.append(h1)
    container.append(h4)
    const tabla = document.createElement("table")
    container.append(tabla)
    for (let i = 0; i < numeros.length; i++) {
        if (i % 5 === 0) {
            var row = document.createElement("tr")
            tabla.append(row)
        }
        const el = document.createElement("td")
        row.append(el)
        el.append(numeros[i])
    }
}


const form = document.querySelector("form")

const texto = form.elements.text
// const boton = form.elements.button

const lado = document.querySelector(".p")
texto.addEventListener("input", () => {
    const lineas = texto.value.split("\n")
    const residencias = []
    const otros = []
    for(let item of lineas) {
        const valores = item.split(",")
        if (valores.length === 2) {
            residencias.push(valores[1])
        } else {
            otros.push(item)
        }
    }
    const contador = countUnicos(residencias)
    lado.innerHTML = ""
    for (let res in contador) {
        if (contador[res] > 1) {
        lado.innerHTML += (`<p>hay ${contador[res]} residentes en ${res}</p>`)
        } else {
            lado.innerHTML += (`<p>hay ${contador[res]} residente en ${res}</p>`)
        }
    }
    if (otros.length > 0) {
        for (let o of otros) {
            lado.innerHTML += `<p>No se entienede la linea ${o}`
        }
    }
    if (texto.value === "") {
        lado.innerHTML = "Este recuadro se actualizara a medida que se ingresen datos en la lista de residentes"
    }
 })

const h2 = document.querySelector("h2")
form.addEventListener("submit", (e) => {
    e.preventDefault();

    //CREACION JSON
    const residentes = []
    const nResidencias = []
    const lista = texto.value.split("\n")
    for(let item of lista) {
        const valores = item.split(",")
        if (valores.length === 2) {
            const residente = {
                nombre: valores[0].trim(),
                residencia: valores[1].trim(),
                numeros: Random.randArrayNoRepeat(50, 25)
            }
            residentes.push(residente)
            if (!nResidencias.includes(valores[1].trim())) {
                nResidencias.push(valores[1].trim())
            }
        }
        else {
            alert("Debes ingresar 2 datos por linea, separados por coma, sino no seran agregados correctamente")
        }
    }
    console.log(nResidencias)
    if (residentes.length > 0) {
        residentes.sort((a, b) => {
            const n1 = a.nombre.toUpperCase()
            const n2 = b.nombre.toUpperCase()
            if(n1 < n2) return -1;
            if(n1 > n2) return 1;
            return 0;
        })

        let residentesjs = JSON.stringify(residentes)
        h2.innerHTML =  residentesjs
        
        

        //creacion PDF
        let container 
        for (let nRes of nResidencias) {
            container = document.createElement("div")
            document.body.append(container)
            let residentesFilt = residentes.filter(res => res.residencia === nRes)
            for (let res of residentesFilt) {
                crearTablero(res.numeros, res.nombre, res.residencia, container)
            }
            let opt = {
                margin:       1,
                filename:     `${nRes}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().from(container).set(opt).save() // descarga pdf
            container.remove()
        }
    //Descarga:
    download(residentesjs, 'residentes.json', 'text/json'); //descarga json
    

    } else {
        alert("Debes enviar por lo menos un residente para que se descarguen los documentos")
    }
})
