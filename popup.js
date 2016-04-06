function render(element, o) {
    var div = document.getElementById(element);
    var html = "";
    if (div) {
        div.innerHTML = o;

        // Eliminamos el link para descargar la extensión
        if (element == 'titulo') {
            var spans = div.getElementsByTagName('span');
            spans[0].innerHTML = '';
        }

        //En caso que los partidos no estén cargados, agregar una imagen en blanco
        //para evitar error del tipo:
        //  Resource interpreted as Image but transferred with MIME type text/plain
        var imgs = div.getElementsByTagName('img');
        for (var i = 0; i< imgs.length; i++){
            if (endsWith(imgs[i].src,"/")){
                imgs[i].src += "blank.png";
            }
        }

        // Corregir URL de enlaces para que apunten a franjeado.com y no sea relativo a la extensión
        // (no funcionaría si existen más caracteres '/' en la URL)
        var links = div.getElementsByTagName('a');
        for (var i = 0; i< links.length; i++){
            var lastSlash =  links[i].href.lastIndexOf("/");
            links[i].href = "http://www.franjeado.com/"+links[i].href.substring(lastSlash);
        }
    }
};

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function renderMain(o) {
    render("main", o);
};

function renderTitulo(o) {
    render("titulo", o);
};

function fetchData(){
    // Actualmente es innecesario obtener el titulo, ya que el numero de la fecha que se disputará
    // viene como encabezado de la tabla que contiene los datos del siguiente partido.
/*
    var xhrTitulo = new XMLHttpRequest();
    xhrTitulo.open('GET', 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.franjeado.com%2Fstats.php%22%20and%20xpath%3D%22%2Fhtml%2Fbody%2Fdiv%2Ftable%2Ftbody%2Ftr%5B2%5D%2Ftd%2Ftable%2Ftbody%2Ftr%2Ftd%2Ftable%5B1%5D%2Ftbody%2Ftr%2Ftd%5B2%5D%2Fp%22', true);
    xhrTitulo.onload = function(e) {
        renderTitulo(this.response);
    };
    xhrTitulo.send();
*/

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.franjeado.com%2Fstats.php%22%20and%20xpath%3D%27%2F%2Fhtml%2Fbody%2Fdiv%2Ftable%2Ftbody%2Ftr%5B2%5D%2Ftd%2Ftable%2Ftbody%2Ftr%2Ftd%2Ftable%2Ftbody%2Ftr%2Ftd%5B2%5D%2Fdiv%2Ftable%27', true);
    xhr.onload = function(e) {
        renderMain(this.response);
    };
    xhr.send();
};

fetchData();
