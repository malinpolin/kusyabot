let tg = window.Telegram.WebApp; //получаем объект webapp телеграма

tg.expand(); //расширяем на все окно

tg.MainButton.text = "I'm ready!"; //изменяем текст кнопки
tg.MainButton.textColor = "#dd4f4e"; //изменяем цвет текста кнопки
tg.MainButton.color = "#3f3f3f"; //изменяем цвет бэкграунда кнопки
tg.MainButton.show();


Telegram.WebApp.onEvent('mainButtonClicked', function(){
  var selected = [];
  const checked = document.querySelectorAll('input[type="checkbox"]:checked');
  selected = Array.from(checked).map(x => x.id);

  //при клике на основную кнопку отправляем данные в строковом виде  
  tg.sendData(selected.join());
});