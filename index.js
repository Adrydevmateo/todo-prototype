const header = document.querySelector("header")
const todo_list = document.querySelector("[data-list='todos']")
const input = document.querySelector("[data-input='todo']")
const button_save = document.querySelector("[data-button='save-progress']")
const button_submit = document.querySelector("[data-button='submit']")
const button_change_color_theme = document.querySelector("[data-button='change-color-theme']")
const img_change_color_theme = document.querySelector("[data-image='change-color-theme']")

button_submit.addEventListener("click", (event) => {
  event.preventDefault()
  // TODO: Add pop up
  if (input.value) {
    todos.CreateTodo(input.value)
    input.value = ""
  }
})

button_change_color_theme.addEventListener("click", () => ChangeColorTheme())

function ChangeColorTheme() {
  document.body.classList.toggle("dark-theme")
  console.log(img_change_color_theme.src)
  if (img_change_color_theme.src.includes("/SolarMoonBold.svg")) {
    img_change_color_theme.src = "/SolarSunBold.svg"
  } else {
    img_change_color_theme.src = "/SolarMoonBold.svg"
  }
}

function useTodo(target) {
  const current_todos = []
  button_save.addEventListener("click", () => SaveProgress())

  function CreateTodo(todo, _todo_class_list, _todo_value_class_list, _button_check_class_list, _button_edit_class_list, _button_delete_class_list) {
    if (current_todos.includes(todo)) {
      dialogs.CreateNotificationWithIcon("Error", "this task already exist", "ZondiconsInformationOutlineError.svg", "error-notification")
    } else {
      current_todos.push(todo)

      const li = document.createElement("li")
      const p = document.createElement("p")
      const div = document.createElement("div")
      const button_check = CreateButton("", "/ZondiconsCheckmarkOutline.svg", "Check todo button")
      const button_edit = CreateButton("", "/ZondiconsCompose.svg", "Edit todo button")
      const button_delete = CreateButton("", "/ZondiconsCloseOutline.svg", "Delete todo button")

      p.innerText = todo
      button_check.addEventListener("click", () => CheckTodo())
      button_edit.addEventListener("click", () => EditTodo())
      button_delete.addEventListener("click", () => DeleteTodo())

      li.classList = _todo_class_list ?? "todo"
      button_check.classList = _button_check_class_list ?? "button-check button-control"
      button_edit.classList = _button_edit_class_list ?? "button-edit"
      button_delete.classList = _button_delete_class_list ?? "button-delete button-control"
      p.classList = _todo_value_class_list ?? "no-outline"

      li.classList.remove("is-editing")
      button_edit.classList.remove("is-editing")

      p.spellcheck = true
      button_check.type = "button"
      button_edit.type = "button"
      button_delete.type = "button"

      li.appendChild(p)
      li.appendChild(div)
      div.appendChild(button_check)
      div.appendChild(button_edit)
      div.appendChild(button_delete)
      target.appendChild(li)

      function CheckTodo() {
        li.classList.toggle("is-checked")
        UpdateTodo()
      }

      function EditTodo() {
        p.contentEditable = "true"
        li.classList.add("is-editing")
        button_edit.classList.add("is-editing")
        button_edit.addEventListener("click", () => UpdateTodo())
      }

      function UpdateTodo() {
        p.contentEditable = "false"
        li.classList.remove("is-editing")
        button_edit.classList.remove("is-editing")
        button_edit.addEventListener("click", () => EditTodo())
      }

      function DeleteTodo() {
        li.remove()
      }
    }
  }

  function CreateButton(text, _url, _alt) {
    let button
    if (text) {
      button = document.createElement("button")
      button.innerText = text
    }

    if (_url) {
      button = document.createElement("img")
      button.src = _url
      button.alt = _alt
    }

    button.classList.add("button")
    return button
  }

  function SaveProgress() {
    const collection = Array.from(todo_list.children)
    const new_collection = collection.map(item => ({
      todo_class_list: item.classList.value,
      todo_value: item.querySelector("p").innerText,
      todo_value_class_list: item.querySelector("p").classList.value,
      button_check_class_list: item.querySelector(".button-check").classList.value,
      button_edit_class_list: item.querySelector(".button-edit").classList.value,
      button_delete_class_list: item.querySelector(".button-delete").classList.value,
    }))
    const json = JSON.stringify(new_collection)
    localStorage["todos"] = json
  }

  function LoadTodos() {
    const todos = localStorage["todos"]
    if (todos) {
      const collection = Array.from(JSON.parse(todos))
      collection.forEach(todo => {
        CreateTodo(todo.todo_value, todo.todo_class_list, todo.todo_value_class_list, todo.button_check_class_list, todo.button_edit_class_list, todo.button_delete_class_list)
      })
    }
  }

  return { CreateTodo, LoadTodos, current_todos }
}

const todos = useTodo(todo_list)
todos.LoadTodos()

function useDialog () {
  function CreateNotificationWithIcon(Title, Msg, Icon, CSSClass) {
    const notification = document.createElement("dialog")
    const icon_title_box = document.createElement("div")
    const title = document.createElement("h3")
    const message = document.createElement("h3")
    const icon = document.createElement("img")

    notification.classList.add(CSSClass)
    icon_title_box.classList.add("icon-title-box")
    title.classList.add("notification-title")
    message.classList.add("notification-msg")

    title.innerText = `${Title}:`
    message.innerText = Msg
    icon.src = `/${Icon}`

    icon_title_box.appendChild(icon)
    icon_title_box.appendChild(title)
    notification.appendChild(icon_title_box)
    notification.appendChild(message)
    document.body.appendChild(notification)

    setTimeout(() => notification.remove(), 4000)
  }

  return { CreateNotificationWithIcon }
}

const dialogs = useDialog()