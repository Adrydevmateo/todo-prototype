const todo_list = document.querySelector("[data-list='todos']")
const input = document.querySelector("[data-input='todo']")
const todo_id = crypto.randomUUID()

const button_submit = document.querySelector("[data-button='submit']")

button_submit.addEventListener("click", (event) => {
  event.preventDefault()
  todos.CreateTodo(input.value)
  input.value = ""
})

function useTodo(target) {
  const todos = []

  function CreateTodo(todo) {
    const id = crypto.randomUUID()
    todos.push({
      id: id,
      value: todo,
    })

    const li = document.createElement("li")
    const p = document.createElement("p")
    const div = document.createElement("div")
    const button_check = CreateButton("", "ZondiconsCheckmarkOutline.svg", "Check todo button")
    const button_edit = CreateButton("", "ZondiconsCompose.svg", "Edit todo button")
    const button_delete = CreateButton("", "ZondiconsCloseOutline.svg", "Delete todo button")

    li.id = id
    p.innerText = todo
    button_check.addEventListener("click", () => CheckTodo())
    button_edit.addEventListener("click", () => EditTodo())
    button_delete.addEventListener("click", () => DeleteTodo())

    li.classList.add("todo")
    button_check.classList.add("button-check", "button-control")
    button_edit.classList.add("button-edit")
    button_delete.classList.add("button-delete", "button-control")
    p.style.outline = "none"

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
      
      const todo = FindTodo(id)
      todo.value = p.innerText
    }

    function DeleteTodo() {
      const todo = FindTodo(id)
      const index = todos.indexOf(todo)
      todos.splice(index, 1)
  
      li.remove()
    }
  }

  function GetTodos() {
    return todos
  }

  function FindTodo(id) {
    return todos.find((todo) => todo.id === id)
  }

  function CreateButton(text, _url, _alt) {
    let button
    if (text) {
      document.createElement("button")
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

  return { CreateTodo, GetTodos, FindTodo }
}

const todos = useTodo(todo_list)