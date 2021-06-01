import Random from "./random.js"

const fileSelect = document.querySelector("#file")
const botonNumeros = document.createElement("button")
const botonFile = document.querySelector("#boton-file")
botonFile.addEventListener("click", () => {
    fileSelect.click()
    
})

const mandarArchivo = document.querySelector("#mandar-archivo")
const textArchivo = document.querySelector("#text-archivo")
const form = document.querySelector("form")
form.addEventListener("submit", (e) => {
    e.preventDefault()
    const archivo = fileSelect.files[0]
    if (archivo.name.includes("json")) {
        botonNumeros.innerHTML = "Sacar Numero!"
        ruleta.append(botonNumeros)
        mandarArchivo.style.display = "None"
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            let json  = reader.result
            console.log(json)
            fetch(json)
            .then(res => {
                return res.json()
            })
            .then(data => {
                console.log(data)
                residentes = data
            })
            .catch((e) => console.log("Ocurrio un error, no se encontro el JSON", e))
        })
        reader.readAsDataURL(archivo)
    } else {
        alert("Debes seleccionar un archivo json")
    }
    // const archivo = fileSelect.value.replace(/^.*\\/,"")
})
fileSelect.addEventListener("change", () => {
    textArchivo.innerHTML = fileSelect.files[0].name
})

let residentes = []

const fondo = document.createElement("div")
const alerta = document.createElement("div")
const titulo = document.createElement("h1")
const contenido = document.createElement("p")
const botonCerrar = document.createElement("div")
function alertar(ganadores, posicion) {
    document.body.append(fondo)
    fondo.append(alerta)
    alerta.append(titulo)
    alerta.append(contenido)
    alerta.append(botonCerrar)
    fondo.className = "fondo"
    alerta.className = "alerta"
    titulo.className = "alerta-titulo"
    contenido.className = "contenido"
    botonCerrar.className = "cerrar"
    titulo.innerHTML = "FELICITACIONES!!!"
    if (posicion === 1) {
        contenido.innerHTML = `En primer lugar... ${listaString(ganadores)}!!`
    } else if(posicion === 2) {
        contenido.innerHTML = `En segundo lugar... ${listaString(ganadores)}!!!`
    } else if(posicion === 3) {
        contenido.innerHTML = `En tercer lugar... ${listaString(ganadores)}!!!`
    }
    botonCerrar.innerHTML = "<span class='material-icons md-48'>done</span>"
}

function finalizar() {
    document.body.append(fondo)
    fondo.append(alerta)
    alerta.append(titulo)
    alerta.append(contenido)
    alerta.append(botonCerrar)
    fondo.className = "fondo"
    alerta.className = "alerta"
    titulo.className = "alerta-titulo"
    contenido.className = "contenido"
    botonCerrar.className = "cerrar"
    titulo.innerHTML = "El bingo ha finalizado"
    contenido.innerHTML = "Gracias a todos por participar!!!"
    botonCerrar.innerHTML = "<span class='material-icons md-48'>done</span>"
    botonNumeros.remove()
}

function listaString(lista) {
    let str = ""
    if (lista.length === 1) {
        return lista.toString()
    } else {
        for (let el of lista) {
            if (lista[lista.length - 2] === el ) {
                str += el + " y "
            } else if (lista[lista.length - 1] === el) {
                str += el
            }else {
                str += el + ", "
            }
        }
        return str
    }
}

const lista_nums = Random.randArrayNoRepeat(50, 50)

const ruleta = document.querySelector("#ruleta")
const sacado = document.querySelector("#sacado")
const casillas = document.querySelectorAll(".num")
let posicion = 1
botonNumeros.addEventListener("click", () => {
    let nuevo = lista_nums.pop()
    let str = nuevo.toString()
    if (nuevo < 10) {
        str = "0" + str
    }
    const cuadrado1 = sacado.children[0]
    const cuadrado2 = sacado.children[1]
    cuadrado1.innerHTML = 0
    cuadrado2.innerHTML = 0
    const cambioNumero1 = setInterval( () => {
        cuadrado1.innerHTML = (parseInt(cuadrado1.innerHTML) + 1) % 5
    },90)

    setTimeout( () => {
        clearInterval(cambioNumero1)
        cuadrado1.innerHTML = str[0]
    }, 1700)

    const cambioNumero2 = setInterval( () => {
        cuadrado2.innerHTML = (parseInt(cuadrado2.innerHTML) + 1) % 10
    },70)

    setTimeout( () => {
        clearInterval(cambioNumero2)
        cuadrado2.innerHTML = str[1]
        casillas[nuevo - 1].classList += " ocupado"
        for (let residente of residentes) {
            residente.numeros = residente.numeros.filter(n => n !== nuevo)
        }
        let ganadores = residentes.filter(res => res.numeros.length === 0)
        if (ganadores.length > 0) {
            let nombres = []
            for (let ganador of ganadores) {
                nombres.push(ganador.nombre)
            }
            alertar(nombres, posicion)
            residentes = residentes.filter(res => res.numeros.length !== 0)
            posicion ++
        }
    }, 1700)
    // console.log(residentes)
})

botonCerrar.addEventListener("click", () => {
    fondo.remove()
    if (posicion === 4 || lista_nums.length === 0) {
    finalizar()
    posicion = 5
    lista_nums.push("finalizado")
    }
})