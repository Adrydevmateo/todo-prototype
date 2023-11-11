'use strict'
const header = document.querySelector('header')
const todo_list = document.querySelector("[data-list='todos']")
const input = document.querySelector("[data-input='todo']")
const btn_save = document.querySelector("[data-btn='save-progress']")
const btn_submit = document.querySelector("[data-btn='submit']")
const btn_change_color_theme = document.querySelector("[data-btn='change-color-theme']")
const img_change_color_theme = document.querySelector("[data-image='change-color-theme']")

const utils = {
  ChangeColorTheme() {
    document.body.classList.toggle('dark-theme')
    if (img_change_color_theme.src.includes('/icons/SolarMoonBold.svg')) img_change_color_theme.src = '/icons/SolarSunBold.svg'
    else img_change_color_theme.src = '/icons/SolarMoonBold.svg'
  },
  DeleteDOMElement: (element) => element.remove(),
  CreateBtn() {
    let btn = document.createElement('button')
    btn.type = 'button'
    return btn
  },
  CreateTextBtn(text) {
    let btn = this.CreateBtn()
    btn.innerText = text
    return btn
  },
  CreateIconBtn(icon, alt) {
    let new_btn = this.CreateBtn()
    let new_img = document.createElement('img')
    new_img.src = icon
    new_img.alt = alt
    new_btn.appendChild(new_img)
    return new_btn
  },
}

const popups = {
  CreateConfirmationDialog(new_title, new_icon, css_classes, new_msg) {
    const dialog = document.createElement('dialog')
    const icon_title_box = document.createElement('div')
    const title = document.createElement('h3')
    const msg = document.createElement('h3')
    const icon = document.createElement('img')
    const btn_group = document.createElement('div')
    const btn_confirm = utils.CreateTextBtn('Confirm')
    const btn_cancel = utils.CreateTextBtn('Cancel')

    dialog.classList.add(css_classes, 'dialog', 'fade-in')
    icon_title_box.classList.add('icon-title-box')
    title.classList.add('dialog-title')
    msg.classList.add('dialog-msg')
    btn_group.classList.add('btn-group')
    btn_confirm.classList.add('btn', 'btn-confirm')
    btn_cancel.classList.add('btn', 'btn-cancel')

    title.innerText = `${new_title}:`
    msg.innerText = new_msg
    icon.src = new_icon[0] == '/' ? new_icon : `/${new_icon}`

    icon_title_box.appendChild(icon)
    icon_title_box.appendChild(title)

    btn_group.appendChild(btn_cancel)
    btn_group.appendChild(btn_confirm)

    dialog.appendChild(icon_title_box)
    dialog.appendChild(msg)
    dialog.appendChild(btn_group)

    document.body.appendChild(dialog)

    btn_confirm.addEventListener('click', () => dialog.remove())
    btn_cancel.addEventListener('click', () => dialog.remove())

    return { btn_confirm, btn_cancel }
  },
  CreateNotificationWithIcon(new_title, new_icon, css_classes) {
    const notification = document.createElement('dialog')
    const icon_title_box = document.createElement('div')
    const title = document.createElement('h3')
    const icon = document.createElement('img')

    notification.classList.add(css_classes, 'notification', 'slide-from-top')
    icon_title_box.classList.add('icon-title-box')
    title.classList.add('notification-title')

    title.innerText = new_title
    icon.src = new_icon[0] == '/' ? new_icon : `/${new_icon}`

    icon_title_box.appendChild(icon)
    icon_title_box.appendChild(title)

    notification.appendChild(icon_title_box)
    notification.appendChild(title)

    document.body.appendChild(notification)

    setTimeout(() => notification.remove(), 4000)
  },
}

function useTodo({ target, utils, popups }) {
  btn_save.addEventListener('click', () => SaveProgressInLocalStorage())

  /** Adds a new todo to the list of todos
   * @param {Object} elements - required elements
   * @param {String} elements.value - new todo value
   * @param {String} elements.class_list - new css classes for the todo
   * @param {String} elements.value_class_list - new css classes for the element containing the value of the todo
   * @param {String} elements.btn_check_class_list - new css classes for the button that sets the todo as completed
   * @param {String} elements.btn_edit_class_list - new css classes for the button that allows editing the todo
   * @param {String} elements.btn_delete_class_list - new css classes for the button that deletes the todo
   * @returns {void}
   * @example
   * const new_todo = {
   *  value: 'new todo',
   *  class_list: 'class class ...',
   *  value_class_list: 'class class ...',
   *  btn_check_class_list: 'class class ...',
   *  btn_edit_class_list: 'class class ...',
   *  btn_delete_class_list: 'class class ...'
   * }
   * AddTodo(new_todo)
   *
   * @example
   * AddTodo({ 'new todo', 'class class ...', 'class class ...', 'class class ...', 'class class ...', 'class class ...' })
   *
   * @since 1.0.0
   */
  function AddTodo({ value, class_list, value_class_list, btn_check_class_list, btn_edit_class_list, btn_delete_class_list }) {
    if (CheckIfTodoExist(value)) popups.CreateNotificationWithIcon('This to do already exist', '/icons/ZondiconsInformationOutlineError.svg', 'error-notification')
    else {
      const todo = document.createElement('li')
      const todo_value = document.createElement('p')
      const btn_group = document.createElement('div')
      const btn_check = utils.CreateIconBtn('/icons/ZondiconsCheckmarkOutline.svg', 'Check todo button')
      const btn_edit = utils.CreateIconBtn('/icons/ZondiconsCompose.svg', 'Edit todo button')
      const btn_delete = utils.CreateIconBtn('/icons/ZondiconsCloseOutline.svg', 'Delete todo button')

      todo.id = crypto.randomUUID()
      todo_value.innerText = value

      todo.classList = class_list ?? 'todo fade-in'
      btn_check.classList = btn_check_class_list ?? 'btn-check btn-control icon-btn'
      btn_edit.classList = btn_edit_class_list ?? 'btn-edit icon-btn'
      btn_delete.classList = btn_delete_class_list ?? 'btn-delete btn-control icon-btn'
      todo_value.classList = value_class_list ?? 'no-outline'

      todo.classList.remove('is-editing')
      btn_edit.classList.remove('is-editing')

      todo_value.spellcheck = true

      todo.appendChild(todo_value)
      todo.appendChild(btn_group)
      btn_group.appendChild(btn_check)
      btn_group.appendChild(btn_edit)
      btn_group.appendChild(btn_delete)
      target.appendChild(todo)

      btn_check.addEventListener('click', () => CompleteTodo({ todo, todo_value, btn_edit }))
      btn_edit.addEventListener('click', () => EditTodo({ todo, todo_value, btn_edit }))
      btn_delete.addEventListener('click', () => DeleteTodo({ todo, todo_value }))

      input.value = ''
    }
  }

  /** Sets a todo as editable
   * @param {Object} elements - required elements
   * @param {HTMLElement} elements.todo - The todo
   * @param {HTMLElement} elements.todo_value - Contains the value of the todo
   * @param {HTMLElement} elements.btn_edit - button that allows the todo to be edited
   * @returns {void}
   *
   * @example
   * const todo_to_edit = {
   *  todo: todo element,
   *  todo_value: current todo value,
   *  btn_edit: button element
   * }
   * EditTodo(todo_to_edit)
   *
   * @example
   * EditTodo({ todo: todo element, todo_value: current todo value, btn_edit: button element })
   *
   * @since 1.0.0
   */
  function EditTodo({ todo, todo_value, btn_edit }) {
    todo_value.contentEditable = 'true'
    todo.classList.add('is-editing')
    btn_edit.classList.add('is-editing')
    btn_edit.addEventListener('click', () => UpdateTodo({ todo, todo_value, btn_edit }))
  }

  /** Updates a todo value
   * @param {Object} elements - required elements
   * @param {HTMLElement} elements.todo - The todo
   * @param {HTMLElement} elements.todo_value - Contains the value of the todo
   * @param {HTMLElement} elements.btn_edit - button that allows the todo to be edited
   * @returns {void}
   *
   * @example
   * const todo_to_update = {
   *  todo: todo element,
   *  todo_value: current todo value,
   *  btn_edit: button element
   * }
   * UpdateTodo(todo_to_update)
   *
   * @example
   * UpdateTodo({ todo: todo element, todo_value: current todo value, btn_edit: button element })
   *
   * @since 1.0.0
   */
  function UpdateTodo({ todo, todo_value, btn_edit }) {
    todo_value.contentEditable = 'false'
    todo.classList.remove('is-editing')
    btn_edit.classList.remove('is-editing')
    btn_edit.addEventListener('click', () => EditTodo({ todo, todo_value, btn_edit }))
  }

  /** Sets a todo as completed
   * @param {Object} elements - required elements
   * @param {HTMLElement} elements.todo - The todo
   * @param {HTMLElement} elements.todo_value - Contains the value of the todo
   * @param {HTMLElement} elements.btn_edit - button that allows the todo to be edited
   * @returns {void}
   *
   * @example
   * const todo_to_complete = {
   *  todo: todo element,
   *  todo_value: current todo value,
   *  btn_edit: button element
   * }
   * CompleteTodo(todo_to_complete)
   *
   * @example
   * CompleteTodo({ todo: todo element, todo_value: current todo value, btn_edit: button element })
   *
   * @since 1.0.0
   */
  function CompleteTodo({ todo, todo_value, btn_edit }) {
    todo.classList.toggle('is-checked')
    UpdateTodo({ todo, todo_value, btn_edit })
  }

  /** Deletes a todo
   * @param {Object} elements - required elements
   * @param {HTMLElement} elements.todo - The todo
   * @param {HTMLElement} elements.todo_value - Contains the value of the todo
   * @returns {void}
   *
   * @example
   * const todo_to_delete = {
   *  todo: todo element,
   *  todo_value: current todo value
   * }
   * DeleteTodo(todo_to_delete)
   *
   * @example
   * DeleteTodo({ todo: todo element, todo_value: current todo value })
   *
   * @since 1.0.0
   */
  function DeleteTodo({ todo, todo_value }) {
    const { btn_confirm } = popups.CreateConfirmationDialog('Deleting To Do', '/icons/ZondiconsInformationOutlineError.svg', 'warning-dialog', todo_value.innerText)
    btn_confirm.addEventListener('click', () => utils.DeleteDOMElement(todo))
  }

  function SaveProgressInLocalStorage() {
    const collection = Array.from(target.children)
    const new_collection = collection.map((item) => ({
      todo_class_list: item.classList.value,
      todo_value: item.querySelector('p').innerText,
      todo_value_class_list: item.querySelector('p').classList.value,
      btn_check_class_list: item.querySelector('.btn-check').classList.value,
      btn_edit_class_list: item.querySelector('.btn-edit').classList.value,
      btn_delete_class_list: item.querySelector('.btn-delete').classList.value,
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
          btn_check_class_list: todo.btn_check_class_list,
          btn_edit_class_list: todo.btn_edit_class_list,
          btn_delete_class_list: todo.btn_delete_class_list,
        })
      })
    }
  }

  /** Checks if a todo already exist
   * @param {todo} todo - required todo to be checked
   * @returns {number} 1 if the todo exists, 0 if not
   *
   * @example
   * const todo_exist = CheckIfTodoExist(todo)
   * console.log(todo_exist) // Either 1 or 0
   *
   * @since 1.0.0
   */
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

  return { AddTodo, EditTodo, UpdateTodo, CompleteTodo, SaveProgressInLocalStorage, LoadTodos, CheckIfTodoExist }
}

const todos = useTodo({ target: todo_list, utils: utils, popups })
todos.LoadTodos()

btn_submit.addEventListener('click', (event) => {
  event.preventDefault()
  if (input.value) todos.AddTodo({ value: input.value })
  else popups.CreateNotificationWithIcon('Add a new to do', '/icons/ZondiconsInformationOutlineInform.svg', 'inform-notification')
})

btn_change_color_theme.addEventListener('click', () => utils.ChangeColorTheme())
