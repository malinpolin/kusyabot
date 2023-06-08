let tg = window.Telegram.WebApp;

tg.expand(); //расширяем на все окно
tg.MainButton.text = "Закрыть";
tg.MainButton.textColor = "#ffffff";
tg.MainButton.color = "#730593";

window.answersDone = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
window.currentImageIndex = 0;
const answers = ["топ ган", "потрошители", "константин", "чудо", "гладиатор", "начало", "мементо", "достать ножи", "семь жизней", "комната", "астрал"];
const letters = [2, 4, 3, 1, 3, 5, 2, 9, 10, 0, 4];
const maxChars = 16;
var results = ['', '', '', '', '', '', '', '', '', '', ''];
var old_input_value = '';


const good_gifs = {
    0: '/static/img/good_gifs/1.gif',
    1: '/static/img/good_gifs/2.gif',
    2: '/static/img/good_gifs/3.gif',
    3: '/static/img/good_gifs/4.gif',
    4: '/static/img/good_gifs/5.gif',
    5: '/static/img/good_gifs/6.gif',
    6: '/static/img/good_gifs/7.gif',
    7: '/static/img/good_gifs/8.gif',
    8: '/static/img/good_gifs/9.gif',
    9: '/static/img/good_gifs/10.gif',
    10: '/static/img/good_gifs/11.gif',
}

const try_gifs = [
    '/static/img/try_gifs/1.gif', '/static/img/try_gifs/2.gif',
    '/static/img/try_gifs/3.gif', '/static/img/try_gifs/4.gif',
    '/static/img/try_gifs/5.gif', '/static/img/try_gifs/6.gif',
    '/static/img/try_gifs/7.gif', '/static/img/try_gifs/8.gif',
    '/static/img/try_gifs/10.gif',
    '/static/img/try_gifs/11.gif', '/static/img/try_gifs/12.gif',
    '/static/img/try_gifs/13.gif', '/static/img/try_gifs/14.gif',
    '/static/img/try_gifs/15.gif', '/static/img/try_gifs/16.gif',
    '/static/img/try_gifs/17.gif', '/static/img/try_gifs/18.gif',
]

const helps = {
        0: [
            'Этот фильм позиционируется как прямое продолжение кинокартины 1986-го года.',
            'Актёр, сыгравший одного из главных героев, в 1994 году получил лицензию пилота.',
            'В фильме минимальное количество съемок на зеленом экране, большинство сцен сделаны во время реальных полетов.'
        ],
        1: [
            'Жанр: фантастика, боевик, триллер.\nГод: 2009.',
            'Задолженность главной героини - практически всё, кроме губ и сердца.',
            'Фильм про "необычных" коллекторов, которые на законном основании могут убить человека.'
        ],
        2: [
            'Жанр: фэнтези, ужасы, боевик, детектив.\nГод: 2005.',
            'В главной роли - Киану Ривз.',
            'Слоган фильма: "Ад и Рай держат пари на Земле"'
        ],
	    3: [
            'Жанр: драма, семейный.\nГод: 2017.',
            'Главный герой фильма родился с редкой деформацией лица и перенёс 27 различных операций.',
            'В этом фильме снялся актер из "Марли и я".'
        ],
	    4: [
            'Жанр: история, боевик, драма, приключения.\n Год: 2000.',
            'Ты пересмотрел этот фильм после просмотра сериала со схожей тематикой.',
            'Слоган фильма начинается с: "Генерал, ставший рабом..."'
        ],
	    5: [
            'Актёр, сыгравший главного героя, получил свой первый "Оскар" с шестой попытки.',
            'Слоган фильма: "Твой разум - место преступления."',
            'Режиссер и сценарист этого фильма: Кристофер Нолан.'
        ],
	    6: [
            'Режиссер и сценарист этого фильма: Кристофер Нолан.',
            'Слоган фильма: "Некоторые воспоминания лучше забыть."',
            'Название болезни главного героя — антероградная амнезия.'
        ],
	    7: [
            'Жанр: детектив, комедия, драма, криминал.\nГод: 2019.',
            'Недавно ты посмотрел вторую часть этого фильма.',
            'Слоган фильма: "У каждого свой мотив."'
        ],
	    8: [
            'Главный герой "убил" свою невесту.',
            'В конце фильма главный герой совершает самоубийство.',
            'Слоган фильма: "Они не знакомы. У них разные судьбы. Но у них одна тайна."'
        ],
	    9: [
            'Идея фильма основана на реальной истории о пятилетнем Феликсе, одном из детей так называемого «дела Йозефа Фритцля».',
            'Актриса, сыгравшая главную героиню, уединилась на целый месяц и села на строжайшую диету, чтобы лучше понять психологическое и физическое состояние своей героини.',
            'Действие практически всего фильма происходит в одном помещении.'
        ],
	    10: [
            'Жанр: ужасы, триллер.\nГод: 2010.',
            'У фильма есть вторая, третья и четвертые части.',
            'Главный герой унаследовал "необычную" способность "летать во сне" от отца.'
        ],
	};

var helps_uses = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
    6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
}

const allImages = [
    "/static/img/films/1.jpg", "/static/img/films/2.jpg", "/static/img/films/3.jpg",
    "/static/img/films/4.jpg", "/static/img/films/5.jpg", "/static/img/films/6.jpg",
    "/static/img/films/7.jpg", "/static/img/films/8.jpg", "/static/img/films/9.jpg",
    "/static/img/films/10.jpg", "/static/img/films/11.jpg"
];

/*
document.addEventListener("DOMContentLoaded", () => {
    const images = new Array();
    function preloadImages(...images) {
        images.forEach((image, i) => {
            image = new Image();
            image.src = preloadImages.arguments[i];
        });
    };
    // Предварительная загрузка нужных картинок
    try_gifs.forEach(function(value, index, arr){
        preloadImages(value);
    });
    allImages.forEach(function(value, index, arr){
        preloadImages(value);
    });
    for (const [key, value] of Object.entries(good_gifs)) {
        preloadImages(value);
    };
});
*/

document.getElementById("image").src = allImages[window.currentImageIndex];
document.getElementById("cur-question").innerHTML = window.currentImageIndex + 1;
document.getElementById("max-question").innerHTML = allImages.length;
document.getElementById('text').maxLength = answers[window.currentImageIndex].length;
CreateTable(window.currentImageIndex)


function LastPage() {
    document.getElementById('header').style = "display:none;";
    document.getElementById('question').style = "display:none;";
    document.getElementById("buttons-2").style = 'display:none;';
    document.getElementById('end').style = "display:block;";
    CreateEndTable();
    tg.MainButton.show();
    Telegram.WebApp.onEvent('mainButtonClicked', function(){
      tg.sendData('success');
    });
}


function CreateTable(ind) {
    if (ind >= 0){
        var del_table = document.getElementById("tbl");
        if (del_table) {
          del_table.remove();
        }
    }
    let table = document.createElement('table');
    table.id = "tbl";
    let tbody = document.createElement('tbody');
    table.appendChild(tbody);
    let answer = answers[ind];
    document.getElementById('table').appendChild(table);
    let cells_count = answer.length;

    table.className="style-table";

    let row = document.createElement('tr');
    for (let i = 0; i < cells_count; i++){
        let cell = document.createElement('td');
        if (ind < 11) {
            if (i == letters[window.currentImageIndex]) {
                cell.className="style-td style-td-tg";
            }
            else {
                cell.className="style-td";
            }
            cell.innerHTML = '';
            if (answer[i] == ' ') {
                cell.style="border: none; background-color: rgba(255,255,255,0);";
            }
        }
        row.appendChild(cell);
    }
    tbody.appendChild(row);

}

function CreateEndTable() {
    let indexes = [8, 6, 7, 9, 7, 5, 8, 1, 0, 10, 6]
    let table = document.createElement('table');
    table.id = "tbl";
    let tbody = document.createElement('tbody');
    table.appendChild(tbody);
    document.getElementById('end_tbl').appendChild(table);
    table.className="style-table";

    for (let i = 0; i < answers.length; i ++){
        let row = document.createElement('tr');
        let k = 0;
        for (let j = 0; j <= maxChars; j ++){
            let cell = document.createElement('td');
            if (j >= indexes[i] && j < (indexes[i] + answers[i].length)) {
                if (j == indexes[i] + letters[i]){
                    cell.className="style-td style-td-tg";
                }
                else {
                    cell.className="style-td";
                }
                if (answers[i][k] == ' ') {
                    cell.style="border: none; background-color: rgba(255,255,255,0); width: 10px;";
                }
                else {
                    cell.style="width: 10px;";
                }
                cell.innerHTML = answers[i][k].toUpperCase();
                k ++;
            }
            row.appendChild(cell);   
        }
        tbody.appendChild(row);  
    }
}

function isAllQuestionsDone(){
    return window.answersDone.reduce(function(sum, elem) {
        return sum + elem;
    }, 0) == answers.length - 1;
}


function FillAnswerRow() {
    let text = document.getElementById("text");
    const cells = document.getElementById("tbl").getElementsByTagName("td");
    var tmp_value = '';
    var input_value = text.value;
    if (input_value.length < old_input_value.length) {
      for (let i = input_value.length; i < old_input_value.length && i < cells.length; i++) {
        cells[i].innerHTML = '';
      }
    }
    let answer = answers[window.currentImageIndex];
    let j = 0;

    while (j < input_value.length) {
      if (input_value[j] == ' ' && answer[j] != ' '){
          text.value = input_value.substr(0, j);
        }
      else if (answer[j] == ' ' && input_value[j] != ' ') {
        tmp_value = input_value.substr(0, j) + ' ' + input_value[j];
        input_value = tmp_value;
        text.value = tmp_value;
        cells[j].innerHTML = ' ';
        j ++;
      }
      cells[j].innerHTML = input_value[j].toUpperCase();
      j ++;
    }
    results[window.currentImageIndex] = input_value;
    old_input_value = input_value;
}


function NEXTClick() {
    if (window.currentImageIndex == (allImages.length - 1)){
        if (isAllQuestionsDone()) {
          LastPage();
        }
        else {
            Swal.fire({
                title: 'Не все вопросы отгаданы!',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: "Завершить",
                cancelButtonText: "Сейчас сделаю!",
                confirmButtonColor: "#1b04c0",
                cancelButtonColor: "#730593",
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed){
                    LastPage();
                }
            });
        }
    }
    else {
        if (window.currentImageIndex == (allImages.length - 2)){
          document.getElementById('btn-next').style = "display:none;";
          document.getElementById('btn-back').style = "display:block;";
        }
        else {
          document.getElementById('btn-next').style = "display:block;";
          document.getElementById('btn-back').style = "display:block;";
        };
        document.getElementById("buttons").style = 'display:block-inline;';
        document.getElementById("buttons-2").style = 'display:none;';
        const image = document.getElementById("image");
        window.currentImageIndex += 1;
        image.src = allImages[window.currentImageIndex];
        CreateTable(window.currentImageIndex);
        if (window.answersDone[window.currentImageIndex] == 1) {
          document.getElementById("text").value = answers[window.currentImageIndex];
          document.getElementById("text").oninput();
          document.getElementById("text").style = 'display:none;';
          document.getElementById("buttons").style = 'display:none;';
          document.getElementById("buttons-2").style = 'display:block-inline;';
        }
        else {
          document.getElementById("text").value = "";
          document.getElementById("text").oninput();
          document.getElementById("text").style = 'display:block;';
          document.getElementById("buttons").style = 'display:block-inline;';
          document.getElementById("buttons-2").style = 'display:none;';
        };
        document.getElementById("cur-question").innerHTML = window.currentImageIndex + 1;
        document.getElementById("max-question").innerHTML = allImages.length;
        document.getElementById('text').maxLength = answers[window.currentImageIndex].length;
    }
}


function CHECKClick()
{
    var v_title = "Попробуй еще!";
    var v_imageUrl = try_gifs[Math.floor(Math.random()*try_gifs.length)];
    var v_showCancelButton = true;
    var v_showConfirmButton = false;
    if (answers[window.currentImageIndex] == results[window.currentImageIndex]){
        v_title = "Умничка!";
        v_imageUrl = good_gifs[window.currentImageIndex];
        v_showCancelButton = false;
        v_showConfirmButton = true;
        window.answersDone[window.currentImageIndex] = 1;
    }
    Swal.fire({
        title: v_title,
        imageUrl: v_imageUrl,
        // imageWidth: 550,
        imageHeight: 225,
        showCancelButton: v_showCancelButton,
        showConfirmButton: v_showConfirmButton,
        confirmButtonText: "Далее",
        cancelButtonText: "ОК",
        confirmButtonColor: "#1b04c0",
        cancelButtonColor: "#730593",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed){
            NEXTClick();
        }
      });
}


function BACKClick(){
    if (window.currentImageIndex == 1){
        document.getElementById('btn-back').style = "display:none;";
        document.getElementById('btn-next').style = "display:block;";
    }
    else {
        document.getElementById('btn-back').style = "display:block;";
        document.getElementById('btn-next').style = "display:block;";
    };

    const image = document.getElementById("image");
    window.currentImageIndex -= 1;
    image.src = allImages[window.currentImageIndex];
    CreateTable(window.currentImageIndex);
    if (window.answersDone[window.currentImageIndex] == 1) {
      document.getElementById("text").value = answers[window.currentImageIndex];
      document.getElementById("text").oninput();
      document.getElementById("text").style = 'display:none;';
      document.getElementById("buttons").style = 'display:none;';
      document.getElementById("buttons-2").style = 'display:block-inline;';
    }
    else {
      document.getElementById("text").value = "";
      document.getElementById("text").oninput();
      document.getElementById("text").style = 'display:block;';
      document.getElementById("buttons").style = 'display:block-inline;';
      document.getElementById("buttons-2").style = 'display:none;';
    };
    document.getElementById("cur-question").innerHTML = window.currentImageIndex + 1;
    document.getElementById("max-question").innerHTML = allImages.length;
    document.getElementById('text').maxLength = answers[window.currentImageIndex].length;
}


function EXITClick() {
    var v_text = "Вы уверены, что хотите пропустить это задание?";
    var v_showCancelButton = true;
    var v_showConfirmButton = true;
    Swal.fire({
        text: v_text,
        showCancelButton: v_showCancelButton,
        showConfirmButton: v_showConfirmButton,
        confirmButtonText: "Да",
        cancelButtonText: "Нет",
        confirmButtonColor: "#730593",
        cancelButtonColor: "#1b04c0",
    }).then((result) => {
        if (result.isConfirmed){
            LastPage();
        }
    });
}


function HELPClick() {
    var v_title, v_text, v_icon, v_cancelButtonText,
        v_showConfirmButton, v_confirmButtonText;
    if (helps_uses[window.currentImageIndex] < helps[window.currentImageIndex].length) {
        v_title = "Подсказка " + (helps_uses[window.currentImageIndex] + 1) + " из " + helps[window.currentImageIndex].length;
        v_text = helps[window.currentImageIndex][helps_uses[window.currentImageIndex]];
        v_icon = 'question';
        v_cancelButtonText = "Понял";
        v_showConfirmButton = false;
        helps_uses[window.currentImageIndex] ++;
    }
    else {
        v_title = 'Подсказки закончились!';
        v_text = '';
        v_icon = 'error';
        v_confirmButtonText = "Ответ";
        v_cancelButtonText = "ОКЕЙ(";
        v_showConfirmButton = true;
    }

    Swal.fire({
        title: v_title,
        icon: v_icon,
        text: v_text,
        showCancelButton: true,
        showConfirmButton: v_showConfirmButton,
        cancelButtonText: v_cancelButtonText,
        confirmButtonText: v_confirmButtonText,
        cancelButtonColor: "#730593",
        confirmButtonColor: "#1b04c0",
      }).then((result) => {
        if (result.isConfirmed){
            Swal.fire({
                title: answers[window.currentImageIndex],
                icon: 'success',
                text: '',
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: 'ОК',
                cancelButtonColor: "#730593",
              });
              document.getElementById("text").value = answers[window.currentImageIndex];
              document.getElementById("text").oninput();
              document.getElementById("buttons").style = 'display:none;';
              document.getElementById("buttons-2").style = 'display:block;';
              window.answersDone[window.currentImageIndex] = 1;
      }
    });

}
