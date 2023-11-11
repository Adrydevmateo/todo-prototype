const header = document.querySelector("header")
const todo_list = document.querySelector("[data-list='todos']")
const input = document.querySelector("[data-input='todo']")
const button_save = document.querySelector("[data-button='save-progress']")
const button_submit = document.querySelector("[data-button='submit']")
const button_change_color_theme = document.querySelector("[data-button='change-color-theme']")
const img_change_color_theme = document.querySelector("[data-image='change-color-theme']")

button_submit.addEventListener("click", (event) => {
  event.preventDefault()
  if (input.value) {
    todos.CreateTodo(input.value)
  } else {
    dialogs.CreateNotificationWithIcon("Add a new to do", "ZondiconsInformationOutlineInform.svg", "inform-notification")
  }
})

button_change_color_theme.addEventListener("click", () => ChangeColorTheme())

const CapitalizeText = (txt) => txt.replace(/\b\w/g, (letter) => letter.toUpperCase())

function ChangeColorTheme() {
  document.body.classList.toggle("dark-theme")
  console.log(img_change_color_theme.src)
  if (img_change_color_theme.src.includes("/SolarMoonBold.svg")) {
    img_change_color_theme.src = "/SolarSunBold.svg"
  } else {
    img_change_color_theme.src = "/SolarMoonBold.svg"
  }
}

function useDialog() {

  function CreateConfirmationDialog(Title, Icon, CSSClass, Msg) {
    const dialog = document.createElement("dialog")
    const icon_title_box = document.createElement("div")
    const title = document.createElement("h3")
    const message = document.createElement("h3")
    const icon = document.createElement("img")
    const btn_group = document.createElement("div")
    const btn_confirm = document.createElement("button")
    const btn_cancel = document.createElement("button")

    dialog.classList.add(CSSClass, "dialog", "fade-in")
    icon_title_box.classList.add("icon-title-box")
    title.classList.add("dialog-title")
    message.classList.add("dialog-msg")
    btn_group.classList.add("button-group")
    btn_confirm.classList.add("button", "button-confirm")
    btn_cancel.classList.add("button", "button-cancel")

    btn_confirm.type = "button"
    btn_cancel.type = "button"

    title.innerText = `${Title}:`
    message.innerText = Msg
    icon.src = `/${Icon}`
    btn_confirm.innerText = "Confirm"
    btn_cancel.innerText = "Cancel"

    icon_title_box.appendChild(icon)
    icon_title_box.appendChild(title)

    btn_group.appendChild(btn_cancel)
    btn_group.appendChild(btn_confirm)

    dialog.appendChild(icon_title_box)
    dialog.appendChild(message)
    dialog.appendChild(btn_group)

    document.body.appendChild(dialog)

    btn_confirm.addEventListener("click", () => dialog.remove())
    btn_cancel.addEventListener("click", () => dialog.remove())

    return { btn_confirm, btn_cancel }
  }

  function CreateNotificationWithIcon(Title, Icon, CSSClass, _Msg) {
    const notification = document.createElement("dialog")
    const icon_title_box = document.createElement("div")
    const title = document.createElement("h3")
    const message = document.createElement("h3")
    const icon = document.createElement("img")

    notification.classList.add(CSSClass, "notification", "slide-from-top")
    icon_title_box.classList.add("icon-title-box")
    title.classList.add("notification-title")
    message.classList.add("notification-msg")

    title.innerText = `${Title}${(_Msg) ? ':' : ''}`
    message.innerText = _Msg
    icon.src = `/${Icon}`

    icon_title_box.appendChild(icon)
    icon_title_box.appendChild(title)
    notification.appendChild(icon_title_box)

    if (_Msg) notification.appendChild(message)

    document.body.appendChild(notification)

    setTimeout(() => notification.remove(), 4000)
  }

  return { CreateConfirmationDialog, CreateNotificationWithIcon }
}

const dialogs = useDialog()

function useTodo(target) {
  button_save.addEventListener("click", () => SaveProgress())

  function CreateTodo(todo, _todo_class_list, _todo_value_class_list, _button_check_class_list, _button_edit_class_list, _button_delete_class_list) {
    if (CheckIfTodoExist(todo)) {
      dialogs.CreateNotificationWithIcon("Error", "ZondiconsInformationOutlineError.svg", "error-notification", "this to do already exist")
    } else {
      const li = document.createElement("li")
      const p = document.createElement("p")
      const div = document.createElement("div")
      const button_check = CreateButton("", "/ZondiconsCheckmarkOutline.svg", "Check todo button")
      const button_edit = CreateButton("", "/ZondiconsCompose.svg", "Edit todo button")
      const button_delete = CreateButton("", "/ZondiconsCloseOutline.svg", "Delete todo button")

      p.innerText = todo

      li.id = crypto.randomUUID()
      li.classList = _todo_class_list ?? "todo fade-in"
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

      button_check.addEventListener("click", () => CheckTodo())
      button_edit.addEventListener("click", () => EditTodo())
      button_delete.addEventListener("click", () => DeleteTodo())

      li.appendChild(p)
      li.appendChild(div)
      div.appendChild(button_check)
      div.appendChild(button_edit)
      div.appendChild(button_delete)
      target.appendChild(li)

      input.value = ""

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
        const { btn_confirm } = dialogs.CreateConfirmationDialog("Deleting To Do", "ZondiconsInformationOutlineError.svg", "warning-dialog", p.innerText)
        btn_confirm.addEventListener("click", () => {
          li.remove()
        })
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
    dialogs.CreateNotificationWithIcon("Progress saved successfully", "ZondiconsInformationOutlineSuccess.svg", "success-notification")
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

  function CheckIfTodoExist(todo) {
    const collection = Array.from(todo_list.children)
    for (let index = 0; index < collection.length; index++) {
      let element = collection[index].querySelector("p").innerText
      if (todo[0] == " ") todo = todo.substr(1)
      if (todo[todo.length - 1] == " ") todo = todo.substr(0, todo.length - 1)
      if (element.toLowerCase() == todo.toLowerCase()) return 1
    }
    return 0
  }

  return { CreateTodo, LoadTodos, CheckIfTodoExist }
}

const todos = useTodo(todo_list)
todos.LoadTodos()