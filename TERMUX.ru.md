# 📱 Установка и запуск html360 на Android (Termux)

Вы можете упаковывать 360°-панорамы в автономные HTML-файлы прямо на смартфоне без использования компьютера.

## 1. Установка Termux

1. Скачайте актуальный универсальный APK с официального GitHub-релиза Termux:
   [termux-app_v0.119.0-beta.3+apt-android-7-github-debug_universal.apk](https://github.com/termux/termux-app/releases/download/v0.119.0-beta.3/termux-app_v0.119.0-beta.3+apt-android-7-github-debug_universal.apk)
2. Установите скачанный файл на смартфон (при необходимости разрешите установку из неизвестных источников).

## 2. Настройка окружения и установка html360

Откройте Termux и выполните **две команды** по очереди:

### Шаг 1. Доступ к памяти телефона
```bash
termux-setup-storage
```
Нажмите **«Разрешить»** во всплывающем системном окне Android, чтобы терминал получил доступ к вашим фотографиям.

### Шаг 2. Установка Node.js, html360 и Sharp (WebAssembly)
Скопируйте и вставьте эту команду целиком — она сама обновит пакеты, установит Node.js, `html360` и настроит движок сжатия 8K для Android:
```bash
yes | pkg update && yes | pkg upgrade -o Dpkg::Options::="--force-confnew" && pkg install -y nodejs-lts && npm install -g http-server && npm install -g html360 && npm install --prefix $(npm root -g)/html360 --no-save --cpu=wasm32 sharp @img/sharp-wasm32
```

## 3. Удобный запуск всей папки + локальный сервер

Чтобы не перечислять имена файлов вручную и не сталкиваться с блокировкой локальных файлов в мобильном браузере, добавим удобную функцию для `html360`. При запуске без параметров она упакует **все фотографии** в текущей папке и сразу откроет браузер.

Выполните эту команду один раз:
```bash
cat << 'EOF' >> ~/.bashrc

h360() {
  shopt -s nullglob nocaseglob
  local files=(*.jpg *.jpeg *.png)
  shopt -u nullglob nocaseglob

  if [ ${#files[@]} -eq 0 ]; then
    echo "В текущей папке нет изображений (.jpg, .jpeg, .png)"
    return 1
  fi

  html360 "$@" "${files[@]}"
  local status=$?

  # Возвращаем курсор и жестко переводим строку, чтобы не затирать вывод
  tput cnorm 2>/dev/null
  echo -e "\n"

  if [ $status -ne 0 ]; then
    return $status
  fi

  pkill -f http-server 2>/dev/null
  echo "Запускаю локальный сервер... (Нажмите CTRL+C для остановки)"
  http-server . -o
}
EOF

source ~/.bashrc
```

Удалить одной командой (самый быстрый)
```bash
~/.bashrc && unset -f h360
``` 

Удалить точечно через редактор 
```bash
nano ~/.bashrc
```


## 4. Как пользоваться

1. Скопируйте все панорамы в отдельную папку. Например, downloads/html360 

2. Перейдите в эту папку:
```bash
cd ~/storage/downloads/html360
```

2. Запустите:
```bash
h360
```
3. Программа сама соберет `.html` файлы для всех фото в папке и автоматически откроет браузер для просмотра или сборки 3D-тура.

# Шпора
```bash
echo $COLUMNS
```

```bash
npm install --prefix $(npm root -g)/html360 --no-save --cpu=wasm32 sharp @img/sharp-wasm32
```

