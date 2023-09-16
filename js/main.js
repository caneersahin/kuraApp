$(document).ready(function () {
    $("#kuraListInput").keypress(function (event) {
        var inputValue = event.charCode;
        var turkishKey = [199, 231, 286, 287, 304, 305, 214, 246, 350, 351, 220, 252]
        if (!(inputValue >= 65 && inputValue <= 167) && (inputValue != 32 && inputValue != 0) && (turkishKey.indexOf(inputValue) == -1)) {
            event.preventDefault();
        }
    });
});

function kuraCek() {
    var kazananlarListesi = [];
    var listInput = $("#kuraListInput").val();
    var kazanacakSayisi = parseInt($("#kazananSayisi").val())
    strInput = listInput.replace(/\s{1,}/g, '-');

    listInput = strInput.split("-");
    var number = 0;
    listInput.forEach(element => {
        if (element == "" || element == "-") {
            listInput.splice(number, 1)
        }
        number++
    });

    if (listInput.length < 1 || listInput == "") {
        Swal.fire({
            title: '',
            text: 'Lütfen katılımcı ekleyiniz.',
            confirmButtonText: 'Tamam',
            confirmButtonColor: '#d33',
        })
        return;
    }

    if (kazanacakSayisi < 1 || $("#kazananSayisi").val() == "") {
        Swal.fire({
            title: '',
            text: 'Lütfen kazanacak kişi sayısı giriniz.',
            confirmButtonText: 'Tamam',
            confirmButtonColor: '#d33',
        })
        return;
    }

    if (kazanacakSayisi > listInput.length) {
        Swal.fire({
            title: '',
            text: 'Kazanacak kişi sayısı, katılımcılardan çok olamaz.',
            confirmButtonText: 'Tamam',
            confirmButtonColor: '#d33',
        })
        return;
    }
    for (let i = 0; i < kazanacakSayisi; i++) {
        var winnerItem = listInput[Math.floor(Math.random() * listInput.length)];
        kazananlarListesi.push(winnerItem)
        var sira = listInput.indexOf(winnerItem)
        listInput.splice(sira, 1)
    }
    var html = ""
    var kuralar = [];
    var list = [];
    kazananlarListesi.forEach(element => {
        html += `
        <li>${element}</li>`
        list.push(element)
    });

    var history = sessionStorage.getItem('kazananlarListesi');
    if (history == null) {
        var kura = {
            "kuraNo": 1,
            "kazananlar": list,
            "dateTime":new Date().toLocaleString()
        }
        kuralar.push(kura)
        sessionStorage.setItem('kazananlarListesi', JSON.stringify(kuralar));
    } else {
        history = JSON.parse(history)
        var kura = {
            "kuraNo": history.length + 1,
            "kazananlar": list,
            "dateTime":new Date().toLocaleString()

        }
        history.push(kura);
        sessionStorage.setItem('kazananlarListesi', JSON.stringify(history));
    }

    Swal.fire({
        title: '',
        text: 'Kazananlar',
        html: html,
        confirmButtonText: 'Tamam'
    })
}



function gecmisKuralar() {
    $("#kazananTable").html("")
    var history = sessionStorage.getItem('kazananlarListesi');
    if (history == null) {
        Swal.fire({
            title: '',
            text: 'Henüz Bir Kura Çekmediniz.',
            confirmButtonText: 'Tamam',
            confirmButtonColor: '#d33',
        })
        return;
    } else {
        history = JSON.parse(history)
        var html = "";
        var names = "";

        history.forEach(element => {
            var i =0;
            names = "";
            html = `
                    <tr>
                    <td>${element.kuraNo}</td>`
            element.kazananlar.forEach(item => {
                i++
                if(element.kazananlar.length !=i){
                    names += item + ", ";
                }else{
                    names += item ;
                }
            });

            html += 
                `<td>${names}</td>
                <td>${element.dateTime}
                 </tr>`
            $("#kazananTable").append(html)
        })

        $("#gecmisKuralar").modal("show")
    }
}
