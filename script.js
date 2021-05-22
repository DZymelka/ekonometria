
let macierzX = [];
let macierzX2 = [];
let macierzY = [];

function onFileLoad(event) {
    // document.getElementById(elementId).innerText = event.target.result;
    let textByLine = event.target.result.split('\n')

    //Przekształcenie txt do array
    let matrix = [];
    let textArray = textByLine.join('\n').split('\n');

    textArray.forEach(function(item, index, object) {
        item = item.split(/ |\t/);
        matrix[index] = item;
        macierzY[index] = parseFloat(item[0]);

        item.forEach(function(item2, index, object) {
            if (index === 0) {
                item.splice(index, 1);

                
            }
        });
    });

    macierzX = matrix;

    wyswietlMatrix();
    calculate();
}

function wyswietlMatrix(){
    
    
    //Dodawanie Y
    // table.appendChild(tr);
    $("#matrixTable th").remove(); 
    $("#matrixTable tr").remove(); 
    var table = document.getElementById("matrixTable");
    var tr = document.createElement('tr');   

    var th = document.createElement('th');
    var th_text = document.createTextNode('Y');
    th.appendChild(th_text);
    table.appendChild(th);

    macierzX[0].forEach(function(item, index, object) {
        i = index +1;
        var th = document.createElement('th');
        var th_text = document.createTextNode('X'+i);
        th.appendChild(th_text);
        table.appendChild(th);
    });

    table.appendChild(tr);

    
    macierzY.forEach(function(item, index, object) {
        var tr = document.createElement('tr');   
            //Dodanie wartości Y
            var td = document.createElement('td');
            var td_text = document.createTextNode(item);
            td.appendChild(td_text);
            table.appendChild(td);
            
            //Dodanie wartości X
            macierzX[index].forEach(function(item2, index, object) {
                var td = document.createElement('td');
                var td_text = document.createTextNode(item2);
                td.appendChild(td_text);
                table.appendChild(td);
            });

        table.appendChild(tr);
    });
    table.style.visibility = 'visible';
}


function calculate(){
    
    macierzX = macierzX[0].map((_, colIndex) => macierzX.map(row => parseFloat(row[colIndex])));
    
    //Liczenie sredniej
    let macierzX_srednia = [];
    let macierzY_srednia = oblicz_srednia(macierzY);
    macierzX.forEach(function (item, index, object) {
        macierzX_srednia[index] = oblicz_srednia(item).toFixed(2);
    });
    
    //Odchylenie standardowe
    macierzX_wariancja = oblicz_wariancja(macierzX_srednia, macierzX);
    macierzX_odchylenie = oblicz_odchylenie(macierzX_wariancja, macierzX);

    //Współczynnik zmiennej zmiennych objaśniejących
    macierzX_wsp_zmien = [];
    macierzX_wsp_zmien = oblicz_wsp_zmien(macierzX_odchylenie, macierzX_srednia, macierzX);

    //R0 - współczynnik korelacji
    tabela_wsp_kor_r = oblicz_wsp_kor_r(macierzY_srednia, macierzX_srednia);

    //R0 - współczynnik korelacji
    tabela_wsp_kor_r0 = oblicz_wsp_kor_r0(macierzY_srednia, macierzX_srednia);

    console.log(tabela_wsp_kor_r0);
}

function oblicz_srednia(tablica) {
    let sum = 0;
    for( var i = 0; i < tablica.length; i++ ){
        sum += parseFloat( tablica[i], 10 ); //don't forget to add the base
    }
    return sum/tablica.length;

}

function oblicz_wariancja(wartosc_srednia,macierz) {
    let wartosc_wariancja = [];
    for (i = 0; i < macierz.length; i++)
    {
        wartosc_wariancja[i] = 0;
        for (j = 0; j < macierzX.length; j++)
        {
            wartosc_wariancja[i] += Math.pow((macierz[i][j] - wartosc_srednia[i]),2);
            
        }
        
        wartosc_wariancja[i] /= 9;
    }
    return wartosc_wariancja;
}

function oblicz_odchylenie(wariancja, macierz) {
    let wartosc_odchylenia = [];

    for (i = 0; i < macierz.length; i++)
    {
        wartosc_odchylenia[i] = Math.sqrt(wariancja[i]);
    }

    return wartosc_odchylenia;
};

function oblicz_wsp_zmien(odchylenie, srednia, macierz) {
    let wartosc = [];
    for (i = 0; i < macierz.length; i++)
    {
        wartosc[i] = odchylenie[i] / srednia[i];
    }

    return wartosc;
}

function oblicz_wsp_kor_r(){
    let wsp_kor_r = [];
    macierzX_srednia = [];
    macierzY_srednia = oblicz_srednia(macierzY);
    
    for (i = 0; i < 4; i++)
    {
        let licznik = 0;
        let m1 = 0;
        let m2 = 0;

        macierzX_srednia = oblicz_srednia(macierzX[i] ).toFixed(2);
        for(j = 0; j < macierzX.length; j++){
            licznik += (macierzX[i][j] - macierzX_srednia) * (macierzY[j] - macierzY_srednia);
        }
        for(j = 0; j < macierzX.length; j++){
            m1 += Math.pow((macierzX[i][j] - macierzX_srednia),2);
            m2 += Math.pow((macierzY[j]  - macierzY_srednia),2);
        }

        mianownik = Math.sqrt(m1 * m2);
        wsp_kor_r[i] = licznik / mianownik;
    }
    return wsp_kor_r;
}

function oblicz_wsp_kor_r0(){
    let wsp_kor_r = [];
    macierzX_srednia = [];
    macierzY_srednia = oblicz_srednia(macierzY);
    
    for (i = 0; i < 4; i++)
    {
        let licznik = 0;
        let m1 = 0;
        let m2 = 0;

        macierzX_srednia = oblicz_srednia(macierzX[i] ).toFixed(2);
        for(j = 0; j < macierzX.length; j++){
            licznik += (macierzX[i][j] - macierzX_srednia) * (macierzY[j] - macierzY_srednia);
        }
        for(j = 0; j < macierzX.length; j++){
            m1 += Math.pow((macierzX[i][j] - macierzX_srednia),2);
            m2 += Math.pow((macierzY[j]  - macierzY_srednia),2);
        }

        mianownik = Math.sqrt(m1 * m2);
        wsp_kor_r[i] = licznik / mianownik;
    }
    return wsp_kor_r;
}


function onChooseFile(event, onLoadFileHandler) {
    if (typeof window.FileReader !== 'function')
        throw ("The file API isn't supported on this browser.");
    let input = event.target;
    if (!input)
        throw ("The browser does not properly implement the event object");
    if (!input.files)
        throw ("This browser does not support the `files` property of the file input.");
    if (!input.files[0])
        return undefined;
    let file = input.files[0];
    let fr = new FileReader();
    fr.onload = onLoadFileHandler;
    fr.readAsText(file);
}

$( document ).ready(function() {
    
});