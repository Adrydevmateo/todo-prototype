'use strict'
const root = document.querySelector('html')
const todo_list = document.querySelector("[data-list='todos']")
const input = document.querySelector("[data-input='todo']")
const btn_change_color_theme = document.querySelector("[data-btn='change-color-theme']")

const utils = {
  img_change_color_theme: document.querySelector("[data-image='change-color-theme']"),
  ICONS: '/icons/country_flags/',
  ChangeColorTheme() {
    if (this.CheckIfColorThemeIsBlack()) this.SetWhiteTheme()
    else this.SetDarkTheme()
  },
  SetColorTheme() {
    if (localStorage['color-theme'] == undefined) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) utils.SetDarkTheme()
      else utils.SetWhiteTheme()
    } else {
      if (utils.CheckIfColorThemeIsBlack()) utils.SetDarkTheme()
      else utils.SetWhiteTheme()
    }
  },
  SetDarkTheme() {
    document.body.classList.add('dark-theme')
    this.img_change_color_theme.src = '/icons/SolarSunBold.svg'
    localStorage['color-theme'] = 'dark-theme'
  },
  SetWhiteTheme() {
    document.body.classList.remove('dark-theme')
    this.img_change_color_theme.src = '/icons/SolarMoonBold.svg'
    localStorage['color-theme'] = ''
  },
  CheckIfColorThemeIsBlack() {
    const color_theme = localStorage['color-theme']
    return color_theme == 'dark-theme' ? true : false
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
  TITLE_ICON: 'icon-title-box',
  INFORMATION_ERROR_ICON: '/icons/ZondiconsInformationOutlineError.svg',
  INFORMATION_SUCCESS_ICON: '/icons/ZondiconsInformationOutlineSuccess.svg',

  /** Creates a dialog that allows you to confirm or cancel an action.
   * @param {String} new_title - Dialog title.
   * @param {String} new_icon - Url of the icon.
   * @param {String} icon_alt - Alt message of the icon.
   * @param {String} css_classes - CSS classes for the dialog.
   * @param {String} new_description - Dialog description.
   * @returns {Object} An object containing functions to interact with the dialog.
   *
   * @since 1.0.0
   */
  CreateConfirmationDialog(new_title, new_icon, icon_alt, css_classes, new_description) {
    const dialog = document.createElement('dialog')
    const title_box = document.createElement('div')
    const title = document.createElement('h3')
    const description = document.createElement('h3')
    const icon = document.createElement('img')
    const btn_group = document.createElement('div')
    const btn_confirm = utils.CreateTextBtn(internationalization.translations.confirm[root.lang])
    const btn_cancel = utils.CreateTextBtn(internationalization.translations.cancel[root.lang])

    dialog.classList.add(css_classes, 'dialog', 'slide-from-and-stop')

    title_box.classList.add(this.TITLE_ICON)
    title.classList.add('dialog-title')

    description.classList.add('dialog-msg')

    btn_group.classList.add('btn-group')
    btn_confirm.classList.add('btn', 'btn-confirm')
    btn_cancel.classList.add('btn', 'btn-cancel')

    title.innerText = `${new_title}:`
    description.innerText = new_description

    icon.src = new_icon[0] == '/' ? new_icon : `/${new_icon}`
    icon.alt = icon_alt

    title_box.appendChild(icon)
    title_box.appendChild(title)

    btn_group.appendChild(btn_cancel)
    btn_group.appendChild(btn_confirm)

    dialog.appendChild(title_box)
    dialog.appendChild(description)
    dialog.appendChild(btn_group)

    document.body.appendChild(dialog)

    btn_confirm.addEventListener('click', () => dialog.remove())
    btn_cancel.addEventListener('click', () => dialog.remove())

    return { btn_confirm, btn_cancel }
  },

  /** Creates a notification with an icon included.
   * @param {String} new_msg - Message to be shown in the popup.
   * @param {String} new_icon - Url of the icon.
   * @param {String} icon_alt - Alt message of the icon.
   * @param {String} css_classes - CSS classes for the popup.
   *
   * @since 1.0.0
   */
  CreateNotificationWithIcon(new_msg, new_icon, icon_alt, css_classes) {
    const notification = document.createElement('dialog')
    const title_box = document.createElement('div')
    const msg = document.createElement('h3')
    const icon = document.createElement('img')

    notification.classList.add(css_classes, 'notification', 'slide-from-top')
    title_box.classList.add(this.TITLE_ICON)
    msg.classList.add('notification-title')

    msg.innerText = new_msg

    icon.src = new_icon[0] == '/' ? new_icon : `/${new_icon}`
    icon.alt = icon_alt

    title_box.appendChild(icon)
    title_box.appendChild(msg)

    notification.appendChild(title_box)
    notification.appendChild(msg)

    document.body.appendChild(notification)

    setTimeout(() => notification.remove(), 4000)
  },
}

/** Module for handling internationalization.
 * @module useInternationalization
 * @param {Object} options - Configuration options for the module.
 * @param {Object} options.utils - Utility functions to be used by the module.
 * @returns {Object} - An object containing functions and data related to internationalization.
 */
function useInternationalization({ utils }) {
  const root = document.querySelector('html')
  const current_language = document.querySelector("[data-image='current-language']")
  const language_options = document.querySelector("[data-group='language-options']")
  const select_language = document.querySelector("[data-select='language']")

  const languages = {
    en: {
      value: 'English',
      icon: 'EmojioneFlagForUnitedStates.svg',
      alt: 'usd flag',
    },
    es: {
      value: 'Español',
      icon: 'EmojioneFlagForSpain.svg',
      alt: 'spain flag',
    },
  }

  const translations = {
    page_title: {
      en: 'TO-DO Application',
      es: 'Aplicación de Tareas',
    },
    save_progress: {
      en: 'save progress',
      es: 'guardar progreso',
    },
    todo_exist: {
      en: 'This to-do already exist',
      es: 'Esta tarea ya existe',
    },
    deleting_todo: {
      en: 'Deleting to-do',
      es: 'Eliminando tarea',
    },
    progress_saved: {
      en: 'Progress saved successfully',
      es: 'Progreso guardado con éxito',
    },
    add_todo: {
      en: 'Add a new to-do',
      es: 'Agrega una nueva tarea',
    },
    confirm: {
      en: 'Confirm',
      es: 'Confirmar',
    },
    cancel: {
      en: 'Cancel',
      es: 'Cancelar',
    },
    all_todos: {
      en: 'All',
      es: 'Todas',
    },
    completed_todos: {
      en: 'Completed',
      es: 'Completadas',
    },
    incomplete_todos: {
      en: 'Incomplete',
      es: 'Incompletas',
    },
  }

  function Translate() {
    const site_title = document.querySelector('title')
    const page_title = document.querySelector("[data-translate='page-title']")
    const save_progress = document.querySelector("[data-translate='save-progress']")
    const btn_all_todos = document.querySelector("[data-translate='all-todos']")
    const btn_completed_todos = document.querySelector("[data-translate='completed-todos']")
    const btn_incomplete_todos = document.querySelector("[data-translate='incomplete-todos']")

    site_title.innerText = translations.page_title[root.lang]
    page_title.innerText = translations.page_title[root.lang]
    save_progress.innerText = translations.save_progress[root.lang]
    input.placeholder = translations.add_todo[root.lang]
    btn_all_todos.innerText = translations.all_todos[root.lang]
    btn_completed_todos.innerText = translations.completed_todos[root.lang]
    btn_incomplete_todos.innerText = translations.incomplete_todos[root.lang]
  }

  function ChangeLanguage(lang) {
    root.lang = lang
    ChangeCurrentLanguageIcon(lang)
    Translate()
    todos.LoadTodos()
    localStorage['lang'] = lang
  }

  function GenerateLanguageOptions() {
    for (const item in languages) {
      const lang = languages[item]
      const option = CreateBtnLanguageOption(lang.value, lang.icon, lang.alt)

      option.addEventListener('click', () => {
        ChangeCurrentLanguageIcon(item)
        ChangeLanguage(item)
        ActivateLanguageSelection()
      })

      language_options.appendChild(option)
    }
  }

  /** Create a button element for language selection.
   * @param {string} txt - The text content of the button.
   * @param {string} icon - The url of the language flag icon.
   * @param {string} alt - The alt text for the language flag.
   * @returns {HTMLElement} - The created button element.
   */
  function CreateBtnLanguageOption(txt, icon, alt) {
    const btn = utils.CreateBtn()
    const span = document.createElement('span')
    const img = document.createElement('img')

    span.innerText = txt
    img.src = `${utils.ICONS}${icon}`
    img.alt = alt

    btn.classList.add('lang-option')

    btn.appendChild(span)
    btn.appendChild(img)

    return btn
  }

  function ActivateLanguageSelection() {
    language_options.classList.toggle('select-language-active')
  }

  function ChangeCurrentLanguageIcon(lang) {
    current_language.src = `${utils.ICONS}${languages[lang].icon}`
  }

  function SetDefaultLanguage() {
    if (localStorage['lang'] != undefined) {
      root.lang = localStorage['lang']
      ChangeLanguage(root.lang)
    } else {
      const browser_language = navigator.language || navigator.userLanguage
      const default_language = browser_language.split('-')[0]
      ChangeLanguage(default_language)
    }
  }

  select_language.addEventListener('click', () => ActivateLanguageSelection())

  return { translations, languages, Translate, ChangeLanguage, GenerateLanguageOptions, SetDefaultLanguage }
}

/** Manages the functionality of a to-do list.
 * @module useTodo
 * @param {Object} options - Configuration options for the module.
 * @param {HTMLElement} options.target - The target element where the to-do list will be rendered.
 * @param {Object} options.utils - Utility functions used by the module.
 * @param {Object} options.popups - Popup-related functions used by the module.
 * @returns {Object} An object containing functions to interact with the to-do list.
 */
function useTodo({ target, utils, popups, internationalization }) {
  const btn_save = document.querySelector("[data-btn='save-progress']")
  const btn_submit = document.querySelector("[data-btn='submit']")

  const todo_state = {
    CHECK: 'is-checked',
    EDIT: 'is-editing',
    BTN_CHECK: 'btn-check',
    BTN_EDIT: 'btn-edit',
    BTN_DELETE: 'btn-delete',
    BTN_CONTROL: 'btn-control',
    ICON_BTN: 'icon-btn',
  }

  const translations = internationalization.translations
  const btn_all_todos = document.querySelector("[data-btn='all-todos']")
  const btn_completed_todos = document.querySelector("[data-btn='completed-todos']")
  const btn_incomplete_todos = document.querySelector("[data-btn='incomplete-todos']")

  btn_save.addEventListener('click', () => SaveProgressInLocalStorage())
  btn_all_todos.addEventListener('click', () => LoadTodos())
  btn_completed_todos.addEventListener('click', () => LoadTodos(true))
  btn_incomplete_todos.addEventListener('click', () => LoadTodos(false, true))

  /** Adds a new to-do to the list of to-dos.
   * @param {Object} options - Configuration options for the function.
   * @param {String} options.value - New to-do value.
   * @param {String} options.class_list - New css classes for the to-do.
   * @param {String} options.value_class_list - New css classes for the element containing the value of the to-do.
   * @param {String} options.btn_check_class_list - New css classes for the button that sets the to-do as completed.
   * @param {String} options.btn_edit_class_list - New css classes for the button that allows editing the to-do.
   * @param {String} options.btn_delete_class_list - New css classes for the button that deletes the to-do.
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
    if (CheckIfTodoExist(value)) popups.CreateNotificationWithIcon('This to do already exist', popups.INFORMATION_ERROR_ICON, 'error icon', 'error-notification')
    else {
      const todo = document.createElement('li')
      const todo_value = document.createElement('p')
      const btn_group = document.createElement('div')
      const btn_check = utils.CreateIconBtn('/icons/ZondiconsCheckmarkOutline.svg', 'Check todo button')
      const btn_edit = utils.CreateIconBtn('/icons/ZondiconsCompose.svg', 'Edit todo button')
      const btn_delete = utils.CreateIconBtn('/icons/ZondiconsCloseOutline.svg', 'Delete todo button')

      todo.id = crypto.randomUUID()
      todo_value.innerText = value

      todo.classList = class_list ?? 'todo slide-from-and-stop'
      btn_check.classList = btn_check_class_list ?? `${todo_state.BTN_CHECK} ${todo_state.BTN_CONTROL} ${todo_state.ICON_BTN}`
      btn_edit.classList = btn_edit_class_list ?? `${todo_state.BTN_EDIT} ${todo_state.ICON_BTN}`
      btn_delete.classList = btn_delete_class_list ?? `${todo_state.BTN_DELETE} ${todo_state.BTN_CONTROL} ${todo_state.ICON_BTN}`
      todo_value.classList = value_class_list ?? 'no-outline'

      todo.classList.remove(todo_state.EDIT)
      btn_edit.classList.remove(todo_state.EDIT)

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

  /** Sets a to-do as editable
   * @param {Object} options - Configuration options for the function.
   * @param {HTMLElement} options.todo - The to-do element.
   * @param {HTMLElement} options.todo_value - Contains the value of the to-do.
   * @param {HTMLElement} options.btn_edit - Button that allows the to-do to be edited.
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
    todo.classList.add(todo_state.EDIT)
    btn_edit.classList.add(todo_state.EDIT)
    btn_edit.addEventListener('click', () => UpdateTodo({ todo, todo_value, btn_edit }))
  }

  /** Updates a to-do value.
   * @param {Object} options - Configuration options for the function.
   * @param {HTMLElement} options.todo - The to-do.
   * @param {HTMLElement} options.todo_value - Contains the value of the to-do.
   * @param {HTMLElement} options.btn_edit - button that allows the to-do to be edited.
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
    todo.classList.remove(todo_state.EDIT)
    btn_edit.classList.remove(todo_state.EDIT)
    btn_edit.addEventListener('click', () => EditTodo({ todo, todo_value, btn_edit }))
  }

  /** Sets a to-do as completed.
   * @param {Object} options - Configuration options for the function.
   * @param {HTMLElement} options.todo - The to-do
   * @param {HTMLElement} options.todo_value - Contains the value of the to-do.
   * @param {HTMLElement} options.btn_edit - Button that allows the to-do to be edited.
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
    todo.classList.toggle(todo_state.CHECK)
    UpdateTodo({ todo, todo_value, btn_edit })
  }

  /** Deletes a to-do.
   * @param {Object} options - Configuration options for the function.
   * @param {HTMLElement} options.todo - The to-do.
   * @param {HTMLElement} options.todo_value - Contains the value of the to-do.
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
    const { btn_confirm } = popups.CreateConfirmationDialog(translations.deleting_todo[root.lang], popups.INFORMATION_ERROR_ICON, 'error icon', 'warning-dialog', todo_value.innerText)
    btn_confirm.addEventListener('click', () => utils.DeleteDOMElement(todo))
  }

  function SaveProgressInLocalStorage() {
    const collection = Array.from(target.children)
    const new_collection = collection.map((item) => ({
      todo_class_list: item.classList.value,
      todo_value: item.querySelector('p').innerText,
      todo_value_class_list: item.querySelector('p').classList.value,
      btn_check_class_list: item.querySelector(`.${todo_state.BTN_CHECK}`).classList.value,
      btn_edit_class_list: item.querySelector(`.${todo_state.BTN_EDIT}`).classList.value,
      btn_delete_class_list: item.querySelector(`.${todo_state.BTN_DELETE}`).classList.value,
    }))
    const json = JSON.stringify(new_collection)
    localStorage[`todos_${root.lang}`] = json
    popups.CreateNotificationWithIcon(translations.progress_saved[root.lang], popups.INFORMATION_SUCCESS_ICON, 'success icon', 'success-notification')
  }

  function LoadTodos(completed = false, incomplete = false) {
    DeleteAllTodos()
    const todos = localStorage[`todos_${root.lang}`]
    if (todos) {
      const collection = Array.from(JSON.parse(todos))
      collection.forEach((todo) => {
        if (completed) FilterCompletedTodos(todo)
        else if (incomplete) FilterTodosIncomplete(todo)
        else SetNewTodo(todo)
      })
    }
  }

  function SetNewTodo(todo) {
    AddTodo({
      value: todo.todo_value,
      class_list: todo.todo_class_list,
      value_class_list: todo.todo_value_class_list,
      btn_check_class_list: todo.btn_check_class_list,
      btn_edit_class_list: todo.btn_edit_class_list,
      btn_delete_class_list: todo.btn_delete_class_list,
    })
  }

  const FilterCompletedTodos = (todo) => (todo.todo_class_list.includes(todo_state.CHECK) ? SetNewTodo(todo) : null)
  const FilterTodosIncomplete = (todo) => (!todo.todo_class_list.includes(todo_state.CHECK) ? SetNewTodo(todo) : null)
  const DeleteAllTodos = () => Array.from(target.children).forEach((element) => element.remove())

  /** Checks if a to-do already exist.
   * @param {todo} todo - Required to-do to be checked.
   * @returns {number} 1 if the to-do exists, 0 if not.
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

  btn_submit.addEventListener('click', (event) => {
    event.preventDefault()
    if (input.value) todos.AddTodo({ value: input.value })
    else popups.CreateNotificationWithIcon(internationalization.translations.add_todo[root.lang], '/icons/ZondiconsInformationOutlineInform.svg', 'inform icon', 'inform-notification')
  })

  return { AddTodo, EditTodo, UpdateTodo, CompleteTodo, SaveProgressInLocalStorage, LoadTodos, CheckIfTodoExist }
}

utils.SetColorTheme()
const internationalization = useInternationalization({ utils })
const todos = useTodo({ target: todo_list, utils, popups, internationalization })

internationalization.GenerateLanguageOptions()
internationalization.SetDefaultLanguage()

todos.LoadTodos()

btn_change_color_theme.addEventListener('click', () => utils.ChangeColorTheme())
