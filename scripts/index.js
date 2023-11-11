const header = document.querySelector('header')
const todo_list = document.querySelector("[data-list='todos']")
const input = document.querySelector("[data-input='todo']")
const button_save = document.querySelector("[data-button='save-progress']")
const button_submit = document.querySelector("[data-button='submit']")
const button_change_color_theme = document.querySelector("[data-button='change-color-theme']")
const img_change_color_theme = document.querySelector("[data-image='change-color-theme']")

const utils = {
  ChangeColorTheme() {
    document.body.classList.toggle('dark-theme')
    if (img_change_color_theme.src.includes('/icons/SolarMoonBold.svg')) img_change_color_theme.src = '/icons/SolarSunBold.svg'
    else img_change_color_theme.src = '/icons/SolarMoonBold.svg'
  },
  DeleteDOMElement(element) {
    element.remove()
  },
  CreateButton(text, _url, _alt) {
    let button
    if (text) {
      button = document.createElement('button')
      button.innerText = text
    }

    if (_url) {
      button = document.createElement('img')
      button.src = _url
      button.alt = _alt
    }

    button.classList.add('button')
    return button
  },
}

const popups = {
  CreateConfirmationDialog(Title, Icon, CSSClass, Msg) {
    const dialog = document.createElement('dialog')
    const icon_title_box = document.createElement('div')
    const title = document.createElement('h3')
    const message = document.createElement('h3')
    const icon = document.createElement('img')
    const btn_group = document.createElement('div')
    const btn_confirm = document.createElement('button')
    const btn_cancel = document.createElement('button')

    dialog.classList.add(CSSClass, 'dialog', 'fade-in')
    icon_title_box.classList.add('icon-title-box')
    title.classList.add('dialog-title')
    message.classList.add('dialog-msg')
    btn_group.classList.add('button-group')
    btn_confirm.classList.add('button', 'button-confirm')
    btn_cancel.classList.add('button', 'button-cancel')

    btn_confirm.type = 'button'
    btn_cancel.type = 'button'

    title.innerText = `${Title}:`
    message.innerText = Msg
    icon.src = Icon[0] == '/' ? Icon : `/${Icon}`
    btn_confirm.innerText = 'Confirm'
    btn_cancel.innerText = 'Cancel'

    icon_title_box.appendChild(icon)
    icon_title_box.appendChild(title)

    btn_group.appendChild(btn_cancel)
    btn_group.appendChild(btn_confirm)

    dialog.appendChild(icon_title_box)
    dialog.appendChild(message)
    dialog.appendChild(btn_group)

    document.body.appendChild(dialog)

    btn_confirm.addEventListener('click', () => dialog.remove())
    btn_cancel.addEventListener('click', () => dialog.remove())

    return { btn_confirm, btn_cancel }
  },
  CreateNotificationWithIcon(Title, Icon, CSSClass, _Msg) {
    const notification = document.createElement('dialog')
    const icon_title_box = document.createElement('div')
    const title = document.createElement('h3')
    const message = document.createElement('h3')
    const icon = document.createElement('img')

    notification.classList.add(CSSClass, 'notification', 'slide-from-top')
    icon_title_box.classList.add('icon-title-box')
    title.classList.add('notification-title')
    message.classList.add('notification-msg')

    title.innerText = `${Title}${_Msg ? ':' : ''}`
    message.innerText = _Msg
    icon.src = Icon[0] == '/' ? Icon : `/${Icon}`

    icon_title_box.appendChild(icon)
    icon_title_box.appendChild(title)
    notification.appendChild(icon_title_box)

    if (_Msg) notification.appendChild(message)

    document.body.appendChild(notification)

    setTimeout(() => notification.remove(), 4000)
  },
}

function useTodo({ target, utils, popups }) {
  button_save.addEventListener('click', () => SaveProgressInLocalStorage())

  function AddTodo({ value, class_list, value_class_list, btn_check_class_list, btn_edit_class_list, btn_delete_class_list }) {
    if (CheckIfTodoExist(value)) popups.CreateNotificationWithIcon('Error', '/icons/ZondiconsInformationOutlineError.svg', 'error-notification', 'this to do already exist')
    else {
      const li = document.createElement('li')
      const p = document.createElement('p')
      const div = document.createElement('div')
      const button_check = utils.CreateButton('', '/icons/ZondiconsCheckmarkOutline.svg', 'Check todo button')
      const button_edit = utils.CreateButton('', '/icons/ZondiconsCompose.svg', 'Edit todo button')
      const button_delete = utils.CreateButton('', '/icons/ZondiconsCloseOutline.svg', 'Delete todo button')

      li.id = crypto.randomUUID()
      p.innerText = value

      li.classList = class_list ?? 'todo fade-in'
      button_check.classList = btn_check_class_list ?? 'button-check button-control'
      button_edit.classList = btn_edit_class_list ?? 'button-edit'
      button_delete.classList = btn_delete_class_list ?? 'button-delete button-control'
      p.classList = value_class_list ?? 'no-outline'

      li.classList.remove('is-editing')
      button_edit.classList.remove('is-editing')

      p.spellcheck = true
      button_check.type = 'button'
      button_edit.type = 'button'
      button_delete.type = 'button'

      li.appendChild(p)
      li.appendChild(div)
      div.appendChild(button_check)
      div.appendChild(button_edit)
      div.appendChild(button_delete)
      target.appendChild(li)

      button_check.addEventListener('click', () => CheckTodo({ todo: li, todo_paragraph: p, btn_edit: button_edit }))
      button_edit.addEventListener('click', () => EditTodo({ todo: li, todo_paragraph: p, btn_edit: button_edit }))
      button_delete.addEventListener('click', () => DeleteTodo({ todo: li, todo_paragraph: p }))

      input.value = ''
    }
  }

  function EditTodo({ todo, todo_paragraph, btn_edit }) {
    todo_paragraph.contentEditable = 'true'
    todo.classList.add('is-editing')
    btn_edit.classList.add('is-editing')
    btn_edit.addEventListener('click', () => UpdateTodo({ todo, todo_paragraph, btn_edit }))
  }

  function UpdateTodo({ todo, todo_paragraph, btn_edit }) {
    todo_paragraph.contentEditable = 'false'
    todo.classList.remove('is-editing')
    btn_edit.classList.remove('is-editing')
    btn_edit.addEventListener('click', () => EditTodo({ todo, todo_paragraph, btn_edit }))
  }

  function CheckTodo({ todo, todo_paragraph, btn_edit }) {
    todo.classList.toggle('is-checked')
    UpdateTodo({ todo, todo_paragraph, btn_edit })
  }

  function DeleteTodo({ todo, todo_paragraph }) {
    const { btn_confirm } = popups.CreateConfirmationDialog('Deleting To Do', '/icons/ZondiconsInformationOutlineError.svg', 'warning-dialog', todo_paragraph.innerText)
    btn_confirm.addEventListener('click', () => utils.DeleteDOMElement(todo))
  }

  function SaveProgressInLocalStorage() {
    const collection = Array.from(target.children)
    const new_collection = collection.map((item) => ({
      todo_class_list: item.classList.value,
      todo_value: item.querySelector('p').innerText,
      todo_value_class_list: item.querySelector('p').classList.value,
      button_check_class_list: item.querySelector('.button-check').classList.value,
      button_edit_class_list: item.querySelector('.button-edit').classList.value,
      button_delete_class_list: item.querySelector('.button-delete').classList.value,
    }))
    const json = JSON.stringify(new_collection)
    localStorage['todos'] = json
    popups.CreateNotificationWithIcon('Progress saved successfully', '/icons/ZondiconsInformationOutlineSuccess.svg', 'success-notification')
  }

  function LoadTodos() {
    const todos = localStorage['todos']
    if (todos) {
      const collection = Array.from(JSON.parse(todos))
      collection.forEach((todo) => {
        AddTodo({
          value: todo.todo_value,
          class_list: todo.todo_class_list,
          value_class_list: todo.todo_value_class_list,
          btn_check_class_list: todo.button_check_class_list,
          btn_edit_class_list: todo.button_edit_class_list,
          btn_delete_class_list: todo.button_delete_class_list,
        })
      })
    }
  }

  function CheckIfTodoExist(todo) {
    const collection = Array.from(target.children)
    for (let index = 0; index < collection.length; index++) {
      let element = collection[index].querySelector('p').innerText
      if (todo[0] == ' ') todo = todo.substr(1)
      if (todo[todo.length - 1] == ' ') todo = todo.substr(0, todo.length - 1)
      if (element.toLowerCase() == todo.toLowerCase()) return 1
    }
    return 0
  }

  return { AddTodo, EditTodo, UpdateTodo, CheckTodo, SaveProgressInLocalStorage, LoadTodos, CheckIfTodoExist }
}

const todos = useTodo({ target: todo_list, utils: utils, popups })
todos.LoadTodos()

button_submit.addEventListener('click', (event) => {
  event.preventDefault()
  if (input.value) todos.AddTodo({ value: input.value })
  else popups.CreateNotificationWithIcon('Add a new to do', '/icons/ZondiconsInformationOutlineInform.svg', 'inform-notification')
})

button_change_color_theme.addEventListener('click', () => utils.ChangeColorTheme())
