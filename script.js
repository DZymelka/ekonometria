
let macierzX = [];
let macierzX2 = [];
let macierzY = [];

let tabela_wsp_kor_r0 = [];
let tabela_wsp_kor_r = [];

let kluczX = [];

let iloscZmiennych = 2;

// var radios = document.querySelectorAll('input[type=radio][name="iloscZmiennych"]');
$(document).ready(function () {
    $('input[type=radio][name=iloscZmiennych]').change(function() {
        
        if (this.value == '2') {
            iloscZmiennych = 2;
        }
        else if (this.value == '3') {
            iloscZmiennych = 3;
        }

        calculate();
    });
});

 

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
    macierzX =  math.transpose(macierzX);
    calculate();
}

function wyswietlMatrix(){
    
    
    //Dodawanie Y
    // table.appendChild(tr);
    $("#matrixTable th").remove(); 
    $("#matrixTable tr").remove(); 
    $("#matrixTable td").remove();
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
    $(".matrixContent").show();

}

function wyswietlR(){
    $("#R0Table tr").remove();
    $("#R0Table th").remove();
    $("#R0Table td").remove();
    $("#RTable td").remove();
    $("#RTable th").remove();
    let table = document.getElementById("R0Table");

    var th = document.createElement('th');
    var th_text = document.createTextNode(`Y`);
    th.appendChild(th_text);
    table.appendChild(th);

    
    tabela_wsp_kor_r0.forEach(function(item, index, object) {
        var tr = document.createElement('tr');   
        table.appendChild(tr);
        var td = document.createElement('td');
        var td_text = document.createTextNode(item.toFixed(4));
        td.appendChild(td_text);
        table.appendChild(td);
    });

    let tableR = document.getElementById("RTable");

    var th = document.createElement('th');
    tableR.appendChild(th);

    tabela_wsp_kor_r.forEach(function(item, index, object) {

        var th = document.createElement('th');
        var th_text = document.createTextNode(`X${index+1}`);
        th.appendChild(th_text);
        tableR.appendChild(th);
    });

    var tr = document.createElement('tr');   
    tableR.appendChild(tr);

    tabela_wsp_kor_r.forEach(function(item, index, object) {
        var tr = document.createElement('tr');   

        var th = document.createElement('th');
        var th_text = document.createTextNode(`X${index+1}`);
        th.appendChild(th_text);
        tableR.appendChild(th);


        tabela_wsp_kor_r[index].forEach(function(item2, index, object) {
            var td = document.createElement('td');
            var td_text = document.createTextNode(item2.toFixed(4));
            td.appendChild(td_text);
            tableR.appendChild(td);
        });
        tableR.appendChild(tr);
    });
    $(".matrixContent").show();
}


function calculate(){
    
    //Liczenie sredniej
    let macierzX_srednia = [];
    let macierzY_srednia = oblicz_srednia(macierzY);
    macierzX.forEach(function (item, index, object) {
        macierzX_srednia.push(oblicz_srednia(item).toFixed(2));
    });
    
    //Odchylenie standardowe

    macierzX_wariancja = oblicz_wariancja(macierzX_srednia);
    macierzX_odchylenie = oblicz_odchylenie(macierzX_wariancja);

    //Współczynnik zmiennej zmiennych objaśniejących
    macierzX_wsp_zmien = [];
    macierzX_wsp_zmien = oblicz_wsp_zmien(macierzX_odchylenie, macierzX_srednia, macierzX);

    //R0 - współczynnik korelacji
    tabela_wsp_kor_r = oblicz_wsp_kor_r(macierzY_srednia, macierzX_srednia);

    //R0 - współczynnik korelacji
    tabela_wsp_kor_r0 = oblicz_wsp_kor_r0(macierzY_srednia, macierzX_srednia);

    wyswietlR();

    //R - współczynnik korelacji
    tabela_wsp_kor_r = oblicz_wsp_kor_r(macierzY_srednia, macierzX_srednia);

    // Metoda współczynników korelacji wielorakiej (Pawłowskiego)
    wskaznik = oblicz_wsp_korelacji_wielorakiej();

    let X = [];
    let macierz1 = []
    for(let i = 0; i < macierzX[0].length; i++)
        macierz1[i] = 1;

    switch (wskaznik) {
        case 0:
            X = [macierzX[0], macierzX[1], macierz1] ;
            klucz = [0, 1];
            break;
        case 1:
            X = [macierzX[0], macierzX[2], macierz1];
            klucz = [0, 2];
            break;
        case 2:
            X = [macierzX[0], macierzX[3], macierz1];
            klucz = [0, 3];
            break;
        case 3:
            X = [macierzX[1], macierzX[2], macierz1];
            klucz = [1, 2];
            break;
        case 4:
            X = [macierzX[1], macierzX[3], macierz1];
            klucz = [1, 3];
            break;
        case 5:
            X = [macierzX[2], macierzX[3], macierz1];
            klucz = [2, 3];
            break;
        case 6:
            X = [macierzX[0], macierzX[1], macierzX[2], macierz1];
            klucz = [0, 1 ,2];
            break;
        case 7:
            X = [macierzX[0], macierzX[1], macierzX[3], macierz1];
            klucz = [0, 1 ,3];
            break;
        case 8:
            X = [macierzX[0], macierzX[2], macierzX[3], macierz1];
            klucz = [0, 2 ,3];
            break;
        case 9:
            X = [macierzX[1], macierzX[2], macierzX[3], macierz1];
            klucz = [1, 2 ,3];
            break;
        default:
            console.log('Błąd.');
            break;
    }

    XT = math.transpose(X);

    let XTX =  math.multiply(X, XT);

    let XTX_odw = [];
    if(iloscZmiennych == 3){
        XTX_odw = math.inv([[XTX[0][0], XTX[0][1], XTX[0][2], XTX[0][3]],
                    [XTX[1][0], XTX[1][1], XTX[1][2], XTX[1][3]],
                    [XTX[2][0], XTX[2][1], XTX[2][2], XTX[2][3]],
                    [XTX[3][0], XTX[3][1], XTX[3][2], XTX[3][3]]
                ]);
    } else {
        XTX_odw = math.inv([[XTX[0][0], XTX[0][1], XTX[0][2]],
            [XTX[1][0], XTX[1][1], XTX[1][2]],
            [XTX[2][0], XTX[2][1], XTX[2][2]]
        ]);
    }

    let YT = math.transpose(macierzY);
    
    let XTY =  math.multiply(X, macierzY);
    
    let KMNK =  math.multiply(XTX_odw, XTY)


    // console.log(`Y = ${KMNK[0][0]} * X${klucz[0]+1} + ${KMNK[1][0]} * X${klucz[1]+1} + ${KMNK[2][0]}`);
    if(iloscZmiennych == 3){
        document.getElementById("rownanie_modelu").innerHTML = `Y = ${KMNK[0].toFixed(4)} * X${klucz[0]+1} + ${KMNK[1].toFixed(4)} * X${klucz[1]+1} + ${KMNK[2].toFixed(4)} * X${klucz[2]+1} + ${KMNK[3].toFixed(4)}`; 
    } else {
        document.getElementById("rownanie_modelu").innerHTML = `Y = ${KMNK[0].toFixed(4)} * X${klucz[0]+1} + ${KMNK[1].toFixed(4)} * X${klucz[1]+1} + ${KMNK[2].toFixed(4)}`; 
    }

    // Odchylenei standardowe składnika resztowego
    to_pierwsze = math.multiply(macierzY, YT);
    to_drugie = math.multiply(X, YT); 
    if(iloscZmiennych == 3)
        to_trzecie = math.multiply([KMNK[0], KMNK[1], KMNK[2], KMNK[3]], to_drugie);
    else 
        to_trzecie = math.multiply([KMNK[0], KMNK[1], KMNK[2]], to_drugie);

    to_czwarte =   Math.abs(to_trzecie - to_pierwsze);
    
    if(iloscZmiennych == 3)
        wariancja_sklad_reszt = to_czwarte/6;
    else 
        wariancja_sklad_reszt = to_czwarte/7;
        
    document.getElementById("wariancja_sklad_reszt").innerHTML = `${wariancja_sklad_reszt.toFixed(4)}`; 

    let odchyl_stand_sk_reszt = Math.sqrt(wariancja_sklad_reszt);
    document.getElementById("odchylenie_standardowe_sklad_reszt").innerHTML = `${odchyl_stand_sk_reszt.toFixed(4)}`; 

    //Błędy średnie szacunku parametrów
    let bledy_srednie_szacunku_par = [];
    let pier_D2 = [];
    for(let i = 0; i < XTX_odw.length; i++){
        bledy_srednie_szacunku_par[i] = [];
        for(let j = 0; j < XTX_odw.length; j++){
            bledy_srednie_szacunku_par[i][j] = XTX_odw[i][j] * wariancja_sklad_reszt;

        }
        pier_D2[i] = Math.sqrt(bledy_srednie_szacunku_par[i][i]);
    }

    if(iloscZmiennych == 3) {
        document.getElementById("bledy_srednie_szacunku_parametrow").innerHTML = `(a${klucz[0]+1} : ${(pier_D2[0]).toFixed(4)}) (a${klucz[1]+1} : ${(pier_D2[1]).toFixed(4)}) (a${klucz[2]+1} : ${(pier_D2[2]).toFixed(4)}) (a0: ${(pier_D2[3]).toFixed(4)})`; 
    } else {
        document.getElementById("bledy_srednie_szacunku_parametrow").innerHTML = `(a${klucz[0]+1} : ${(pier_D2[0]).toFixed(4)}) (a${klucz[1]+1} : ${(pier_D2[1]).toFixed(4)}) (a0: ${(pier_D2[2]).toFixed(4)})`; 
    }
    document.getElementById("wspolczynnik_zmiennosci_losowej").innerHTML = `${(odchyl_stand_sk_reszt*100/macierzY_srednia).toFixed(2)}%`; 

    //Współczynnik determinacji
    let Yt = [];
    let Yyes = [];
    let Ytyes = [];
    let wsp_det_licznik = 0, wsp_det_mianownik = 0;
    
    for(let i = 0; i < macierzY.length; i++){
        if(iloscZmiennych == 3)
            Yt[i] =  KMNK[0] * X[0][i] + KMNK[1] * X[1][i] + KMNK[2] * X[2][i] + KMNK[3];
        else 
            Yt[i] =  KMNK[0] * X[0][i] + KMNK[1] * X[1][i] + KMNK[2];
        
        Yyes[i] = macierzY[i] - macierzY_srednia;
        Ytyes[i] = Yt[i] - macierzY_srednia;

        wsp_det_licznik += Math.pow(Yt[i] - (math.sum(macierzY)/10), 2);
        wsp_det_mianownik += Math.pow(macierzY[i] - (math.sum(macierzY)/10), 2);

    }

    let wspolczynnik_determinacji = (wsp_det_licznik / wsp_det_mianownik).toFixed(4)* 100;
    
    document.getElementById("wspolczynnik_determinancji").innerHTML = `${wspolczynnik_determinacji.toFixed(2)}%`; 
    
    
}

//Podstawy R, R0 itp
function oblicz_srednia(tablica) {
    let sum = 0;
    for( var i = 0; i < tablica.length; i++ ){
        sum += parseFloat( tablica[i], 10 ); //don't forget to add the base
    }
    return sum/tablica.length;

}

function oblicz_wariancja(wartosc_srednia) {
    let wartosc_wariancja = [];

    for (i = 0; i < macierzX.length; i++)
    {
        wartosc_wariancja[i] = 0;
        for (j = 0; j < macierzX[i].length; j++)
        {   
            wartosc_wariancja[i] += Math.pow((macierzX[i][j] - wartosc_srednia[i]),2);
            
        }
        
        wartosc_wariancja[i] /= (macierzX[i].length - 1);
    }
    return wartosc_wariancja;
}

function oblicz_odchylenie(wariancja) {
    let wartosc_odchylenia = [];

    for (i = 0; i < macierzX.length; i++)
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
        for(j = 0; j < macierzX[i].length; j++){
            licznik += (macierzX[i][j] - macierzX_srednia) * (macierzY[j] - macierzY_srednia);
        }
        for(j = 0; j < macierzX[i].length; j++){
            m1 += Math.pow((macierzX[i][j] - macierzX_srednia),2);
            m2 += Math.pow((macierzY[j]  - macierzY_srednia),2);
        }

        mianownik = Math.sqrt(m1 * m2);
        wsp_kor_r[i] = licznik / mianownik;
    }
    return wsp_kor_r;
}

function oblicz_wsp_kor_r(){
    let wsp_kor_r = [];
    macierzX_srednia = [];
    macierzY_srednia = oblicz_srednia(macierzY);
    
    for (i = 0; i < macierzX.length; i++)
    {
        wsp_kor_r[i] = [];
        macierz1_srednia = oblicz_srednia(macierzX[i] ).toFixed(2);
        
        for (j = 0; j < macierzX.length; j++)
        {
            macierz2_srednia = oblicz_srednia(macierzX[j] ).toFixed(2);
            let licznik = 0;
            let m1 = 0;
            let m2 = 0;

            for (k = 0; k < macierzX[i].length; k++){
                licznik += (macierzX[i][k] - macierz1_srednia) * (macierzX[j][k] - macierz2_srednia);
            }

            for (k = 0; k < macierzX[i].length; k++){
                m1 += Math.pow((macierzX[i][k] - macierz1_srednia),2);
                m2 += Math.pow((macierzX[j][k]  - macierz2_srednia),2);
            }
            
            mianownik = Math.sqrt(m1 * m2);  

            wsp_kor_r[i][j] = licznik / mianownik;
            if( i == j ) wsp_kor_r[i][j] = licznik / mianownik;

        }
    }
    return wsp_kor_r;
}
//(koniec) Podstawy R, R0 itp

//Metoda współczynników korelacji wielorakiej (Pawłowskiego)

function oblicz_wsp_korelacji_wielorakiej(){
    
    let K = [], R = [], W = [], detW = [], detR = [], E = [];
    let E_kor = [];
    
    if(iloscZmiennych == 2) {
        K[0] = [tabela_wsp_kor_r0[0], tabela_wsp_kor_r0[1]];
        K[1] = [tabela_wsp_kor_r0[0], tabela_wsp_kor_r0[2]];
        K[2] = [tabela_wsp_kor_r0[0], tabela_wsp_kor_r0[3]];
        K[3] = [tabela_wsp_kor_r0[1], tabela_wsp_kor_r0[2]];
        K[4] = [tabela_wsp_kor_r0[1], tabela_wsp_kor_r0[3]];
        K[5] = [tabela_wsp_kor_r0[2], tabela_wsp_kor_r0[3]];
        
    
    
    
        
        R[0] = [[1, tabela_wsp_kor_r[0][1]], [tabela_wsp_kor_r[0][1], 1]];
        R[1] = [[1, tabela_wsp_kor_r[0][2]], [tabela_wsp_kor_r[0][2], 1]];
        R[2] = [[1, tabela_wsp_kor_r[0][3]], [tabela_wsp_kor_r[0][3], 1]];
        R[3] = [[1, tabela_wsp_kor_r[1][2]], [tabela_wsp_kor_r[1][2], 1]];
        R[4] = [[1, tabela_wsp_kor_r[1][3]], [tabela_wsp_kor_r[1][3], 1]];
        R[5] = [[1, tabela_wsp_kor_r[2][3]], [tabela_wsp_kor_r[2][3], 1]];
    
    
        W[0] = [[1, K[0][0], K[0][1]], 
                [K[0][0], 1, R[0][0][1]], 
                [K[0][1], R[0][0][1], 1]];
        W[1] = [[1, K[1][0], K[1][1]], [K[1][0], 1, R[1][0][1]], [K[1][1], R[1][0][1], 1]];
        W[2] = [[1, K[2][0], K[2][1]], [K[2][0], 1, R[2][0][1]], [K[2][1], R[2][0][1], 1]];
        W[3] = [[1, K[3][0], K[3][1]], [K[3][0], 1, R[3][0][1]], [K[3][1], R[3][0][1], 1]];
        W[4] = [[1, K[4][0], K[4][1]], [K[4][0], 1, R[4][0][1]], [K[4][1], R[4][0][1], 1]];
        W[5] = [[1, K[5][0], K[5][1]], [K[5][0], 1, R[5][0][1]], [K[5][1], R[5][0][1], 1]];


        for(let i = 0; i < R.length; i++) {
            detR[i] = Math.abs(oblicz_wyznacznik(R[i], R[i].length));
        }

        for(let i = 0; i < W.length; i++){
            detW[i] = Math.abs(oblicz_wyznacznik(W[i], W[i].length));
        }
        
        //Współczynnik korelacji        
        for(let i = 0; i < W.length; i++){
            E[i] = Math.sqrt(1 - ( detW[i] / detR[i]));
            E_kor[i] = Math.sqrt(1 - ( detW[i] / detR[i]));
        }
    }
    if(iloscZmiennych == 3) {
        K[6] = [tabela_wsp_kor_r0[0], tabela_wsp_kor_r0[1], tabela_wsp_kor_r0[2]];
        K[7] = [tabela_wsp_kor_r0[0], tabela_wsp_kor_r0[1], tabela_wsp_kor_r0[3]];
        K[8] = [tabela_wsp_kor_r0[0], tabela_wsp_kor_r0[2], tabela_wsp_kor_r0[3]];
        K[9] = [tabela_wsp_kor_r0[1], tabela_wsp_kor_r0[2], tabela_wsp_kor_r0[3]];


        // R[C[i, 0] - 1, 
        // C[i, 1] - 1]

        R[6] = [[1, tabela_wsp_kor_r[0][1], tabela_wsp_kor_r[0][2]], 
                [tabela_wsp_kor_r[0][1], 1, tabela_wsp_kor_r[1][2]],
                [tabela_wsp_kor_r[0][2], tabela_wsp_kor_r[1][2], 1]];

        R[7] = [[1, tabela_wsp_kor_r[0][1], tabela_wsp_kor_r[0][3]], 
                [tabela_wsp_kor_r[0][1], 1, tabela_wsp_kor_r[1][3]],
                [tabela_wsp_kor_r[0][3], tabela_wsp_kor_r[1][3], 1]];

        R[8] = [[1, tabela_wsp_kor_r[0][2], tabela_wsp_kor_r[0][3]], 
                [tabela_wsp_kor_r[0][2], 1, tabela_wsp_kor_r[2][3]],
                [tabela_wsp_kor_r[0][3], tabela_wsp_kor_r[2][3], 1]];

        R[9] = [[1, tabela_wsp_kor_r[1][2], tabela_wsp_kor_r[1][3]], 
                [tabela_wsp_kor_r[1][2], 1, tabela_wsp_kor_r[2][3]],
                [tabela_wsp_kor_r[1][3], tabela_wsp_kor_r[2][3], 1]];



        // R[7] = [[1, tabela_wsp_kor_r[2][3]], [tabela_wsp_kor_r[2][3], 1]];
        // R[8] = [[1, tabela_wsp_kor_r[2][3]], [tabela_wsp_kor_r[2][3], 1]];
        // R[9] = [[1, tabela_wsp_kor_r[2][3]], [tabela_wsp_kor_r[2][3], 1]];


        W[6] = [[1, K[6][0], K[6][1], K[6][2]], 
                [K[6][0], 1, R[6][0][1], R[6][0][2]], 
                [K[6][1], R[6][0][1], 1, R[6][1][2]], 
                [K[6][2], R[6][0][2], R[6][1][2], 1]];

        W[7] = [[1, K[7][0], K[7][1], K[7][2]], 
                [K[7][0], 1, R[7][0][1], R[7][0][2]], 
                [K[7][1], R[7][0][1], 1, R[7][1][2]], 
                [K[7][2], R[7][0][2], R[7][1][2], 1]];
                
        W[8] = [[1, K[8][0], K[8][1], K[8][2]], 
                [K[8][0], 1, R[8][0][1], R[8][0][2]], 
                [K[8][1], R[8][0][1], 1, R[8][1][2]], 
                [K[8][2], R[8][0][2], R[8][1][2], 1]];

        W[9] = [[1, K[9][0], K[9][1], K[9][2]], 
                [K[9][0], 1, R[9][0][1], R[9][0][2]], 
                [K[9][1], R[9][0][1], 1, R[9][1][2]], 
                [K[9][2], R[9][0][2], R[9][1][2], 1]];

        
        for(let i = 6; i < R.length; i++) {
            detR[i] = Math.abs(oblicz_wyznacznik(R[i], R[i].length));
        }
    
        for(let i = 6; i < W.length; i++){
            detW[i] = Math.abs(oblicz_wyznacznik(W[i], W[i].length));
        }
        
        //Współczynnik korelacji        
        for(let i = 6; i < W.length; i++){
            E[i] = Math.sqrt(1 - ( detW[i] / detR[i]));
            E_kor[i-6] = Math.sqrt(1 - ( detW[i] / detR[i]));
        }
    }

    wyswietl_korelacje(E);

    let wskaznik = E.indexOf(Math.max(...E_kor));

    return wskaznik;
}

function wyswietl_korelacje(korelacje){

    $("#KorelationTable th").remove(); 
    $("#KorelationTable td").remove(); 

    let KorelationTable = document.getElementById("KorelationTable");
    if(iloscZmiennych == 2) {
        var th = document.createElement('th');
        var th_text = document.createTextNode(`K1 = X1, X2`);
        th.appendChild(th_text);
        KorelationTable.appendChild(th);

        var th = document.createElement('th');
        var th_text = document.createTextNode(`K2 = X1, X3`);
        th.appendChild(th_text);
        KorelationTable.appendChild(th);

        var th = document.createElement('th');
        var th_text = document.createTextNode(`K3 = X1, X4`);
        th.appendChild(th_text);
        KorelationTable.appendChild(th);

        var th = document.createElement('th');
        var th_text = document.createTextNode(`K4 = X2, X3`);
        th.appendChild(th_text);
        KorelationTable.appendChild(th);

        var th = document.createElement('th');
        var th_text = document.createTextNode(`K5 = X2, X4`);
        th.appendChild(th_text);
        KorelationTable.appendChild(th);

        var th = document.createElement('th');
        var th_text = document.createTextNode(`K6 = X3, X4`);
        th.appendChild(th_text);
        KorelationTable.appendChild(th);
        var tr = document.createElement('tr');   
        KorelationTable.appendChild(tr);

        for(let i = 0; i < 6; i++) {
            var td = document.createElement('td');
            var td_text = document.createTextNode(korelacje[i].toFixed(4));
            td.appendChild(td_text);
            KorelationTable.appendChild(td);
        }
    }

    if(iloscZmiennych == 3) {

        var tr = document.createElement('tr');
        KorelationTable.appendChild(tr);


        var th = document.createElement('th');
        var th_text = document.createTextNode(`K7 = X1, X2, X3`);
        th.appendChild(th_text);
        KorelationTable.appendChild(th);
    
        var th = document.createElement('th');
        var th_text = document.createTextNode(`K8 = X1, X2, X4`);
        th.appendChild(th_text);
        KorelationTable.appendChild(th);
    
        var th = document.createElement('th');
        var th_text = document.createTextNode(`K9 = X1, X3, X4`);
        th.appendChild(th_text);
        KorelationTable.appendChild(th);
    
        var th = document.createElement('th');
        var th_text = document.createTextNode(`K10 = X2, X3, X4`);
        th.appendChild(th_text);
        KorelationTable.appendChild(th);

        var tr = document.createElement('tr');   
        KorelationTable.appendChild(tr);

        for(let i = 6; i < 10; i++) {
            var td = document.createElement('td');
            var td_text = document.createTextNode(korelacje[i].toFixed(4));
            td.appendChild(td_text);
            KorelationTable.appendChild(td);
        }
    

    }
}

function oblicz_wyznacznik(macierz, n){
    let det = 0;
    let submatrix = [];
    for(let i = 0; i < n; i++) submatrix[i] = [];

    if (n == 2)
        return ((macierz[0][0] * macierz[1][1]) - (macierz[1][0] * macierz[0][1]));
    else {
        for (let x = 0; x < n; x++) {
            let subi = 0;
            for (let i = 1; i < n; i++) {
                let subj = 0;
                for (let j = 0; j < n; j++) {
                    if (j == x)
                    continue;
                    submatrix[subi][subj] = macierz[i][j];
                    subj++;
                }
                subi++;
            }
            det = det + (Math.pow(-1, x) * macierz[0][x] * oblicz_wyznacznik( submatrix, n - 1 ));
        }
    }
    return det;
}
//(koniec)Metoda współczynników korelacji wielorakiej (Pawłowskiego)

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