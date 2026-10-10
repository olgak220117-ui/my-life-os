(() => {
  'use strict';
  const KEY='my-life-os-todos-v1';
  const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const card=document.querySelector('#screen-today .mini-stat');
  if(!card)return;
  // Existing Today stats remain in the DOM for the original app's rendering.
  const original=document.createElement('div');original.hidden=true;
  while(card.firstChild)original.appendChild(card.firstChild);
  card.appendChild(original);card.classList.remove('mini-stat');card.classList.add('todo-card');
  const panel=document.createElement('div');card.appendChild(panel);
  let tasks;try{const data=JSON.parse(localStorage.getItem(KEY));tasks=Array.isArray(data)?data:[];}catch{tasks=[];}
  let removed=null;
  const dialog=document.createElement('dialog');dialog.className='todo-editor';
  dialog.innerHTML='<form id="todoEditForm"><h3>Редактировать задачу</h3><label>Задача<input class="field" id="todoEditText" required maxlength="200"></label><div class="todo-editor-actions"><button type="button" class="secondary-btn" id="todoEditCancel">Отмена</button><button type="submit" class="primary-btn">Сохранить</button></div></form>';
  document.body.appendChild(dialog);let editId=null;
  function save(){try{localStorage.setItem(KEY,JSON.stringify(tasks));return true;}catch{panel.querySelector('#todoMessage').textContent='Не удалось сохранить: хранилище браузера недоступно';return false;}}
  function row(t){return `<div class="todo-row ${t.done?'done':''}"><input type="checkbox" data-toggle="${t.id}" ${t.done?'checked':''} aria-label="Выполнено: ${escape(t.text)}"><button class="todo-label" data-edit="${t.id}" aria-label="Редактировать: ${escape(t.text)}">${escape(t.text)}</button><button class="todo-remove" data-remove="${t.id}" aria-label="Удалить: ${escape(t.text)}">×</button></div>`;}
  function render(){
    const active=tasks.filter(t=>!t.done),done=tasks.filter(t=>t.done);
    panel.innerHTML=`<div class="todo-heading"><span class="stat-icon coral">✓</span><div><h3>To-do</h3><p>${active.length?'Открытых задач: '+active.length:'Что хочешь сделать?'}</p></div></div><form class="todo-form" id="todoForm" style="margin-top:16px"><input class="todo-new" id="todoNewText" aria-label="Новая задача" placeholder="Добавить задачу…" maxlength="200" required><button class="todo-add" aria-label="Добавить задачу" type="submit">+</button></form><div class="todo-list" style="margin-top:8px">${active.length?active.map(row).join(''):'<p class="todo-empty">Добавь первую задачу — она останется здесь, пока ты её не выполнишь.</p>'}</div>${done.length?`<details class="todo-completed"><summary>Выполнено · ${done.length}</summary><div class="todo-list">${done.map(row).join('')}</div></details>`:''}<p class="todo-message" id="todoMessage" role="status" aria-live="polite">${removed?'Задача удалена <button class="todo-undo" id="todoUndo">Отменить</button>':''}</p>`;
    panel.querySelector('#todoForm').onsubmit=e=>{e.preventDefault();const input=panel.querySelector('#todoNewText'),text=input.value.trim();if(!text){input.value='';input.focus();return;}tasks.push({id:crypto.randomUUID(),text,done:false,createdAt:Date.now()});removed=null;save();render();panel.querySelector('#todoNewText').focus();};
    panel.querySelectorAll('[data-toggle]').forEach(b=>b.onchange=()=>{tasks.find(t=>t.id===b.dataset.toggle).done=b.checked;save();render();});
    panel.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{editId=b.dataset.edit;dialog.querySelector('#todoEditText').value=tasks.find(t=>t.id===editId).text;dialog.showModal();dialog.querySelector('#todoEditText').focus();});
    panel.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{const index=tasks.findIndex(t=>t.id===b.dataset.remove);removed={task:tasks[index],index};tasks.splice(index,1);save();render();});
    if(removed)panel.querySelector('#todoUndo').onclick=()=>{tasks.splice(removed.index,0,removed.task);removed=null;save();render();};
  }
  dialog.querySelector('#todoEditCancel').onclick=()=>dialog.close();
  dialog.querySelector('#todoEditForm').onsubmit=e=>{e.preventDefault();const text=dialog.querySelector('#todoEditText').value.trim();if(!text)return;tasks.find(t=>t.id===editId).text=text;save();render();dialog.close();};
  render();
})();
