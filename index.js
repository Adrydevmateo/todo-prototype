const header = document.querySelector("header")
const todo_list = document.querySelector("[data-list='todos']")
const input = document.querySelector("[data-input='todo']")
const button_save = document.querySelector("[data-button='save-progress']")

const button_submit = document.querySelector("[data-button='submit']")

button_submit.addEventListener("click", (event) => {
  event.preventDefault()
  todos.CreateTodo(input.value)
  input.value = ""
})

function useTodo(target) {
  let todos = []
  button_save.addEventListener("click", () => SaveProgress())

  function CreateTodo(todo, _todo_class_list, _todo_value_class_list, _button_check_class_list, _button_edit_class_list, _button_delete_class_list) {
    const li = document.createElement("li")
    const p = document.createElement("p")
    const div = document.createElement("div")
    const button_check = CreateButton("", "ZondiconsCheckmarkOutline.svg", "Check todo button")
    const button_edit = CreateButton("", "ZondiconsCompose.svg", "Edit todo button")
    const button_delete = CreateButton("", "ZondiconsCloseOutline.svg", "Delete todo button")

    p.innerText = todo
    button_check.addEventListener("click", () => CheckTodo())
    button_edit.addEventListener("click", () => EditTodo())
    button_delete.addEventListener("click", () => DeleteTodo())

    li.classList = _todo_class_list ?? "todo"
    button_check.classList = _button_check_class_list ?? "button-check button-control"
    button_edit.classList = _button_edit_class_list ?? "button-edit"
    button_delete.classList = _button_delete_class_list ?? "button-delete button-control"
    p.classList = _todo_value_class_list ?? "no-outline"

    li.appendChild(p)
    li.appendChild(div)
    div.appendChild(button_check)
    div.appendChild(button_edit)
    div.appendChild(button_delete)
    target.appendChild(li)

    function CheckTodo() {
      li.classList.toggle("is-checked")
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
      button_edit.addEventListener("click", () => EditTodo())
    }

    function DeleteTodo() {
      li.remove()
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

  return { todos, CreateTodo, LoadTodos }
}

const todos = useTodo(todo_list)
todos.LoadTodos()