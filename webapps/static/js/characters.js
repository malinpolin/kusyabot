let tg = window.Telegram.WebApp;

tg.expand(); //расширяем на все окно

tg.MainButton.text = "Закрыть";
tg.MainButton.textColor = "#ffffff";
tg.MainButton.color = "#986eda";

var answers = ["шерлок холмс", "рюк", "капитан америка", "дива", "уолтер уайт", "дэдпул", "гон фрикс", "джон уик"];
window.answers = answers;
window.results = ['', '', '', '', '', '', '', ''];


var good_gifs = {
    0: '/static/img/good_gifs/21.gif',
    1: '/static/img/good_gifs/22.gif',
    2: '/static/img/good_gifs/23.gif',
    3: '/static/img/good_gifs/24.gif',
    4: '/static/img/good_gifs/25.gif',
    5: '/static/img/good_gifs/26.gif',
    6: '/static/img/good_gifs/27.gif',
    7: '/static/img/good_gifs/28.gif',
    8: '/static/img/good_gifs/29.gif'
}

var try_gifs = [
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

var helps = {
        0: [
            'Он обладает превосходными дедуктивными способностями.',
            'Его брат работает на британское правительство.',
            'Этого персонажа сыграли Бенедикт Камбербэтч и Роберт Дауни-младший.'
        ],
        1: [
            'Категорически не любит скуку.', 
            'Одна из его слабостей - яблоки.', 
            'Принадлежит к расе внепространственных существ, которые выживают, убивая людей и тем самым продлевают свою жизнь.'
        ],
        2: [
            'Был превращён из слабого юноши в «совершенный» образец человеческого развития и состояния.', 
            'Его средство защиты сделано из вибраниума.',
            'Персонаж киновселенной Marvell.' 
        ],
	    3: [
            'В прошлом - профессиональный игрок "Mecha Guardian V".', 
            'Работает пилотом в составе южнокорейской армии.',
            'Настоящее имя - Хана Сон.'
        ],
	    4: [
            'В прошлом - учитель химии в школе.', 
            'У него диагностировали неоперабельный рак лёгких.',
            'Его прозвище - Хайзенберг.' 
        ],
	    5: [
            'В прошлом - солдат спецназа, подрабатывающий наёмником в Нью-Йорке.',
            'Он любит мультфильмы, туалетный юмор, Скиболл, классическую музыку, телевизионные шоу, рэп и американскую поп-культуру.',
            'Принял участие в экспериментальном лечении рака. Побочный эффект экспериментов - его тело и лицо обезображены.'
        ],
	    6: [
            'Его характер: простодушный, добрый, всегда ищет приключения.', 
            'Любимая игра - "Камень-ножницы-бумага".',
            'Сдал экзамен, чтобы найти своего отца.' 
        ],
	    7: [
            'Некоторые источники сообщают, что на его счету 306 убийств.', 
            'Посмертный подарок его жены - щенок бигля.',
            'Его любимый отель - «Континенталь».' 
        ]
	};

var helps_uses = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
    6: 0, 7: 0,
}

const pics = {
    allImages: [
        "/static/img/characters/1.jpg", "/static/img/characters/2.jpg", "/static/img/characters/3.jpg", 
        "/static/img/characters/4.jpg", "/static/img/characters/5.jpg", "/static/img/characters/6.jpg", 
        "/static/img/characters/7.jpg", "/static/img/characters/8.jpg", 
    ],
    currentImageIndex: 0,
};


document.addEventListener("DOMContentLoaded", () => {
    const images = new Array();

    function preloadImages(...images) {
        images.forEach((image, i) => {
            image = new Image();
            image.src = preloadImages.arguments[i];
        });
    };

    // Предварительная загрузка нужных картинок
    preloadImages(
        try_gifs,
        good_gifs, 
        pics.allImages
    );
});

document.getElementById("image").src = pics.allImages[pics.currentImageIndex];
document.getElementById("cur-question").innerHTML = pics.currentImageIndex + 1;
document.getElementById("max-question").innerHTML = pics.allImages.length; 
document.getElementById('text').maxLength = answers[pics.currentImageIndex].length;
window.currentImageIndex = 0
CreateTable(pics.currentImageIndex)

function CreateTable(ind)
{
    if (ind > 0){
        var del_table = document.getElementById("tbl");
        del_table.remove();
    }

    let table = document.createElement('table');
    table.id = "tbl";
    let tbody = document.createElement('tbody');
    table.appendChild(tbody);
    var id_container = 'table';
    if (ind == 11) {
        id_container = 'end_tbl';
    }
    document.getElementById(id_container).appendChild(table);
    let answer = answers[ind];
    let cells_count = answer.length;
     
    table.className="style-table";

    let row = document.createElement('tr');
    for (let i = 0; i < cells_count; i++){
        let cell = document.createElement('td');
        cell.className="style-td";
        cell.innerHTML = '';
        if (answer[i] == ' ') {
            cell.style="border: none; background-color: rgba(255,255,255,0);";
        }      
        row.appendChild(cell);
    }
    tbody.appendChild(row);

}

       
function NEXTClick()
{   
    if (window.currentImageIndex == (pics.allImages.length - 1)){
        document.getElementById('header').style = "display:none;";
        document.getElementById('question').style = "display:none;";
        document.getElementById("buttons-2").style = 'display:none;';
        document.getElementById('end').style = "display:block;";
        tg.MainButton.show();
        Telegram.WebApp.onEvent('mainButtonClicked', function(){
            tg.sendData('success');
         })
    }
    else {
        document.getElementById("buttons").style = 'display:block-inline;';
        document.getElementById("buttons-2").style = 'display:none;';
        document.getElementById("text").value = "";
        const {allImages, currentImageIndex} = pics;
        const image = document.getElementById("image");
        const nextImageIndex = currentImageIndex + 1;
        pics.currentImageIndex = nextImageIndex;
        window.currentImageIndex = nextImageIndex;
        image.src = allImages[pics.currentImageIndex];
        CreateTable(pics.currentImageIndex);
        document.getElementById("cur-question").innerHTML = pics.currentImageIndex + 1;
        document.getElementById("max-question").innerHTML = pics.allImages.length; 
        document.getElementById('text').maxLength = answers[pics.currentImageIndex].length;
    }
}

function CHECKClick()
{
    var v_title = "Попробуй еще!";
    var v_imageUrl = try_gifs[Math.floor(Math.random()*try_gifs.length)];
    var v_showCancelButton = true;
    var v_showConfirmButton = false;
    if (window.answers[window.currentImageIndex] == window.results[window.currentImageIndex]){
        v_title = "Превосходно!";
        v_imageUrl = good_gifs[window.currentImageIndex];
        v_showCancelButton = false;
        v_showConfirmButton = true;
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
        confirmButtonColor: "#996fdb",
        cancelButtonColor: "#8ac4dc",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed){
            NEXTClick();
        }
      });
}


function HELPClick()
{
    var v_title, v_text, v_icon, v_cancelButtonText,
        v_showConfirmButton, v_confirmButtonText;
    if (helps_uses[pics.currentImageIndex] < helps[pics.currentImageIndex].length) {
        v_title = "Подсказка " + (helps_uses[pics.currentImageIndex] + 1) + " из " + helps[pics.currentImageIndex].length;
        v_text = helps[pics.currentImageIndex][helps_uses[pics.currentImageIndex]];
        v_icon = 'question';
        v_cancelButtonText = "Понял";
        v_showConfirmButton = false;
        helps_uses[pics.currentImageIndex] ++;
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
        cancelButtonColor: "#8ac4dc",
        confirmButtonColor: "#996fdb",
      }).then((result) => {
        if (result.isConfirmed){
            Swal.fire({
                title: answers[pics.currentImageIndex],
                icon: 'success',
                text: '',
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: 'ОК',
                cancelButtonColor: "#8ac4dc",
              });
              document.getElementById("text").value = answers[pics.currentImageIndex];
              document.getElementById("text").oninput();
              document.getElementById("buttons").style = 'display:none;';
              document.getElementById("buttons-2").style = 'display:block;';
      }
    });

}
